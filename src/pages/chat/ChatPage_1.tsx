import React, { useState } from "react";
import { Video } from "lucide-react";
import Chat from "../../components/chat/Chat";
import Participants from "../../components/chat/Participants";
import VideoChatPage from "../../pages/videoChat/VideoChatPage";

type ChatRoom = {
  roomId: string;
  roomName: string;
};

const ChatPage: React.FC = () => {
  const [isVideoChatActive, setIsVideoChatActive] = useState(false);
  // 선택된 채팅방 정보
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedChatType, setSelectedChatType] = useState<"dm" | "group" | null>(null);
  // 현재 사이드바에서 펼쳐진 카테고리 
  const [expandedCategory, setExpandedCategory] = useState<"dm" | "group">("dm");

  // DM 채팅방 목록
  const dmRooms: ChatRoom[] = [
    { roomId: "dm-1", roomName: "DM 채팅방 1" },
    { roomId: "dm-2", roomName: "DM 채팅방 2" },
  ];

  // 그룹 채팅방 목록
  const groupRooms: ChatRoom[] = [
    { roomId: "group-1", roomName: "Python 스터디" },
    { roomId: "group-2", roomName: "Java를 배워봅시다" },
  ];

  // 채팅방 선택 시 해당 방의 roomId와 chatType 저장
  const handleChatRoomSelect = (roomId: string, chatType: "dm" | "group") => {
    setSelectedRoomId(roomId);
    setSelectedChatType(chatType);
  };

  // 카테고리 헤더 클릭 시 해당 카테고리를 펼치고 다른 카테고리는 자동으로 밀림
  const toggleCategory = (category: "dm" | "group") => {
    setExpandedCategory((prev) => (prev === category ? category : category));
    // 선택한 카테고리 변경 시 선택된 채팅방 초기화
    setSelectedRoomId(null);
    setSelectedChatType(null);
  };

  const handleVideoChat = () => {
    setIsVideoChatActive(true);
  };

  return (
    <div className="flex h-screen">
      {/* 왼쪽 사이드바: 카테고리별 채팅방 목록 */}
      <div className="w-1/5 bg-light-lavender p-4">
        <h2 className="text-xl font-bold mb-4">채팅방 목록</h2>
        {/* DM 카테고리 */}
        <div>
          <div
            className="cursor-pointer font-bold flex items-center"
            onClick={() => toggleCategory("dm")}
          >
            DM {expandedCategory === "dm" ? "🔽" : "▶️"}
          </div>
          {expandedCategory === "dm" && (
            <ul className="mt-2 ml-4">
              {dmRooms.map((room) => (
                <li
                  key={room.roomId}
                  className={`p-2 cursor-pointer hover:bg-yellow-300 rounded mb-2 ${
                    selectedRoomId === room.roomId ? "bg-yellow-300" : ""
                  }`}
                  onClick={() => handleChatRoomSelect(room.roomId, "dm")}
                >
                  {room.roomName}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* 그룹 카테고리 */}
        <div className="mt-4">
          <div
            className="cursor-pointer font-bold flex items-center"
            onClick={() => toggleCategory("group")}
          >
            그룹 {expandedCategory === "group" ? "🔽" : "▶️"}
          </div>
          {expandedCategory === "group" && (
            <ul className="mt-2 ml-4">
              {groupRooms.map((room) => (
                <li
                  key={room.roomId}
                  className={`p-2 cursor-pointer hover:bg-yellow-300 rounded mb-2 ${
                    selectedRoomId === room.roomId ? "bg-yellow-300" : ""
                  }`}
                  onClick={() => handleChatRoomSelect(room.roomId, "group")}
                >
                  {room.roomName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 중앙 영역: 채팅창 및 비디오 채팅 */}
      <div className="flex-1 flex flex-col bg-muted-purple">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">채팅방</h1>
          <button
            className="p-2 rounded-full hover:bg-gray-200 transition"
            onClick={handleVideoChat}
          >
            <Video className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        {selectedRoomId ? (
          isVideoChatActive ? (
            <VideoChatPage />
          ) : selectedChatType ? (
            <Chat roomId={selectedRoomId} chatType={selectedChatType} />
          ) : (
            <div className="p-4">채팅할 방을 선택해주세요.</div>
          )
        ) : (
          <div className="p-4">채팅할 방을 선택해주세요.</div>
        )}
      </div>

      {/* 오른쪽 참여자 목록 */}
      <Participants />
    </div>
  );
};

export default ChatPage;





// import React, { useState } from 'react';
// import { Video } from 'lucide-react';
// import Chat from '../../components/chat/Chat'; // 채팅 메시지 컴포넌트
// import Sidebar from '../../components/chat/Sidebar'; // 왼쪽 사이드바
// import Participants from '../../components/chat/Participants'; // 오른쪽 참여자 목록
// import VideoChatPage from '../../pages/videoChat/VideoChatPage'; // 비디오 채팅 기능

// const ChatPage: React.FC = () => {
//     const [isVideoChatActive, setIsVideoChatActive] = useState(false); // 비디오 채팅 활성화 상태

//     // 버튼 클릭 시 비디오 채팅 시작
//     const handleVideoChat = () => {
//         setIsVideoChatActive(true); // 비디오 채팅을 활성화
//     };

//     return (
//         <div className="flex h-screen">
//             {/* 왼쪽 사이드바 (스터디 목록) */}
//             <Sidebar />

//             {/* 중앙 채팅 영역 */}
//             <div className="flex-1 flex flex-col bg-muted-purple">
//                 <h1 className="p-4 text-lg font-bold">채팅방</h1>
//                 <button
//                     className="p-2 rounded-full hover:bg-gray-200 transition"
//                     onClick={handleVideoChat} // 버튼 클릭 시 비디오 채팅 활성화
//                 >
//                     <Video className="w-6 h-6 text-gray-700" />
//                 </button>

//                 {/* 비디오 채팅 활성화 시 VideoChatPage 렌더링 */}
//                 {isVideoChatActive ? <VideoChatPage /> : <Chat />}
//             </div>

//             {/* 오른쪽 참여자 목록 */}
//             <Participants />
//         </div>
//     );
// };

// export default ChatPage;
