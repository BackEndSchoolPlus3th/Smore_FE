import React, { useState, useEffect, useCallback } from 'react';
import { apiClient, SubmitButton, CancleButton } from '../../shared';
import { FaTimes } from 'react-icons/fa'; // X 아이콘 추가
import { Link, useNavigate } from 'react-router-dom';

interface Alarm {
    id: number;
    message: string;
    eventName: string;
    isRead: boolean;
    senderId: string;
    receiverId: string;
    studyId: string;
    events: string[];
}

interface AlarmPageProps {
    isOpen: boolean;
    events: Event[];
    onClose: () => void;
}
const AlarmPage: React.FC<AlarmPageProps> = ({ isOpen, onClose, events }) => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const navigate = useNavigate();
    const fetchAlarms = useCallback(async () => {
        try {
            const response = await apiClient.get(`/api/v1/alarm`);
            setAlarms(response.data);
        } catch (error) {
            console.error('알림 조회 실패:', error);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchAlarms();
        }
    }, [isOpen, fetchAlarms]);

    useEffect(() => {
        if (events.length > 0) {
            fetchAlarms();
        }
    }, [events, fetchAlarms]);

    const startChat = async (alarm: Alarm) => {
        navigate('/chat');
        try {
            await apiClient.post(`/api/chatrooms/dm`, {
                member1Id: alarm.receiverId,
                member2Id: alarm.senderId,
            });

            console.log('채팅방 생성 성공');
        } catch (error) {
            console.error('채팅 시작 실패:', error);
        }
    };

    const apply = async (alarm: Alarm) => {
        try {
            const match = alarm.message.match(
                /(.+?)님이 (.+?)에 지원하였습니다\./
            );
            if (match) {
                await apiClient.post(`/api/v1/study/${alarm.studyId}/addMember`, {
                    studyTitle: alarm.studyId,
                    memberId: alarm.senderId,
                    role: "MEMBER",
                    permissionRecruitManage: 0,
                    permissionArticleManage: 0,
                    permissionCalendarManage: 0,
                    permissionSettingManage: 0,
                });
            }
        } catch (error) {
            console.error('지원 수락 실패:', error);
        }
    };

    const reject = async (alarm: Alarm) => {
        try {
            const match = alarm.message.match(
                /(.+?)님이 (.+?)에 지원하였습니다\./
            );
            if (match) {
                await apiClient.post(`/api/v1/study/${alarm.studyId}/reject`, {
                    memberId: alarm.senderId
                });
            }
        } catch (error) {
            console.error('지원 거절 실패:', error);
        }
    };

    const markAsRead = async (alarm: Alarm) => {
        try {
            await apiClient.delete(`/api/v1/alarm/${alarm.id}`);
            setAlarms((prev) =>
                prev.map((a) =>
                    a.id === alarm.id ? { ...a, isRead: true } : a
                )
            );
        } catch (error) {
            console.error('알림 확인 실패:', error);
        }
    };

    const renderNotification = (alarm: Alarm) => {
        return (
            <div className="p-3 rounded-lg w-full shadow-md relative border border-gray-200">
                {/* X 버튼 - 오른쪽 위에 배치 */}
                <button
                    className="absolute top-2 right-0 text-gray-300 text-xs p-1 hover:text-gray-500 transition cursor-pointer"
                    onClick={() => markAsRead(alarm)}
                >
                    <FaTimes className="text-sm" />
                </button>

                <p className="text-xs pr-1">{alarm.message}</p>

                {alarm.eventName === 'application__reached' && (
                    <>
                        {/* 수락, 거절, 채팅 버튼을 한 줄에 배치 */}
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            <CancleButton
                                onClick={() => reject(alarm)}
                                size="text-xs px-2 py-1"
                                label="거절"
                            />
                            <SubmitButton
                                onClick={() => apply(alarm)}
                                label="수락"
                                size="text-xs px-2 py-1"
                                clickColor="hover:bg-green-200 active:bg-green-300"
                            />
                            <SubmitButton
                                onClick={() => startChat(alarm)}
                                label="채팅 시작"
                                size="text-xs px-2 py-1"
                                clickColor="hover:bg-purple-200 active:bg-purple-300"
                            />
                        </div>
                    </>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800/75 z-999"
            onClick={onClose}
        >
            <div className="w-[75rem] mx-10 grid grid-cols-12 gap-6">
                <div
                    className="bg-white rounded-xl shadow-lg col-start-5 col-span-4 h-130 flex flex-col gap-4 p-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-lg font-bold text-center text-gray-800">
                        알림 ({alarms.length})
                    </h3>
                    <div className="grid gap-2 max-h-108 overflow-y-auto pr-1">
                        {alarms.map((alarm) => (
                            <div key={alarm.id}>
                                {renderNotification(alarm)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlarmPage;
