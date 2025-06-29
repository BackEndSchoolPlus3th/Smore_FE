import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getAccessToken, addBearer } from "../../../shared/utils/token";

// ICE 서버 설정
const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

const useWebRTCConnection = ({ roomId }: { roomId: string }) => {
  const stompClientRef = useRef<Client | null>(null);
  const cleanupRef = useRef<() => void>();
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isStompConnected, setIsStompConnected] = useState(false);
  const jwt = getAccessToken();

  const handleReceivedOffer = async (payload: any) => {
    console.log("📡 받은 Offer 처리 중...");

    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
      setupPeerListeners(peerConnectionRef.current);
    }

    const peerConnection = peerConnectionRef.current;

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      sendAnswer({ sdp: peerConnection.localDescription });
    } catch (err) {
      console.error("❌ Offer 처리 중 오류:", err);
    }
  };

  const handleReceivedAnswer = async (payload: any) => {
    console.log("📡 받은 Answer 처리 중...");

    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    } catch (err) {
      console.error("❌ Answer 처리 중 오류:", err);
    }
  };

  const handleReceivedIce = async (payload: any) => {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    try {
      const candidate = new RTCIceCandidate(payload.candidate);
      await peerConnection.addIceCandidate(candidate);
    } catch (err) {
      console.error("❌ ICE 처리 중 오류:", err);
    }
  };

  const setupPeerListeners = (pc: RTCPeerConnection) => {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendIceCandidate({ candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      console.log("🎥 상대방 미디어 수신");
      // remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const handleSignalMessage = (payload: any) => {
    switch (payload.type) {
      case "offer":
        handleReceivedOffer(payload);
        break;
      case "answer":
        handleReceivedAnswer(payload);
        break;
      case "ice":
        handleReceivedIce(payload);
        break;
      default:
        console.warn("❓ 알 수 없는 타입:", payload.type);
    }
  };

  const sendOffer = (data: any) => {
    stompClientRef.current?.publish({
      destination: `/app/room/${roomId}`,
      body: JSON.stringify({ type: "offer", ...data }),
    });
  };

  const sendAnswer = (data: any) => {
    stompClientRef.current?.publish({
      destination: `/app/room/${roomId}`,
      body: JSON.stringify({ type: "answer", ...data }),
    });
  };

  const sendIceCandidate = (data: any) => {
    stompClientRef.current?.publish({
      destination: `/app/room/${roomId}`,
      body: JSON.stringify({ type: "ice", ...data }),
    });
  };

  useEffect(() => {
    if (!jwt) {
      console.warn("❌ accessToken 없음. 연결 중단.");
      return;
    }

    const socket = new SockJS(`http://localhost:8090/videochatWS?token=${jwt}`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: addBearer(jwt),
      },
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");
        stompClientRef.current = client;
        setIsStompConnected(true);

        console.log("📌 구독 시작 (roomId:", roomId, ")");
        const subscription = client.subscribe(
          `/topic/room/${roomId}`,
          (message) => {
            const payload = JSON.parse(message.body);
            console.log("📩 WebRTC 메시지 수신:", payload);
            handleSignalMessage(payload);
          }
        );

        cleanupRef.current = () => {
          subscription.unsubscribe();
          console.log("🧹 구독 해제 완료");
        };
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 에러:", frame.body);
      },
      onWebSocketError: (event) => {
        console.error("⚠️ WebSocket 에러:", event);
      },
    });

    client.activate();

    return () => {
      console.log("🧹 WebSocket 연결 종료");
      client.deactivate();
      stompClientRef.current = null;
      setIsStompConnected(false);
      cleanupRef.current?.();
    };
  }, [jwt, roomId]);

  return {
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    peerConnectionRef, // 필요하면 외부에서 접근 가능
  };
};

export default useWebRTCConnection;
