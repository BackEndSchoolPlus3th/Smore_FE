import React, { useEffect, useState } from "react";
import { apiClient } from "../../shared";

type ChatRoom = {
  roomId: string;      // 백엔드에서 roomId(Long)을 받아오면 문자열로 변환
  roomName: string;    // studyName (스터디명)
  studyId?: number;    // 그룹 채팅방이라면 studyId를 담아둠 (DM에는 필요없을 수도 있음)
};

const Sidebar: React.FC = () => {
  // 비디오 채팅 활성화 여부
  const [isVideoChatActive, setIsVideoChatActive] = useState(false);

  // 현재 선택된 채팅방 정보(전체 객체)와 채팅 타입
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [selectedChatType, setSelectedChatType] = useState<"dm" | "group" | null>(null);

  // 사이드바에서 펼쳐진 카테고리 (기본 "dm")
  const [expandedCategory, setExpandedCategory] = useState<"dm" | "group">("dm");

  // 임시 DM 채팅방 목록 (하드코딩)
  const dmRooms: ChatRoom[] = [
    { roomId: "dm-1", roomName: "DM 채팅방 1" },
    { roomId: "dm-2", roomName: "DM 채팅방 2" },
  ];

  // 그룹 채팅방 목록 (API로 받아옴)
  const [groupRooms, setGroupRooms] = useState<ChatRoom[]>([]);

  // "그룹" 카테고리를 펼쳤을 때만 서버로부터 그룹 채팅방 목록을 로드
  useEffect(() => {
    if (expandedCategory === "group") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // 모든 요청에 JWT를 실어 보낼 수 있도록 설정
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      apiClient
        .get("/api/v1/chatrooms/group")
        .then((res) => {
          // 백엔드 응답 예시: [{ roomId, studyId, studyName, createdDate }, ...]
          const rooms: ChatRoom[] = res.data.map((dto: any) => ({
            roomId: String(dto.roomId),    // 숫자 -> 문자열 변환
            roomName: dto.studyName,       // 스터디명
            studyId: dto.studyId,          // 스터디 ID
          }));
          setGroupRooms(rooms);
        })
        .catch((error) => {
          console.error("그룹 채팅방 목록 가져오기 실패:", error);
        });
    }
  }, [expandedCategory]);

  /**
   * 채팅방 선택 시: 
   * - 선택된 방 정보(객체)를 state에 저장
   * - DM인지 group인지 타입도 별도로 저장
   * - 채팅방 엔드포인트로 이동
   */
  const handleChatRoomSelect = (room: ChatRoom, chatType: "dm" | "group") => {
    setSelectedRoom(room);
    setSelectedChatType(chatType);
    enterChatRoom();

  };

  /**
   * DM/그룹 카테고리 토글 시:
   * - 해당 카테고리로 expandedCategory 갱신
   * - 이전에 선택했던 채팅방 정보 초기화
   */
  const toggleCategory = (category: "dm" | "group") => {
    setExpandedCategory(category);
    setSelectedRoom(null);
    setSelectedChatType(null);
  };

  // 비디오 채팅 버튼 클릭 시
  const handleVideoChat = () => {
    setIsVideoChatActive(true);
  };

  // 스터디 채팅방으로 이동
  const enterChatRoom = async () => {
    if (selectedChatType === "group" && selectedRoom) {
      try {
        const response = await apiClient.post(`/api/v1/chatrooms/group/${selectedRoom.roomId}`);
        if (response.status === 200) {
          window.location.href = `/chat/${selectedRoom.studyId}`;
        } else {
          console.error("채팅방 입장 실패:", response);
        }
      } catch (error) {
        console.error("채팅방 입장 중 오류 발생:", error);
      }
    }
  };

    return (
      <div className="flex h-screen">
      {/* 왼쪽 사이드바: DM / 그룹 채팅방 목록 */}
      <div className="p-4 h-full">
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
                    selectedRoom?.roomId === room.roomId && selectedChatType === "dm"
                      ? "bg-yellow-300"
                      : ""
                  }`}
                  onClick={() => handleChatRoomSelect(room, "dm")}
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
                    selectedRoom?.roomId === room.roomId && selectedChatType === "group"
                      ? "bg-yellow-300"
                      : ""
                  }`}
                  onClick={() => handleChatRoomSelect(room, "group")}
                >
                  {room.roomName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
);};

export default Sidebar;
