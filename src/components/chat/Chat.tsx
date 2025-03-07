import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

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

  // 로컬 스토리지에서 JWT 토큰 가져오기
  const token = localStorage.getItem("token");

  /** HTTP API로 기존 채팅 히스토리 불러오기 */
  useEffect(() => {
    axios
      .get(`http://localhost:8090/api/chatrooms/${chatType}/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("메시지 불러오기 실패:", error);
      });
  }, [roomId, chatType, token]);

  /** WebSocket 연결 및 실시간 메시지 수신 */
  useEffect(() => {
    if (!stompClient.current) {
      const socket = new SockJS("http://localhost:8090/ws");
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => {
          console.log("WebSocket 연결됨");
          // 채팅방 구독
          stompClient.current?.subscribe(`/topic/chatroom/${roomId}`, (message) => {
            const received: ChatMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, received]);
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
  }, [roomId, token]);

  /** 메시지가 추가될 때마다 스크롤 자동 이동 */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** 메시지 전송 */
  const sendMessage = () => {
    if (input.trim() === "") return;

    const now = new Date();
    const currentDate = now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    const currentTime = now.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    let newMessages = [...messages];
    const lastMessage = messages[messages.length - 1];

    // 날짜가 바뀌었거나 첫 메시지인 경우 날짜 구분선 추가
    if (!lastMessage || (lastMessage.type === "message" && lastMessage.date !== currentDate)) {
      newMessages.push({ type: "divider", text: currentDate });
    }

    const myMessage: Message = {
      type: "message",
      sender: "me",
      text: input,
      time: currentTime,
      date: currentDate,
    };

    newMessages.push(myMessage);
    setMessages(newMessages);

    // 웹소켓을 통한 메시지 전송
    if (stompClient.current?.connected) {
      const payload = {
        roomId,
        chatType,
        senderId: "me", // 실제 사용자 식별자로 대체 가능
        message: input,
        attachment: null,
      };
      stompClient.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
      });
    }
    setInput("");
  };

  /** 텍스트 영역에서 Enter, Shift+Enter 구분 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.shiftKey || e.ctrlKey)) {
      e.preventDefault();
      setInput((prev) => prev + "\n");
    } else if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  /** 날짜 구분선 렌더링 */
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
                className={`flex my-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[60%] p-3 rounded-lg shadow-md ${
                    msg.sender === "me" ? "bg-light-blue text-gray-800" : "bg-white text-gray-800"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                  <div className="text-xs text-gray-500 mt-1 text-right">{msg.time}</div>
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
          <button onClick={sendMessage} className="ml-3 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
