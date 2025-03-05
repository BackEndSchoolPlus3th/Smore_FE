import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chat from '../../components/chat/Chat';
import Sidebar from '../../components/chat/Sidebar';
import Participants from '../../components/chat/Participants';

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/chat/messages', { withCredentials: true })
            .then(response => setMessages(response.data))
            .catch(error => console.error('채팅 메시지를 불러오는 중 오류 발생:', error));

        const socket = new WebSocket('ws://localhost:8080/ws/chat');
        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };

        return () => socket.close();
    }, []);

    const sendMessage = async (message: string) => {
        try {
            const response = await axios.post('http://localhost:8080/api/chat/send',
                { content: message }, { withCredentials: true }
            );
            setMessages(prevMessages => [...prevMessages, response.data]);
        } catch (error) {
            console.error('메시지 전송 중 오류 발생:', error);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-muted-purple">
                <h1 className="p-4 text-lg font-bold">채팅방</h1>
                <Chat messages={messages} sendMessage={sendMessage} />
            </div>
            <Participants />
        </div>
    );
};

export default ChatPage;
