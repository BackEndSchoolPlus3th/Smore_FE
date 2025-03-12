import React, { createContext, useContext, useEffect, useState, useRef } from "react";
interface EventContextType {
  events: string[];
}
const EventContext = createContext<EventContextType>({ events: [] });

import { ReactNode } from "react";

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider = ({ children }: EventProviderProps) => {
  const [events, setEvents] = useState<string[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") == null 
    ? "" 
    : localStorage.getItem("accessToken")?.substring(7) || ""
  );

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      console.log("📩 새로운 이벤트:", event.data);
      setEvents((prev) => [...prev, event.data]); // 전역 상태 업데이트
    };

    // 📌 EventSource 연결 함수
    const connectToEventSource = () => {
      const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/sse/connect?token=${accessToken}`);
      eventSourceRef.current = eventSource;

      // 연결 성공 시
      eventSource.onopen = () => {
        console.log("✅ SSE 연결 성공");
        setIsConnected(true);
      };
      // 메시지 수신
      eventSource.addEventListener("application__reached", handleEvent);
      eventSource.addEventListener("application__permitted", handleEvent);
      eventSource.addEventListener("application__rejected", handleEvent);
      eventSource.addEventListener("dm__created", handleEvent);


      // 오류 발생 시
      eventSource.onerror = (error) => {
        console.error("❌ SSE 연결 오류:", error);
        setIsConnected(false);
        eventSource.close();
      };

      return eventSource;
    };

    // 처음 연결
    let eventSource = connectToEventSource();

    // 30초마다 재연결 시도
    const reconnectInterval = setInterval(() => {
      console.log("⏳ 30초마다 재연결 시도");
      if (eventSource) {
        eventSource.close(); // 이전 연결 닫기
      }
      eventSource = connectToEventSource(); // 새로운 EventSource 연결
    }, 30000); // 30초마다 재연결

    // cleanup: 컴포넌트 언마운트 시
    return () => {
      clearInterval(reconnectInterval); // 타이머 해제
      if (eventSource) {
        eventSource.removeEventListener("application__reached", handleEvent);
        eventSource.close();
      }
    };
  }, [accessToken]); // accessToken 변경 시 다시 실행

  return (
    <EventContext.Provider value={{ events }}>
      {children}
    </EventContext.Provider>
  );
};

// 어디서든 이벤트 접근 가능하도록 커스텀 훅 제공
export const useGlobalEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useGlobalEvents must be used within an EventProvider");
  }
  return context;
};
