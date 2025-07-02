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
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);


    

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
        onConnect: async () => {
          console.log("✅ WebSocket 연결 성공");
          connectedRef.current = true; // 연결 상태 업데이트

          // 1. PeerConnection 생성
          const pc = new RTCPeerConnection({
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' }, // 공개 STUN 서버
            ]
          });
          peerConnectionRef.current = pc;

          // ✅ local stream 추가
          try {
            const localStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
            localStream.getTracks().forEach(track => {
              pc.addTrack(track, localStream);
            });
            console.log("🎥 로컬 스트림 추가 완료");
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
          } catch (err) {
            console.error("❌ getUserMedia 실패:", err);
          }          

          // ice candidate 설정
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              sendSignal('candidate', { candidate: event.candidate });
            }
          };

          // 2. offer 생성
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log('📤 offer 생성 완료:', offer);

          // 3. offer를 시그널링 서버에 전송
          sendSignal('offer', { sdp: offer });


          // ✅ [1] 시그널링 메시지 구독
          stompClientRef.current?.subscribe(`/topic/signal/${roomId}`, async (msg) => {
            try {
              const data = JSON.parse(msg.body);
              console.log('📩 서버 응답 수신:', data);

              // 여기서 type: 'offer', 'answer', 'candidate' 처리할 예정
              switch (data.type) {
                case 'offer':
                  console.log('📥 offer 수신:', data.sdp);
                  // 1. PeerConnection 생성 (응답자)
                  const remotePc = new RTCPeerConnection({
                    iceServers: [
                      { urls: 'stun:stun.l.google.com:19302' },
                    ]
                  });
                  peerConnectionRef.current = remotePc;

                  remotePc.ontrack = (event) => {
                    console.log('📺 상대방 트랙 수신:', event.streams);
                    if (remoteVideoRef.current) {
                      remoteVideoRef.current.srcObject = event.streams[0];
                    }
                  };
                  // ice candidate 설정
                  remotePc.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendSignal('candidate', { candidate: event.candidate });
                      }
                    };

                  // 2. 받은 offer 설정
                  await remotePc.setRemoteDescription(new RTCSessionDescription(data.sdp));

                  // 3. answer 생성 및 전송
                  const answer = await remotePc.createAnswer();
                  await remotePc.setLocalDescription(answer);
                  sendSignal('answer', { sdp: answer });
                  break;            

                case 'answer':
                  console.log('📥 answer 수신:', data.sdp);
                  if (peerConnectionRef.current) {
                    await peerConnectionRef.current.setRemoteDescription(
                      new RTCSessionDescription(data.sdp)
                    );
                  }              
                  break;
                case 'candidate':                  
                  if (peerConnectionRef.current) {
                    try {
                      await peerConnectionRef.current.addIceCandidate(
                        new RTCIceCandidate(data.candidate)
                      );
                      console.log('🧊 ICE candidate 추가됨:', data.candidate);
                    } catch (err) {
                      console.error('❌ ICE candidate 추가 실패:', err);
                    }
                  }
                  break;
              }
            } catch (e) {
              console.error('❌ 메시지 파싱 오류:', e);
            }
          });         
          // sendSignal('offer', { sdp: 'dummy-offer-sdp' });        
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
  <div className="col-span-6 w-full h-full flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md">
    <h2 className="text-2xl font-bold mb-2">🎥 WebRTC 화상채팅</h2>

    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      {/* 상대방 비디오 */}
      <div className="flex-1 bg-black rounded-lg overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
      </div>

      {/* 내 비디오 */}
      <div className="flex-1 bg-black rounded-lg overflow-hidden">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
);







}
export default VideoChat;