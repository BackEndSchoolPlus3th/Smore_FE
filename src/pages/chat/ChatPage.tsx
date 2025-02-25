import React from 'react';
import Chat from '../../components/chat/Chat'; // 채팅 메시지 컴포넌트
import Sidebar from '../../components/chat/Sidebar'; // 왼쪽 사이드바
import Participants from '../../components/chat/Participants'; // 오른쪽 참여자 목록

const ChatPage: React.FC = () => {
    return (
        <div className="flex h-screen">
            {/* 왼쪽 사이드바 (스터디 목록) */}
            <Sidebar />

            {/* 중앙 채팅 영역 */}
            <div className="flex-1 flex flex-col bg-muted-purple">
                <h1 className="p-4 text-lg font-bold border-b">채팅방</h1>
                <Chat />
            </div>

            {/* 오른쪽 참여자 목록 */}
            <Participants />
        </div>
    );
};

export default ChatPage;
