import React, { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { 
  Sidebar,
  InitialChatBoard,
  ChatBoard,  
  VideoChatBoard
} from "../../components";
import { AlignJustify } from 'lucide-react';

type ChatRoom = {
  roomId: string;
  roomName: string;
  studyId?: number;
};


const ChatPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedChatType, setSelectedChatType] = useState<"dm" | "group" | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
};

  return (
    <div className="flex h-screen">
      {/* 사이드바 컨테이너 */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          border-r border-gray-200 
          ${isSidebarOpen ? 'w-[300px]' : 'w-[50px]'}
        `}
      >
        {/* 사이드바 내용 */}
        <div className="h-full flex flex-col">
          {/* 토글 버튼 */}
          <button
            className="p-2 hover:bg-gray-200 transition"
            onClick={handleToggleSidebar}
          >
            <AlignJustify className="w-6 h-6 text-gray-700" />
          </button>

          {/* 사이드바 컨텐츠 */}
          <div className={`
            flex-1 overflow-y-auto
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300
          `}>
            <Sidebar
              selectedRoom={selectedRoom}
              selectedChatType={selectedChatType}
              onRoomSelect={setSelectedRoom}
              onChatTypeSelect={setSelectedChatType}
            />
          </div>
        </div>
      </div>

      {/* 채팅 화면 */}
      <div className="flex-1 h-full">
        <div className="w-full h-full border-r border-gray-200 overflow-y-auto">        
          <Routes>
            <Route path="/" element={<InitialChatBoard />} />
            <Route path="/:study_id" element={<ChatBoard selectedRoom={selectedRoom} selectedChatType={selectedChatType} />} />
            <Route path="/:study_id/video" element={<VideoChatBoard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;