import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { apiClient } from "../../shared";

type Message = {
  type: "message";
  sender: "me" | "other";
  text: string;
  time: string;
  date: string;
};

type Divider = {
  type: "divider";
  text: string;
};

type ChatMessage = Message | Divider;

interface ChatProps {
  roomId: string;
  chatType: "dm" | "group";
}

const Chat: React.FC<ChatProps> = ({ roomId, chatType }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useRef<Client | null>(null);

  // (1) 로컬 스토리지에서 JWT 토큰과 userId 가져오기
  const jwt = localStorage.getItem("jwt");
  const currentUserId = localStorage.getItem("userId") || "anonymous";

  // (2) 기존 채팅 히스토리 불러오기
  useEffect(() => {
    apiClient
      .get(`/api/v1/chatrooms/${chatType}/${roomId}/messages`)
      .then((response) => {
        // 서버에서 가져온 메시지를 클라이언트 구조로 변환
        const loadedMessages: ChatMessage[] = [];
        let lastDate: string | null = null;

        response.data.forEach((msg: any) => {
          const dateObj = msg.createdDate ? new Date(msg.createdDate) : new Date();
          const dateStr = dateObj.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          });
          const timeStr = dateObj.toLocaleTimeString("ko-KR", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          // 내 메시지인지 상대방 메시지인지 구분
          const senderType = msg.senderId === currentUserId ? "me" : "other";

          // 날짜가 바뀌면 divider 삽입
          if (!lastDate || lastDate !== dateStr) {
            loadedMessages.push({ type: "divider", text: dateStr });
            lastDate = dateStr;
          }

          loadedMessages.push({
            type: "message",
            sender: senderType,
            text: msg.message,
            time: timeStr,
            date: dateStr,
          });
        });

        setMessages(loadedMessages);
      })
      .catch((error) => {
        console.error("메시지 불러오기 실패:", error);
      });
  }, [roomId, chatType, jwt, currentUserId]);

  // (3) WebSocket 연결 & 메시지 수신
  useEffect(() => {
    if (!stompClient.current) {
      const socket = new SockJS("http://localhost:8090/ws",null, { xhrWithCredentials: true } as any );
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: { Authorization: `Bearer ${jwt}` },
        onConnect: () => {
          console.log("WebSocket 연결됨");
          // 채팅방 구독
          stompClient.current?.subscribe(`/topic/chatroom/${roomId}`, (msg) => {
            const data = JSON.parse(msg.body);

            // 내 메시지인지, 상대방 메시지인지 구분
            const senderType = data.senderId === currentUserId ? "me" : "other";

            const dateObj = data.timestamp ? new Date(data.timestamp) : new Date();
            const dateStr = dateObj.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            });
            const timeStr = dateObj.toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              let newMessages = [...prev];

              // 날짜가 바뀌면 divider 삽입
              if (!lastMessage || (lastMessage.type === "message" && lastMessage.date !== dateStr)) {
                newMessages.push({ type: "divider", text: dateStr });
              }

              newMessages.push({
                type: "message",
                sender: senderType,
                text: data.message,
                time: timeStr,
                date: dateStr,
              });

              return newMessages;
            });
          });
        },
        onDisconnect: () => console.log("WebSocket 연결 종료"),
      });
      stompClient.current.activate();
    }

    return () => {
      stompClient.current?.deactivate();
      stompClient.current = null;
    };
  }, [roomId, jwt, currentUserId]);

  // (4) 메시지가 추가될 때마다 스크롤 자동 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // (5) 메시지 전송 
  const sendMessage = () => {
    if (input.trim() === "") return;

    // 그냥 서버로만 전송하고, 표시(렌더링)는 서버가 브로드캐스트한 이벤트로 처리
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: "/app/chat/sendMessage",
        body: JSON.stringify({
          roomId,
          chatType,
          senderId: currentUserId,
          message: input,
          attachment: null,
        }),
      });
    }

    // 입력창 비우기
    setInput("");
  };

  // (6) Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
      setInput((prev) => prev + "\n");
    } else if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // 날짜 구분선 렌더링
  const renderDivider = (text: string, key: number) => (
    <div className="flex justify-center my-4" key={key}>
      <div className="bg-light-blue px-4 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-md flex items-center">
        📅 {text}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* 채팅창 */}
      <div className="flex flex-col flex-1 bg-purple-200 p-4">
        <div className="flex-1 overflow-y-auto p-4 min-h-[500px]">
          {messages.map((msg, index) =>
            msg.type === "divider" ? (
              renderDivider(msg.text, index)
            ) : (
              <div
                key={index}
                className={`flex my-2 ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[60%] p-3 rounded-lg shadow-md ${
                    msg.sender === "me"
                      ? "bg-light-blue text-gray-800"
                      : "bg-white text-gray-800"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {msg.time}
                  </div>
                </div>
              </div>
            )
          )}
          <div ref={chatEndRef} />
        </div>

        {/* 메시지 입력창 */}
        <div className="flex p-4 bg-white border-t border-gray-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요."
            className="flex-1 p-2 resize-none border-none outline-none text-sm h-10 rounded-md"
          />
          <button
            onClick={sendMessage}
            className="ml-3 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
