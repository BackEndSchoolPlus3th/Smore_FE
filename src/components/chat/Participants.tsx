import React, { useEffect, useState } from 'react';
import { apiClient } from '../../shared';
import { useParams } from 'react-router-dom';

interface Participant {
    memberId: number;
    memberName: string;
    profileImageUrl?: string | null;
}

const Participants: React.FC = () => {
    const { study_id: studyId, chat_type: chatType } = useParams();

    const [participants, setParticipants] = useState<Participant[]>([]);

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
        <div className="h-full col-span-3 p-4 border border-gray-200 rounded-xl shadow-md bg-[#fafbff]">
            <h2 className="text-xl font-bold mb-4">참여자</h2>
            <ul className="mt-2 ml-4">
                {participants.map((user) => (
                    <li
                        key={user.memberId}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded mb-2 text-gray-600 flex items-center"
                    >
                        {/* 프로필 이미지 or 대체 박스 */}
                        {user.profileImageUrl ? (
                            <img
                                src={user.profileImageUrl}
                                alt="프로필"
                                className="w-8 h-8 rounded-full object-cover mr-2"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
                        )}
                        {/* 닉네임 */}
                        <span>{user.memberName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Participants;
