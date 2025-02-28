// import React, { useState } from 'react';

// const Chat: React.FC = () => {
//     const [messages, setMessages] = useState([
//         { sender: "김철수", text: "이번 주에 진행할 진도는 ch7입니다.", time: "2025-02-18 오전 9:55" },
//         { sender: "홍길동", text: "발표자분들은 미리 준비해와주세요!", time: "2025-02-18 오전 9:56" }
//     ]);
//     const [input, setInput] = useState("");

//     const sendMessage = () => {
//         if (input.trim() !== "") {
//             setMessages([...messages, { 
//                 sender: "", 
//                 text: input, 
//                 time: new Date().toLocaleTimeString('ko-KR', {
//                     year: 'numeric',
//                     month: 'numeric',
//                     day: 'numeric',
//                     hour: 'numeric',
//                     minute: 'numeric',
//                     hour12: true 
//                 }) 
//             }]);
//             setInput("");
//         } 
//     };

//     return (
//         <div className="flex flex-col flex-1 p-4">
//             {/* 채팅 메시지 출력 */}
//             <div className="flex-1 overflow-y-auto bg-muted-purple p-4 space-y-2">
//                 {messages.map((msg, index) => (

//                     <div key={index} className={`flex ${msg.sender === "" ? "justify-end" : "justify-start"}`}>
//                         <div 
//                             className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md 
//                                 ${msg.sender === "" ? "bg-white-500 text-black self-end" : "bg-white text-black self-start"}`
//                             }
//                         >
//                             <strong className="block text-sm">{msg.sender}</strong>
//                             <p className="break-words">{msg.text}</p>
//                             <span className="block text-xs text-gray-500 mt-1">{msg.time}</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* 메시지 입력창 */}
//             <div className="flex p-2 border-t bg-muted-purple">
//                 <input
//                     type="text"
//                     className="flex-1 p-2 rounded-lg bg-light-lavender"
//                     // style={{backgroundColor: ""}}
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                 />
//                 <button className="ml-2 px-4 py-2 bg-light-lavender text-black rounded-lg" onClick={sendMessage}>
//                     전송
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Chat;

import React, { useState, useRef, useEffect } from "react";

// 메시지 타입 정의
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

// Message 배열 타입
type ChatMessage = Message | Divider;

const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        if (input.trim() !== "") {
            const now = new Date();
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

            const currentDate = now.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
            const currentTime = now.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric", hour12: true });

            let newMessages = [...messages];

            if (!lastMessage || (lastMessage.type === "message" && lastMessage.date !== currentDate)) {
                newMessages.push({ type: "divider", text: currentDate });
            }

            newMessages.push({
                type: "message",
                sender: "me",
                text: input,
                time: currentTime,
                date: currentDate,
            });

            setMessages(newMessages);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.key === "Enter" && (e.shiftKey || e.ctrlKey))) {
            e.preventDefault();
            setInput((prev) => prev + "\n"); // Shift+Enter 또는 Ctrl+Enter → 줄바꿈 추가
        } else if (e.key === "Enter") {
            e.preventDefault();
            sendMessage(); // Enter → 메시지 전송
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 날짜 구분선 Tailwind 적용
    const renderDivider = (text: string) => (
        <div className="flex justify-center my-4">
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
                    {messages.map((msg, index) => (
                        msg.type === "divider" ? renderDivider(msg.text) : (
                            <div 
                                key={index} 
                                className={`flex my-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[60%] p-3 rounded-lg shadow-md ${
                                    msg.sender === "me" 
                                        ? "bg-light-blue text-gray-800" 
                                        : "bg-white text-gray-800"
                                }`}
                                style={{ whiteSpace: "pre-wrap"}}
                                >
                                    {msg.text}
                                    <div className="text-xs text-gray-500 mt-1 text-right">{msg.time}</div>
                                </div>
                            </div>
                        )
                    ))}
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
