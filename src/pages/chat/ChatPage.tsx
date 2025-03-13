import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    Sidebar,
    InitialChatBoard,
    ChatBoard,
    VideoChatBoard,
} from '../../components';
import Participants from '../../components/chat/Participants';
import { AlignJustify } from 'lucide-react';

type ChatRoom = {
    roomId: string;
    roomName: string;
    studyId?: number;
};

const ChatPage: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [selectedChatType, setSelectedChatType] = useState<
        'dm' | 'group' | null
    >(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex h-screen">
            {/* 왼쪽 사이드바 */}
            <div className="w-1/4 min-w-[250px] max-w-[300px] h-full border-r border-gray-200 overflow-y-auto">
                <Sidebar
                    selectedRoom={selectedRoom}
                    selectedChatType={selectedChatType}
                    onRoomSelect={setSelectedRoom}
                    onChatTypeSelect={setSelectedChatType}
                />
            </div>

            {/* 중앙 채팅 화면 */}
            {/* <div className="flex-1 min-w-0 h-full border-r border-gray-200 overflow-y-auto"> */}
            {/* ChatBoard 내에서 Route를 구성하는 구조 */}
            {/* <ChatBoard selectedRoom={selectedRoom} selectedChatType={selectedChatType}>
          <Routes>
            <Route path="/" element={<InitialChatBoard />} />
            <Route path="/:study_id" element={<ChatBoard selectedRoom={selectedRoom} selectedChatType={selectedChatType} />} />
            <Route path="/:study_id/video" element={<VideoChatBoard />} />
          </Routes>
        </ChatBoard>
      </div>
    </div> */}

            {/* 중앙 채팅 화면 */}
            <div className="flex-1 min-w-0 h-full border-r border-gray-200 overflow-y-auto">
                {/* ChatBoard 내에서 Route를 구성하는 구조 */}
                {/* <ChatBoard
                    selectedRoom={selectedRoom}
                    selectedChatType={selectedChatType}
                > */}
                    <Routes>
                        <Route path="/" element={<InitialChatBoard />} />
                        <Route
                            path="/:study_id"
                            element={
                                <ChatBoard
                                    selectedRoom={selectedRoom}
                                    selectedChatType={selectedChatType}
                                />
                            }
                        />
                        <Route
                            path="/:study_id/video"
                            element={<VideoChatBoard />}
                        />
                    </Routes>
                {/* </ChatBoard> */}
            </div>

            {/* 오른쪽 참여자 목록 */}
            <div className="w-1/4 min-w-[250px] max-w-[300px] h-full border-r border-gray-200 overflow-y-auto bg-light-lavender p-4">
                <Participants
                    chatType={selectedChatType}
                    studyId={selectedRoom?.studyId}
                />
            </div>
        </div>
    );
};

export default ChatPage;
