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
        // console.log('현재 로그인 사용자 ID(JWT sub 필드):', decoded.sub);
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
    // console.log("비디오채팅 JWT 토큰:", token);
    return token;
  }); 
  const roomId = 'test-room'; // 테스트용 roomId
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);    
  const [isInitiator, setIsInitiator] = useState<boolean>(false);


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

    const socket = new SockJS(
      `http://localhost:8090/ws?token=${jwt}`,
      undefined,
      { xhrWithCredentials: true } as any
    );

    stompClientRef.current = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: addBearer(jwt), // JWT 토큰을 헤더에 추가
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
        console.log('🖥️ PeerConnection 생성 완료');

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
          console.log("🎥 나의 로컬 스트림 추가 완료");
          console.log("나의 localStream:", localStream);
          console.log("typeof localStream:", typeof localStream);
          console.log("나의 pc:", pc);
          console.log("typeof pc:", typeof pc);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
        } catch (err) {
          console.error("❌ getUserMedia 실패:", err);
        }          

      stompClientRef.current?.subscribe(`/topic/signal/${roomId}`, async (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("📩 서버에서 받은 메시지:", data);

          // ✅ userCount 기준으로 initiator 판단
          if (data.userCount === 1) {
            setIsInitiator(true);
            console.log("🟢 나는 첫 번째 참가자입니다 (isInitiator: true)");
          } else {
            setIsInitiator(false);
            console.log("🟡 나는 두 번째 참가자입니다 (isInitiator: false)");
          }  
        } catch (error) {
          console.error('❌ 메시지 파싱 오류:', error);
    }
  });
  sendSignal('join', {userId: currentUserId}); // 방 참여 신호 전송
      }
  })
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