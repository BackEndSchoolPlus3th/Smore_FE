// Participants.tsx
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../shared';

interface Participant {
    memberId: number;
    memberName: string;
}

interface ParticipantsProps {
    // ChatPage에서 넘기는 chatType, studyId 타입과 동일하게 설정
    chatType: 'dm' | 'group' | null;
    studyId?: number; // group 채팅 시 studyId가 있을 수 있음
}

const Participants: React.FC<ParticipantsProps> = ({ chatType, studyId }) => {
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        // 그룹 채팅 + studyId가 있을 때만 서버에서 참여자 목록을 불러온다고 가정
        if (chatType === 'group' && studyId) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                apiClient.defaults.headers.common['Authorization'] =
                    `Bearer ${token}`;
            }

            apiClient
                .get(`/api/v1/chatrooms/group/${studyId}/users`)
                .then((res) => {
                    setParticipants(res.data);
                })
                .catch((error) => {
                    console.error('참여자 목록 불러오기 실패:', error);
                });
        } else {
            // DM이거나 studyId가 없는 경우에는 참여자 목록 초기화
            setParticipants([]);
        }
    }, [chatType, studyId]);

    return (
        <div className="bg-light-lavender p-4 h-full">
            <h2 className="text-xl font-bold mb-4">참여자</h2>
            <ul className="mt-2 ml-4">
                {participants.map((user) => (
                    <li
                        key={user.memberId}
                        className="p-2 cursor-pointer hover:bg-yellow-300 rounded mb-2"
                    >
                        {user.memberName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Participants;
