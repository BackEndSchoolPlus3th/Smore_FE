import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Video } from "lucide-react";
import Chat from "../Chat";
import Participants from "../Participants";
import { VideoChatPage } from "../../../pages";
import  Sidebar  from "../Sidebar";
  
// chatboard 들어오면 백에 요청보내서 채팅방 목록 가져오기
  const ChatBoard: React.FC = () => {
    // 선택된 채팅방 정보
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    // 현재 사이드바에서 펼쳐진 카테고리 
    const [expandedCategory, setExpandedCategory] = useState<"dm" | "group">("dm");
  
    const navigate = useNavigate();
  
    const handleVideoChat = () => {
      navigate("/videochat");
    };
  
    return (
      <div className="flex h-screen">
  
        {/* 중앙 영역: 채팅창 및 비디오 채팅 */}
        <div className="flex-1 flex flex-col bg-[#FAFBFF]">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-bold">채팅방</h1>
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition"
              onClick={handleVideoChat}
            >
              <Video className="w-6 h-6 text-gray-700" />
            </button>
          </div>
          {selectedRoomId ? 
             ( <Chat roomId={selectedRoomId}  />
             ) : (
            <div className="p-4">채팅할 방을 선택해주세요.</div>
          )}
        </div>
  
        {/* 오른쪽 참여자 목록 */}
        <Participants />
      </div>
    );
  };

export default ChatBoard;