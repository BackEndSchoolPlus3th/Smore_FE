import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../shared';

import { useStore } from '../../features/videoChat/stores/StoreContext';

type ChatRoom = {
    roomId: string; // 백엔드에서 roomId(Long)을 받아오면 문자열로 변환
    roomName: string; // studyName (스터디명)
    studyId?: number; // 그룹 채팅방이라면 studyId를 담아둠 (DM에는 필요없을 수도 있음)
};

interface SidebarProps {
    selectedRoom: ChatRoom | null;
    onRoomSelect: (room: ChatRoom) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedRoom, onRoomSelect }) => {
    const { roomStore } = useStore();

    // URL 파라미터에서 study_id와 chat_type을 모두 추출 (chat_type을 chatType으로 alias)
    const { chat_type: chatType } = useParams<{ chat_type?: string }>();
    const navigate = useNavigate();

    // 사이드바에서 펼쳐진 카테고리 (기본 "dm")
    const [expandedCategory, setExpandedCategory] = useState<'dm' | 'group'>(
        'dm'
    );

    // 임시 DM 채팅방 목록 (하드코딩)
    const dmRooms: ChatRoom[] = [
        { roomId: 'dm-1', roomName: 'DM 채팅방 1' },
        { roomId: 'dm-2', roomName: 'DM 채팅방 2' },
    ];

    // 그룹 채팅방 목록 (API로 받아옴)
    const [groupRooms, setGroupRooms] = useState<ChatRoom[]>([]);

    // "그룹" 카테고리를 펼쳤을 때만 서버로부터 그룹 채팅방 목록을 로드
    useEffect(() => {
        if (expandedCategory === 'group') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                apiClient.defaults.headers.common['Authorization'] =
                    `Bearer ${token}`;
            }

            apiClient
                .get('/api/v1/chatrooms/group')
                .then((res) => {
                    // 백엔드 응답 예시: [{ roomId, studyId, studyName, createdDate }, ...]
                    const rooms: ChatRoom[] = res.data.map((dto: any) => ({
                        roomId: String(dto.roomId),
                        roomName: dto.studyName,
                        studyId: dto.studyId,
                    }));
                    setGroupRooms(rooms);
                })
                .catch((error) => {
                    console.error('그룹 채팅방 목록 가져오기 실패:', error);
                });
        }
    }, [expandedCategory, selectedRoom]);

    /** DM/그룹 카테고리 토글 */
    const toggleCategory = (category: 'dm' | 'group') => {
        setExpandedCategory(category);
    };

    // 채팅방 클릭 시 선택 상태 업데이트 후 페이지 이동
    const handleChatRoomClick = async (
        room: ChatRoom,
        type: 'dm' | 'group'
    ) => {
        if (type === 'group') {
            try {
                const response = await apiClient.post(
                    `/api/v1/chatrooms/group/${room.studyId}`,
                    {
                        roomId: room.roomId,
                    },                    
                );  
                roomStore.setRoomId(String(room.studyId))
                roomStore.setRoomName(room.roomName)
                // console.log('사이드 바 설정 roomId, roomName:', roomStore.roomId, roomStore.roomName);

                if (response.status === 200) {
                    onRoomSelect(room);
                    navigate(`/chat/${type}/${room.studyId}`);
                } else {
                    console.error('채팅방 입장 실패:', response);
                }
            } catch (error) {
                console.error('채팅방 입장 중 오류 발생:', error);
            }
        } else {
            onRoomSelect(room);
            navigate(`/chat/${type}`);
        }
    };

    const arrowRight = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
        </svg>
    );

    return (
        <div className="col-span-3 h-235 border border-gray-200 shadow-md rounded-xl bg-[#fafbff]">
            <div className="p-4 h-full max-h-full">
                <h2 className="text-xl font-bold mb-4">채팅방 목록</h2>

                {/* DM 카테고리 */}
                <div className="mt-4 max-h-170 overflow-y-auto">
                    <div
                        className="cursor-pointer font-bold flex items-center gap-2"
                        onClick={() => toggleCategory('dm')}
                    >
                        <div>DM</div>
                        <div
                            className={
                                expandedCategory === 'dm'
                                    ? 'transition transform-[rotate(90deg)]'
                                    : 'transition'
                            }
                        >
                            {arrowRight}
                        </div>
                    </div>
                    {expandedCategory === 'dm' && (
                        <ul className="mt-2 ml-4">
                            {dmRooms.map((room) => {
                                const isSelected =
                                    selectedRoom?.roomId === room.roomId &&
                                    chatType === 'dm';
                                return (
                                    <li
                                        key={room.roomId}
                                        className={`
                      p-2 cursor-pointer transition-colors
                      hover:bg-gray-100 hover:font-bold hover:text-black
                      ${isSelected ? 'bg-gray-200 font-bold text-black' : 'text-gray-500'}
                    `}
                                        onClick={() =>
                                            handleChatRoomClick(room, 'dm')
                                        }
                                    >
                                        {room.roomName}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* 그룹 카테고리 */}
                <div className="mt-4 max-h-170 overflow-y-auto">
                    <div
                        className="cursor-pointer font-bold flex items-center gap-2"
                        onClick={() => toggleCategory('group')}
                    >
                        <div>그룹</div>
                        <div
                            className={
                                expandedCategory === 'group'
                                    ? 'transition transform-[rotate(90deg)]'
                                    : 'transition'
                            }
                        >
                            {arrowRight}
                        </div>
                    </div>
                    {expandedCategory === 'group' && (
                        <ul className="mt-2 ml-4">
                            {groupRooms.map((room) => {
                                const isSelected =
                                    selectedRoom?.roomId === room.roomId &&
                                    chatType === 'group';
                                return (
                                    <li
                                        key={room.roomId}
                                        className={`
                      p-2 cursor-pointer transition-colors
                      hover:bg-gray-100 hover:font-bold hover:text-black
                      ${isSelected ? 'bg-gray-200 font-bold text-black' : 'text-gray-500'}
                    `}
                                        onClick={() =>
                                            handleChatRoomClick(room, 'group')
                                        }
                                    >
                                        {room.roomName}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
