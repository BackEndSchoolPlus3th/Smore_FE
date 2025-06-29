import React, { useEffect, useRef, useState } from "react";
import "./VideoChat.css";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

/** JWT에 Bearer 접두어 추가 */
const addBearer = (token: string) => {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

const VideoChat: React.FC = () => {
    const stompClientRef = useRef<Client | null>(null); // STOMP 클라이언트
    const connectedRef = useRef<boolean>(false); // STOMP 연결 상태
    const [jwt,setJwt] = useState<string>(() => {                      // JWT 토큰 상태
      const token = localStorage.getItem('accessToken') || '';
      console.log("비디오채팅 JWT 토큰:", token);
      return token;
    }); 
    
    const connectWebSocket = () => {
      console.log('웹소켓 연결 시도 중...');

      // 기존 연결 해제
      if (stompClientRef.current) {
          stompClientRef.current.deactivate();
          stompClientRef.current = null;
      }

      const roomId = 'test-room'; // 테스트용 roomId

      // SockJS를 사용하여 WebSocket 연결 생성
      const socket = new SockJS(
        `http://localhost:8090/ws?token=${jwt}`,
        undefined,
        {
          xhrWithCredentials: true, // CORS 허용
        } as any
      );

      stompClientRef.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: addBearer(jwt), // JWT 토큰을 헤더에 추가
        },
        debug: (str) => {
          console.log(new Date(), str);
        },
        onConnect: () => {
          console.log("✅ WebSocket 연결 성공");
          connectedRef.current = true; // 연결 상태 업데이트

          // 연결 후 초기화 작업

          // ✅ 1. 구독
          stompClientRef.current?.subscribe(`/topic/signal/${roomId}`,
            (msg) => {
            try {
              const data = JSON.parse(msg.body);
              console.log('📩 서버 응답 수신:', data);
            } catch (e) {
              console.error('❌ 메시지 파싱 오류:', e);
            }
          });

          // ✅ 2. 테스트용 ping 전송
          stompClientRef.current?.publish({
            destination: `/app/signal/send/${roomId}`,
            body: JSON.stringify({
              type: 'ping',
              message: '프론트에서 ping 전송',
            }),            
          });

          console.log('📤 ping 전송 완료');
        },          
        onStompError: (frame) => {
          console.error('❌ STOMP 에러', frame);
        },
        onWebSocketClose: () => {
          console.warn('⚠️ WebSocket 닫힘');
        },
        onWebSocketError: (e) => {
          console.error('❌ WebSocket 오류', e);
        },
    });        
      stompClientRef.current.activate();
};

  useEffect(() => {
    connectWebSocket();

  return () => {
        if (stompClientRef.current) {
          stompClientRef.current.deactivate();
          console.log('🧹 WebSocket 연결 해제');
        }
      };
    }, [jwt]);


  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">WebSocket Ping-Pong 테스트</h2>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={connectWebSocket}
      >
        다시 연결하기
      </button>
    </div>
  );
};
export default VideoChat;