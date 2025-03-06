import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SSEContext = createContext(null);

export const SSEProvider = ({ children }) => {
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const [events, setEvents] = useState([]); // SSE 메시지를 저장할 상태

    // 🔹 SSE 연결을 설정하는 함수
    const connectSSE = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close(); // 기존 연결 닫기
        }

        console.log('🔗 SSE 연결 시작...');
        eventSourceRef.current = new EventSource(
            import.meta.env.VITE_API_BASE_URL + '/sse/connect'
        );

        eventSourceRef.current.onopen = () => {
            console.log('✅ SSE 연결 성공');
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current); // 재연결 타이머 초기화
                reconnectTimeoutRef.current = null;
            }
        };

        eventSourceRef.current.onmessage = (event) => {
            console.log('📩 SSE 메시지 수신:', event.data);
            setEvents((prev) => [...prev, event.data]);
        };
        eventSourceRef.current.addEventListener('connect', (event) => {
            console.log('📩 SSE Custom Event:', event.data);
            setEvents((prev) => [...prev, `Custom: ${event.data}`]);
        });
        eventSourceRef.current.onerror = (error) => {
            console.error('⚠️ SSE 오류 발생:', error);
            eventSourceRef.current.close();
            eventSourceRef.current = null;

            // 🔄 자동 재연결 시도 (5초 후)
            if (!reconnectTimeoutRef.current) {
                console.log(`🔄 ${5000 / 1000}초 후 SSE 재연결 시도...`);
                reconnectTimeoutRef.current = setTimeout(connectSSE, 5000);
            }
        };
    };

    useEffect(() => {
        connectSSE(); // 최초 연결

        return () => {
            console.log('🔌 SSE 연결 종료...');
            eventSourceRef.current?.close();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    return (
        <SSEContext.Provider
            value={{ events, eventSource: eventSourceRef.current }}
        >
            {children}
        </SSEContext.Provider>
    );
};

export const useSSE = () => {
    return useContext(SSEContext);
};
