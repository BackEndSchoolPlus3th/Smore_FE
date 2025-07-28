import React, { useEffect, useRef, useState } from 'react';
import { WebMediaClient } from '../features/videoChat/WebMediaClient';
import { WebMediaPublisher } from '../features/videoChat/WebMediaPublisher';

// WebMediaClient, WebMediaPublisher 테스트
const TestWebMediaClientAndPublisher: React.FC = () => {
  const clientRef = useRef<WebMediaClient | null>(null);
  const publisherRef = useRef<ReturnType<typeof WebMediaPublisher> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [publishStream, setPublishStream] = useState<MediaStream | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const WEBSOCKET_URL = 'ws://localhost:8080/webmedia-ws'; // WebSocket 연결 주소
  const ROOM_ID = 'test-room';
  const API_URL = 'http://localhost:8080'; // WebRTC API 주소
  const STREAM_URL = 'webrtc://localhost/live';
  const APP_ID = 'live';
  const FEED_ID = 'publisher1';

  // WebSocket 연결
  useEffect(() => {
    const client = new WebMediaClient((container) => {
      setMessages(prev => [...prev, `📩 수신된 메시지: ${JSON.stringify(container)}`]);
    });

    clientRef.current = client;

    client.connect(WEBSOCKET_URL, ROOM_ID)
      .then(() => {
        setConnected(true);
        console.log('✅ WebSocket 연결 성공');
      })
      .catch((err) => {
        console.error('❌ 연결 실패:', err);
      });

    return () => {
      client.close();
      setConnected(false);
    };
  }, []);

  // 사용자 카메라 권한 요청 및 스트림 획득
  const getCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPublishStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('❌ 카메라 접근 실패:', err);
    }
  };

  // WebMediaPublisher 통해 송출 시작
  const startPublishing = async () => {
    if (!publishStream) return;

    const publisher = WebMediaPublisher(API_URL, STREAM_URL);
    publisherRef.current = publisher;

    try {
      const result = await publisher.publish(publishStream, APP_ID, FEED_ID);
      setIsPublishing(true);
      setMessages(prev => [...prev, `📡 송출 시작됨: ${JSON.stringify(result)}`]);
    } catch (err) {
      console.error('❌ 송출 실패:', err);
      setMessages(prev => [...prev, `❌ 송출 실패: ${err.message}`]);
    }
  };

  // 송출 종료
  const stopPublishing = () => {
    if (publisherRef.current) {
      publisherRef.current.close();
      publisherRef.current = null;
    }
    setIsPublishing(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📡 WebMediaClient & Publisher 테스트</h2>
      <p>연결 상태: {connected ? '🟢 연결됨' : '🔴 연결 안 됨'}</p>

      <button onClick={getCameraStream}>🎥 카메라 스트림 요청</button>
      <button onClick={startPublishing} disabled={!connected || !publishStream || isPublishing}>🚀 송출 시작</button>
      <button onClick={stopPublishing} disabled={!isPublishing}>⛔ 송출 종료</button>
      <button
        onClick={() => {
          if (!clientRef.current) return;
          const message = { text: 'Hello from client', time: new Date().toISOString() };
          clientRef.current.sendMessage(message, 'echo', true)
            .then((res) => {
              setMessages(prev => [...prev, `✅ 응답 수신: ${JSON.stringify(res)}`]);
            })
            .catch((err) => {
              setMessages(prev => [...prev, `❌ 오류: ${err.message}`]);
            });
        }}
        disabled={!connected}
      >
        📤 메시지 전송
      </button>

      <div style={{ marginTop: '1rem' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '480px',
            height: '360px',
            background: 'black',
            objectFit: 'cover',
          }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>📜 로그</h4>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestWebMediaClientAndPublisher;
