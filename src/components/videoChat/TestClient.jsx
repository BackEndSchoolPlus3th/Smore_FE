import React, { useEffect, useRef } from 'react';
import WebMediaClient from '../WebMediaClient';

export function TestClient() {
  const videoRef = useRef(null);

  useEffect(() => {
    const client = new WebMediaClient();

    (async () => {
      await client.initMedia();
      const stream = client.getLocalStream();
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    })();
  }, []);

  return (
    <div>
      <h2>🔍 WebMediaClient 테스트</h2>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '400px' }} />
    </div>
  );
}
