import React, { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { 
  Sidebar,
  InitialChatBoard,
  ChatBoard,  
  VideoChatBoard
} from "../../components";

type ChatRoom = {
  roomId: string;
  roomName: string;
  studyId?: number;
};


const ChatPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedChatType, setSelectedChatType] = useState<"dm" | "group" | null>(null);

  return (  
    <div className="flex">
      <div className="w-1/4 min-w-[250px] max-w-[300px] border-r border-gray-200">
        <Sidebar 
          selectedRoom={selectedRoom}
          selectedChatType={selectedChatType}
          onRoomSelect={setSelectedRoom}
          onChatTypeSelect={setSelectedChatType}
        />
      </div>
      <ChatBoard 
        selectedRoom={selectedRoom}
        selectedChatType={selectedChatType}
      />
    
    <div className="flex-1 min-w-0">
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
          <Route path="/:study_id/video" element={<VideoChatBoard />} />
        </Routes>
      </div>
    </div>
  )

}
export default ChatPage;