// services/WebMediaClient.ts (Legacy 호환 STOMP 버전)
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

const TransactionTimeout = 30_000;

export interface MessageContainer {
  messageId: string;
  message: any;          // ← 서버 payload를 여기에 매핑해 기존 코드와 호환
  [key: string]: any;    // roomId, userId, sentAt, type, payload(원본) 등
}

type Transaction = {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
};

export type MessageCallback = (container: MessageContainer) => void;
const DefaultMessageCallback: MessageCallback = () => {};

type Options = {
  topicPrefix?: string;       // 기본 '/topic/vc'
  appPrefix?: string;         // 기본 '/app/vc'
  authHeaderName?: string;    // 기본 'Authorization'
  debug?: boolean;            // 기본 false
};

export class WebMediaClient {
  private _nextMessageId = 0;
  private _transactionMap: Record<string, Transaction> = {};
  private _messageCallback: MessageCallback;

  // public 프로퍼티는 Legacy와 동일하게 유지
  public roomId: string | null = null;
  public connected = false;
  public client: WebSocket | null = null; // (STOMP 내부에서 쓰므로 여기선 사용하지 않지만 인터페이스 유지)

  // STOMP 관련 내부 상태(외부 API에는 영향 없음)
  private _stomp: Client | null = null;

  private _topicPrefix: string;
  private _appPrefix: string;
  private _authHeaderName: string;
  private _debug: boolean;
  private _currentToken?: string;

  constructor(messageCallback: MessageCallback = DefaultMessageCallback, opts: Options = {}) {
    this._messageCallback = messageCallback;
    this._topicPrefix = opts.topicPrefix ?? '/topic/vc';
    this._appPrefix   = opts.appPrefix   ?? '/app/vc';
    this._authHeaderName = opts.authHeaderName ?? 'Authorization';
    this._debug = !!opts.debug;
  }

  /**
   * Legacy와 동일한 시그니처 유지:
   *  - websocketUrl: SockJS 엔드포인트(예: http://localhost:8090/webmedia-ws)
   *  - roomId: 방 ID
   *  - token?: 액세스 토큰 (헤더로만 보냄)
   */
  connect = (websocketUrl: string, roomId: string, token?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this._addTransaction('connect', resolve, reject);
      this.roomId = roomId;
      this._currentToken = token;
      this._stomp = new Client({
        webSocketFactory: () => new SockJS(
          token ? `${websocketUrl}?token=${token}` : websocketUrl,
          undefined,
          { xhrWithCredentials: true } as any
        ) as any,

        connectHeaders: token ? { [this._authHeaderName]: `Bearer ${token}` } : {},

        debug: this._debug 
            ? (msg: string) => console.log('[STOMP]', msg) 
            : () => {},      // 연결 성공 시
        onConnect: () => {
          this.connected = true;
          console.log(`[STOMP] Connected. Subscribing to room: ${roomId}`);
          this._stomp?.subscribe(
            `${this._topicPrefix}/${roomId}`,
            this._onStompMessage,
            this._currentToken ? {[this._authHeaderName]: `Bearer ${this._currentToken}`} : {}
          );
          const connectTransaction = this._getTransaction('connect');
          if (connectTransaction) {
            connectTransaction.resolve();
            console.log('[STOMP] Connect transaction resolved.');
          }
        },

        // 에러 발생 시
        onStompError: (frame) => {
          const err = new Error(frame.headers['message'] || 'STOMP error');
          this._getTransaction('connect')?.reject(err);
        },

        onWebSocketClose: () => {
          this.connected = false;
        }
      });

      // 실행!
      this._stomp.activate();
      // this.client = null;
    });
  };

  /**
   * Legacy와 동일한 시그니처/동작:
   * - isTransaction=true면 서버 응답의 messageId로 resolve
   * - false면 fire-and-forget
   * - 전송 객체는 서버 규약에 맞춰 payload로 보냄(내부에서 message → payload 매핑)
   */
  sendMessage = (
    message: any,
    type: string,
    isTransaction: boolean
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!this.connected || !this._stomp?.connected) {
        reject(new Error('접속 중이 아닙니다'));
        return;
      }
      if (!this.roomId) {
        reject(new Error('roomId가 설정되지 않았습니다'));
        return;
      }

      const messageId = String(this._nextMessageId++);
      // 서버 DTO에 맞춰 보낼 때는 payload 키 사용
      const outbound = {
        messageId,
        roomId: this.roomId,
        userId: '1', // 필요 시 채워 넣으세요
        sentAt: new Date().toISOString(),
        type,
        payload: message,   // ← Legacy의 message를 서버 규약 payload로 매핑
      };
      console.dir(outbound);

      if (isTransaction) {
        this._addTransaction(messageId, resolve, reject);
        console.log(`[DEBUG] 트랜잭션 등록 완료: ${messageId}`);
      }

      try {
            this._stomp!.publish({
                destination: `${this._appPrefix}/${this.roomId}`,
                body: JSON.stringify(outbound),
                headers: this._currentToken ? { [this._authHeaderName]: `Bearer ${this._currentToken}` } : {},
            });
            console.log('[DEBUG] STOMP Publish 완료');
        } catch (e) {
            console.error('[DEBUG] Publish 실패:', e);
            return reject(e);
        }

      if (!isTransaction) {
        resolve(null);
      }
    });
  };

  close = () => {
    this.connected = false;
    this._stomp?.deactivate();
    this._stomp = null;
    this.client = null;
  };

  // ---- 내부 구현 ----
  private _onStompMessage = (msg: IMessage) => {
    try {
      const body = msg.body ? JSON.parse(msg.body) : null;
      console.log("[STOMP 수신 Raw]:", body.type, body.messageId);
      if (!body) return;

      // 서버에서 온 원본은 { payload } 형식.
      // Legacy 호환을 위해 message로 **복제 매핑**해서 넘겨줍니다.
      const legacyContainer: MessageContainer = {
        ...body,
        message: body.message || body.payload, // ← 핵심: 수신도 message로 매핑
      };

      const t = this._getTransaction(legacyContainer.messageId);
      if (t) {
        t.resolve(legacyContainer);
      } else {
        this._messageCallback(legacyContainer);
      }
    } catch (e) {
      console.error('JSON parse error:', e);
    }
  };

  private _addTransaction = (
    key: string,
    resolve: (value?: any) => void,
    reject: (reason?: any) => void
  ) => {
    this._transactionMap[key] = { resolve, reject };
    setTimeout(() => {
      const tx = this._transactionMap[key];
      if (tx) {
        delete this._transactionMap[key];
        tx.reject(new Error('Transaction 시간 초과'));
      }
    }, TransactionTimeout);
  };

  private _getTransaction = (key: string): Transaction | undefined => {
    const tx = this._transactionMap[key];
    if (tx) delete this._transactionMap[key];
    return tx;
  };
}
