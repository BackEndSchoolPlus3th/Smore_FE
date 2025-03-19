import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Participants from '../Participants';

type ChatRoom = {
    roomId: string;
    roomName: string;
    studyId?: number;
};

const ChatPageForm: React.FC<{
    selectedRoom: ChatRoom | null;
    onRoomSelect: (room: ChatRoom) => void;
}> = ({ selectedRoom, onRoomSelect }) => {
    return (
        <>
            <div className="h-screen grid grid-cols-12 col-span-12 gap-4 py-6">
                <Sidebar
                    selectedRoom={selectedRoom}
                    onRoomSelect={onRoomSelect}
                />
                {/* 본문 영역 - flex-1로 남은 공간 모두 차지 */}
                <Outlet />
                <Participants />
            </div>
        </>
    );
};

export default ChatPageForm;
