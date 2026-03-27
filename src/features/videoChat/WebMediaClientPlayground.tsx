// WebMediaClientPlayground.tsx
import React, { useMemo, useRef, useState } from 'react';
import { WebMediaClient, MessageContainer } from './WebMediaClient'; // STOMP 버전


export default function WebMediaClientPlayground() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<WebMediaClient | null>(null);

  const roomId = '1';
  const token = localStorage.getItem('accessToken') || '';
  const wsUrl = 'http://localhost:8090/webmedia-ws';

  const pushLog = (line: string) =>
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`]);

  // 서버발 이벤트 콜백
  const onServerEvent = (evt: MessageContainer) => {
    pushLog(`event ← type=${evt.type} payload=${JSON.stringify(evt.message ?? evt.payload)}`);
  };

  const ensureClient = () => {
    if (!clientRef.current) {
      clientRef.current = new WebMediaClient(onServerEvent, {
        topicPrefix: '/topic/vc',
        appPrefix: '/app/vc',
        authHeaderName: 'Authorization',
        debug: true,
      });
    }
    return clientRef.current!;
  };

  const handleConnect = async () => {
    try {
      const c = ensureClient();
      await c.connect(wsUrl, roomId, token); // 헤더로 토큰 전송
      setConnected(true);
      pushLog('connected ✓ (subscribed to /topic/vc/1)');
    } catch (e: any) {
      pushLog(`connect ✗ ${e?.message || e}`);
    }
  };

  const handleJoin = async () => {
    try {
      const c = ensureClient();
      const res = await c.sendMessage(
        { nickname: 'tester' },        // payload
        'joinRequestPayload',          // 서버 MessageType과 동일 문자열
        true                           // 트랜잭션(응답 기다림)
      );
      pushLog(`join → ok, resp=${JSON.stringify(res)}`);
    } catch (e: any) {
      pushLog(`join ✗ ${e?.message || e}`);
    }
  };

  const handlePublishReport = async () => {
    try {
      const c = ensureClient();
      await c.sendMessage(
        { published: true },           // payload
        'publishReportPayload',
        false                          // fire-and-forget
      );
      pushLog('publishReport → sent (no response expected)');
    } catch (e: any) {
      pushLog(`publishReport ✗ ${e?.message || e}`);
    }
  };

  const handleLeave = async () => {
    try {
      const c = ensureClient();
      const res = await c.sendMessage(
        {},                            // 비어있는 payload
        'leaveRequestPayload',
        true
      );
      pushLog(`leave → ok, resp=${JSON.stringify(res)}`);
    } catch (e: any) {
      pushLog(`leave ✗ ${e?.message || e}`);
    }
  };

  const handleDisconnect = () => {
    clientRef.current?.close();
    clientRef.current = null;
    setConnected(false);
    pushLog('disconnected');
  };

  return (
    <div style={{ padding: 16, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
      <h3>WebMediaClient Playground</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={handleConnect} disabled={connected}>Connect</button>
        <button onClick={handleJoin} disabled={!connected}>Join (transaction)</button>
        <button onClick={handlePublishReport} disabled={!connected}>PublishReport (fire-and-forget)</button>
        <button onClick={handleLeave} disabled={!connected}>Leave (transaction)</button>
        <button onClick={handleDisconnect}>Disconnect</button>
      </div>

      <pre style={{ background: '#0b1020', color: '#cdeaff', padding: 12, maxHeight: 320, overflow: 'auto' }}>
        {logs.join('\n')}
      </pre>
    </div>
  );
}
