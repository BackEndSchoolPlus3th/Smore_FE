import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    InitialChatBoard,
    ChatBoard,
    VideoChatBoard,
    ChatPageForm,
} from '../../components';

type ChatRoom = {
    roomId: string;
    roomName: string;
    studyId?: number;
};

const ChatPage: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ChatPageForm
                        selectedRoom={selectedRoom}
                        onRoomSelect={setSelectedRoom}
                    />
                }
            >
                <Route index element={<InitialChatBoard />} />
                <Route
                    path=":study_id/:chat_type"
                    element={<ChatBoard selectedRoom={selectedRoom} />}
                />
                <Route path=":study_id/video" element={<VideoChatBoard />} />
            </Route>
        </Routes>
    );
};

export default ChatPage;
