import React, { useState } from 'react';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState([
        { sender: "김철수", text: "이번 주에 진행할 진도는 ch7입니다.", time: "2025-02-18 오전 9:55" },
        { sender: "홍길동", text: "발표자분들은 미리 준비해와주세요!", time: "2025-02-18 오전 9:55" }
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (input.trim() !== "") {
            setMessages([...messages, { sender: "", text: input, time: new Date().toLocaleString() }]);
            setInput("");
        }
    };

    return (
        <div className="flex flex-col flex-1 p-4">
            {/* 채팅 메시지 출력 */}
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === "" ? "justify-end" : "justify-start"}`}>
                        <div 
                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md 
                                ${msg.sender === "" ? "bg-white-500 text-black self-end" : "bg-white text-black self-start"}`
                            }
                        >
                            <strong className="block text-sm">{msg.sender}</strong>
                            <p className="break-words">{msg.text}</p>
                            <span className="block text-xs text-gray-500 mt-1">{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 메시지 입력창 */}
            <div className="flex p-2 border-t bg-white">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={sendMessage}>
                    전송
                </button>
            </div>
        </div>
    );
};

export default Chat;
