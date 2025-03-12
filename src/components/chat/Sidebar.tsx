import React, { useState } from "react";

const Sidebar: React.FC = () => {
    type ChatRoom = {
        roomId: string;
        roomName: string;
      };     
      
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

    

    return (
        <div className="h-full flex flex-col min-h-0 overflow-y-auto p-4 bg-light-lavender">
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
                      selectedRoomId === room.roomId && selectedChatType === "dm"
                        ? "bg-yellow-300"
                        : ""
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
                      selectedRoomId === room.roomId && selectedChatType === "group"
                        ? "bg-yellow-300"
                        : ""
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
      );
    };

export default Sidebar;
