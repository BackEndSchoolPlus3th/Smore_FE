import React, { useState } from 'react';
import { Video } from 'lucide-react';
import Chat from '../../components/chat/Chat'; // 채팅 메시지 컴포넌트
import Sidebar from '../../components/chat/Sidebar'; // 왼쪽 사이드바
import Participants from '../../components/chat/Participants'; // 오른쪽 참여자 목록
import VideoChatPage from '../../pages/videoChat/VideoChatPage'; // 비디오 채팅 기능

const ChatPage: React.FC = () => {
    const [isVideoChatActive, setIsVideoChatActive] = useState(false); // 비디오 채팅 활성화 상태

    // 버튼 클릭 시 비디오 채팅 시작
    const handleVideoChat = () => {
        setIsVideoChatActive(true); // 비디오 채팅을 활성화
    };

    return (
        <div className="flex h-screen">
            {/* 왼쪽 사이드바 (스터디 목록) */}
            <Sidebar />

            {/* 중앙 채팅 영역 */}
            <div className="flex-1 flex flex-col bg-muted-purple">
                <h1 className="p-4 text-lg font-bold">채팅방</h1>
                <button
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    onClick={handleVideoChat} // 버튼 클릭 시 비디오 채팅 활성화
                >
                    <Video className="w-6 h-6 text-gray-700" />
                </button>

                {/* 비디오 채팅 활성화 시 VideoChatPage 렌더링 */}
                {isVideoChatActive ? <VideoChatPage /> : <Chat />}
            </div>

            {/* 오른쪽 참여자 목록 */}
            <Participants />
        </div>
    );
};

export default ChatPage;
