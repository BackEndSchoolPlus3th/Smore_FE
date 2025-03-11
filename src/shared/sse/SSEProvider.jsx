// import { createContext, useContext, useEffect, useRef, useState } from 'react';

// const SSEContext = createContext(null);

// export const SSEProvider = ({ children }) => {
//   const eventSourceRef = useRef(null);
//   const [events, setEvents] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken")==null?"":localStorage.getItem("accessToken").substring(7));

//   // 🔹 SSE 연결 함수
//   const connectSSE = () => {
//     if (!accessToken || eventSourceRef.current) return; // 이미 연결된 경우 방지

//     console.log("🔗 SSE 연결 시작...");
//     console.log(" sse에 연결할 accessToken",accessToken);
//     eventSourceRef.current = new EventSource(
//       `${import.meta.env.VITE_API_BASE_URL}/sse/connect?token=${accessToken}`
//     );

//     eventSourceRef.current.onopen = () => {
//       console.log("✅ SSE 연결 성공", accessToken);
//       setIsConnected(true);
//     };

//     eventSourceRef.current.onmessage = (event) => {
//       console.log("📩 SSE 메시지 수신:", event.data);
//       setEvents((prev) => [...prev, event.data]);
//     };

//     eventSourceRef.current.onerror = (error) => {
//       console.error("⚠️ SSE 오류 발생:", error);
//       disconnectSSE();

//       // 5초 후 재연결 시도
//       setTimeout(connectSSE, 5000);
//     };
//   };

//   // 🔹 SSE 연결 종료 함수
//   const disconnectSSE = () => {
//     if (eventSourceRef.current) {
//       console.log("🔌 SSE 연결 종료...");
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//       setIsConnected(false);
//     }
//   };

//   // 🔹 로그인 성공 시 SSE 연결
//   useEffect(() => {
//     if (accessToken) {
//       connectSSE();
//     } else {
//       disconnectSSE();
//     }

//     return () => disconnectSSE(); // 컴포넌트 언마운트 시 해제
//   }, [accessToken]);

//   return (
//     <SSEContext.Provider value={{ events, isConnected, eventSource: eventSourceRef.current, setAccessToken }}>
//       {children}
//     </SSEContext.Provider>
//   );
// };

// // SSE를 사용하는 커스텀 훅
// export const useSSE = () => {
//   return useContext(SSEContext);
//   //return eventSourceRef.current;
// };
