import React, { useEffect, useRef, useState } from "react";
import "./VideoChat.css";
import SockJS from 'sockjs-client';
import { jwtDecode } from 'jwt-decode';
import { Client } from '@stomp/stompjs';
import { current } from "@reduxjs/toolkit";

/** JWT에 Bearer 접두어 추가 */
const addBearer = (token: string) => {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

/** JWT 디코딩하여 사용자 ID(subject) 추출 */
const getUserIdFromToken = (token: string): string => {
    try {
        if (!token || token === '') {
            console.warn('JWT 토큰이 비어있습니다.');
            return 'anonymous';
        }
        const actualToken = token.startsWith('Bearer ')
            ? token.substring(7)
            : token;
        const decoded: any = jwtDecode(actualToken);
        console.log('JWT 디코딩 결과:', decoded);

        if (!decoded) {
            console.error('JWT 디코딩 결과가 없습니다.');
            return 'anonymous';
        }
        if (!decoded.sub) {
            console.error('JWT에서 sub 필드를 찾을 수 없습니다:', decoded);
            if (decoded.userId) {
                return String(decoded.userId);
            } else if (decoded.id) {
                return String(decoded.id);
            }
            return 'anonymous';
        }
        console.log('현재 로그인 사용자 ID(JWT sub 필드):', decoded.sub);
        return String(decoded.sub);
    } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        console.error('토큰 값:', token.substring(0, 20) + '...');
        return 'anonymous';
    }
};

const VideoChat: React.FC = () => {
    const stompClientRef = useRef<Client | null>(null); // STOMP 클라이언트
    const connectedRef = useRef<boolean>(false); // STOMP 연결 상태
    const [jwt,setJwt] = useState<string>(() => {                      // JWT 토큰 상태
      const token = localStorage.getItem('accessToken') || '';
      console.log("비디오채팅 JWT 토큰:", token);
      return token;
    }); 
    const roomId = 'test-room'; // 테스트용 roomId
    

    // 현재 사용자 ID 초기화
    const [currentUserId, setCurrentUserId] = useState<string>(() => {
        const storedToken = localStorage.getItem('accessToken') || '';
        const userId = getUserIdFromToken(storedToken);
        console.log(
            '초기 사용자 ID 설정:',
            userId,
            '(타입:',
            typeof userId,
            ')'
        );
        return userId;
    });


    const sendSignal = (type: string, payload: object) => {
      if (!stompClientRef.current?.connected) {
        console.error('❌ STOMP 클라이언트가 연결되어 있지 않습니다.');
        return;
      } 
      stompClientRef.current.publish({
        destination: `/app/signal/send/${roomId}`,
        body: JSON.stringify({
            type,
            sender: currentUserId, 
            ...payload 
          }),
        headers: {
          Authorization: addBearer(jwt), // JWT 토큰을 헤더에 추가
      }
      });
      console.log(`📤 ${type} 신호 전송:`, payload);
    };

    const connectWebSocket = () => {
      console.log('웹소켓 연결 시도 중...');

      // 기존 연결 해제
      if (stompClientRef.current) {
          stompClientRef.current.deactivate();
          stompClientRef.current = null;
      }   

      

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

        
          console.log('🛠 구독 시도 중...');
          // ✅ [1] 시그널링 메시지 구독
          stompClientRef.current?.subscribe(`/topic/signal/${roomId}`, (msg) => {
            try {
              const data = JSON.parse(msg.body);
              console.log('📩 서버 응답 수신:', data);

              // 여기서 type: 'offer', 'answer', 'candidate' 처리할 예정
              switch (data.type) {
                case 'offer':
                  // handleOffer(data)
                  break;
                case 'answer':
                  // handleAnswer(data)
                  break;
                case 'candidate':
                  // handleCandidate(data)
                  break;
              }
            } catch (e) {
              console.error('❌ 메시지 파싱 오류:', e);
            }
          });         
          sendSignal('offer', { sdp: 'dummy-offer-sdp' });        
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
    <div>
      <h2>🔧 WebRTC 테스트</h2>
      <button onClick={() => {       
        connectWebSocket();
      }}>
        📤 Offer 보내기
      </button>
    </div>
  );
};
export default VideoChat;