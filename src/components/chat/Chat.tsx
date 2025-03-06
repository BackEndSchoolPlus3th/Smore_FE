import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatInput from "./ChatInput";

const token = localStorage.getItem("token"); // 로컬 스토리지에서 JWT 가져오기

const Chat: React.FC<{ roomId: string; chatType: "dm" | "group" }> = ({ roomId, chatType }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useRef<Client | null>(null);

  /** HTTP API로 기존 채팅 히스토리 불러오기 */
  useEffect(() => {
    axios
      .get(`http://localhost:8090/api/chatrooms/${chatType}/${roomId}/messages`, { withCredentials: true })
      .then((response) => {
        setMessages(response.data); // 기존 메시지 불러오기
      })
      .catch((error) => {
        console.error("메시지 불러오기 실패:", error);
      });
  }, [roomId, chatType]);

  /**  WebSocket 연결 */
  useEffect(() => {
    if (!stompClient.current) {
      const socket = new SockJS("http://localhost:8090/ws");
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            Authorization: `Bearer ${token}`, // JWT 포함
        },
        onConnect: () => {
          console.log("WebSocket 연결됨");

          // 실시간 메시지 수신
          stompClient.current?.subscribe(`/topic/chatroom/${roomId}`, (message) => {
            setMessages((prev) => [...prev, JSON.parse(message.body)]);
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
  }, [roomId]);

  /** 메시지 전송 (WebSocket 사용) */
  const sendMessage = () => {
    if (input.trim() !== "" && stompClient.current?.connected) {
      const messageObj = {
        roomId,
        senderId: "me",
        message: input,
        attachment: null,
      };

      stompClient.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messageObj),
      });

      setInput("");
    }
  };

  /** 새로운 메시지가 추가될 때 자동 스크롤 */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {/* 메시지 리스트 */}
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.senderId === "me" ? "my-message" : "other-message"}>
            {msg.message}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 메시지 입력창 */}
      <ChatInput input={input} onChange={setInput} onSend={sendMessage} onKeyDown={() => {}} />
    </div>
  );
};

export default Chat;
