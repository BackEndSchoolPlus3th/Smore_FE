import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { jwtDecode } from 'jwt-decode';
import { apiClient, SubmitButton } from '../../shared';
import { useParams } from 'react-router-dom';

interface Participant {
    memberId: number;
    memberName: string;
    profileImageUrl?: string | null;
}

type Message = {
    type: 'message';
    sender: 'me' | 'other';
    text: string;
    time: string;
    date: string;
    senderName: string;
    senderProfile: string;
};

type Divider = {
    type: 'divider';
    text: string;
};

type ChatMessage = Message | Divider;

interface ChatProps {
    roomId: string;
    chatType: 'dm' | 'group';
}

/** JWT에 Bearer 접두어 추가 */
const addBearer = (token: string) => {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

/** 토큰 만료 여부 간단 검사 */
const isTokenExpired = (token: string): boolean => {
    try {
        if (!token || token === '') return true;
        const decoded: any = jwtDecode(token);
        if (!decoded || !decoded.exp) return true;
        return Date.now() >= decoded.exp * 1000;
    } catch (error) {
        console.error('Token decoding failed:', error);
        return true;
    }
};

/** JWT 디코딩하여 사용자 ID(subject) 추출 */
const getUserIdFromToken = (token: string): string => {
    try {
        if (!token || token === '') {
            console.warn('JWT 토큰이 비어있습니다.');
            return 'anonymous';
        }
        const actualToken = token.startsWith('Bearer ')
            ? token.substring(7)
            : token;
        const decoded: any = jwtDecode(actualToken);
        console.log('JWT 디코딩 결과:', decoded);
        if (!decoded) {
            console.error('JWT 디코딩 결과가 없습니다.');
            return 'anonymous';
        }
        if (!decoded.sub) {
            console.error('JWT에서 sub 필드를 찾을 수 없습니다:', decoded);
            if (decoded.userId) {
                return String(decoded.userId);
            } else if (decoded.id) {
                return String(decoded.id);
            }
            return 'anonymous';
        }
        console.log('현재 로그인 사용자 ID(JWT sub 필드):', decoded.sub);
        return String(decoded.sub);
    } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        console.error('토큰 값:', token.substring(0, 20) + '...');
        return 'anonymous';
    }
};

const Chat: React.FC<ChatProps> = ({ roomId, chatType }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const stompClient = useRef<Client | null>(null);
    const connectionActive = useRef<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [rawMessages, setRawMessages] = useState<any[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);

    // URL 파라미터 (필요시 사용)
    const { study_id } = useParams();

    // senderId를 받아 참여자 객체 반환
    const findParticipantById = (id: string): Participant | null => {
        const p = participants.find((p) => String(p.memberId) === id);
        return p || null;
    };

    // localStorage에서 토큰 상태 관리 (초기화)
    const [jwt, setJwt] = useState<string>(() => {
        const storedToken = localStorage.getItem('accessToken') || '';
        console.log('초기 토큰 로드:', storedToken.substring(0, 20) + '...');
        return storedToken;
    });

    // 현재 사용자 ID 저장 (초기화)
    const [currentUserId, setCurrentUserId] = useState<string>(() => {
        const storedToken = localStorage.getItem('accessToken') || '';
        const userId = getUserIdFromToken(storedToken);
        console.log(
            '초기 사용자 ID 설정:',
            userId,
            '(타입:',
            typeof userId,
            ')'
        );
        return userId;
    });

    // localStorage 변경 감지 (토큰 업데이트)
    useEffect(() => {
        const handleStorageChange = () => {
            const tokenFromStorage = localStorage.getItem('accessToken') || '';
            if (tokenFromStorage !== jwt) {
                console.log('토큰이 변경되었습니다.');
                if (stompClient.current) {
                    stompClient.current.deactivate();
                    stompClient.current = null;
                    connectionActive.current = false;
                }
                setJwt(tokenFromStorage);
                const newUserId = getUserIdFromToken(tokenFromStorage);
                console.log(
                    '사용자 ID 업데이트 [storage event]:',
                    currentUserId,
                    '->',
                    newUserId
                );
                setCurrentUserId(newUserId);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        const intervalId = setInterval(() => {
            const tokenFromStorage = localStorage.getItem('accessToken') || '';
            if (tokenFromStorage !== jwt) {
                handleStorageChange();
            }
        }, 3000);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [jwt, currentUserId]);

    // Refresh Token 가져오기
    const getRefreshToken = () => {
        const cookies = document.cookie.split('; ');
        const refreshTokenCookie = cookies.find((row) =>
            row.startsWith('refreshToken=')
        );
        return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
    };

    // 참가자 데이터 불러오기 (그룹 채팅의 경우)
    useEffect(() => {
        if (chatType === 'group' && roomId) {
            apiClient
                .get(`/api/v1/chatrooms/group/${roomId}/users`)
                .then((response) => {
                    console.log('참가자 데이터:', response.data);
                    setParticipants(response.data);
                })
                .catch((error) => {
                    console.error('참가자 데이터 로드 실패:', error);
                });
        }
    }, [roomId, chatType]);

    // 메시지 히스토리 불러오기 rawMessages에 저장
    useEffect(() => {
        if (!roomId || !chatType || !currentUserId) return;
        apiClient
            .get(`/api/v1/chatrooms/${chatType}/${roomId}/messages`)
            .then((response) => {
                setRawMessages(response.data);
            })
            .catch((error) => {
                console.error('메시지 불러오기 실패:', error);
            });
    }, [roomId, chatType, currentUserId]);

    // rawMessages와 participants가 바뀔 때마다 최종 messages로 매핑
    useEffect(() => {
        if (rawMessages.length === 0) return;
        const loaded: ChatMessage[] = [];
        let lastDate: string | null = null;
        rawMessages.forEach((msg) => {
            const dateObj = new Date(msg.createdDate);
            const dateStr = dateObj.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            });
            const timeStr = dateObj.toLocaleTimeString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
            const isSentByMe = String(msg.senderId) === String(currentUserId);
            const participant = findParticipantById(String(msg.senderId));
            const senderName = participant
                ? participant.memberName
                : '알 수 없음';
            const senderProfile = participant?.profileImageUrl || '';
            if (!lastDate || lastDate !== dateStr) {
                loaded.push({ type: 'divider', text: dateStr });
                lastDate = dateStr;
            }
            loaded.push({
                type: 'message',
                sender: isSentByMe ? 'me' : 'other',
                text: msg.message,
                time: timeStr,
                date: dateStr,
                senderName,
                senderProfile,
            });
        });
        setMessages(loaded);
    }, [rawMessages, participants, currentUserId]);

    // 실시간 메시지도 rawMessages에 추가
    const onMessageReceived = (data: any) => {
        setRawMessages((prev) => [...prev, data]);
    };

    // Refresh Token 갱신 후 재연결
    const refreshAccessTokenAndReconnect = async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            console.warn('❌ Refresh Token이 없음! 다시 로그인하세요.');
            return;
        }
        try {
            const response = await apiClient.post('/api/member/refresh', {
                refreshToken,
            });
            const newJwt = response.data.accessToken;
            console.log('토큰 갱신 성공 - 이전:', jwt.substring(0, 20) + '...');
            console.log(
                '토큰 갱신 성공 - 새 토큰:',
                newJwt.substring(0, 20) + '...'
            );
            localStorage.setItem('accessToken', newJwt);
            setJwt(newJwt);
            const newUserId = getUserIdFromToken(newJwt);
            console.log(
                '사용자 ID 업데이트 [토큰 갱신]:',
                currentUserId,
                '->',
                newUserId
            );
            setCurrentUserId(newUserId);
            console.log('✅ 새로운 Access Token 받음! 웹소켓 다시 연결합니다.');
            connectWebSocket();
        } catch (error) {
            console.error(
                '❌ Refresh Token 갱신 실패! 다시 로그인하세요.',
                error
            );
            localStorage.removeItem('accessToken');
            setJwt('');
            setCurrentUserId('anonymous');
        }
    };

    // WebSocket 연결 및 메시지 수신
    const connectWebSocket = () => {
        if (connectionActive.current) {
            console.log('웹소켓 연결이 이미 진행 중입니다.');
            return;
        }
        connectionActive.current = true;
        if (!jwt || jwt === '') {
            console.warn('토큰이 없습니다. 연결을 중단합니다.');
            connectionActive.current = false;
            return;
        }
        if (isTokenExpired(jwt)) {
            console.warn('토큰이 만료되었습니다. 갱신 시도합니다.');
            refreshAccessTokenAndReconnect();
            connectionActive.current = false;
            return;
        }
        if (stompClient.current) {
            console.log('기존 웹소켓 연결 정리 중...');
            stompClient.current.deactivate();
            stompClient.current = null;
        }
        try {
            const debugDecoded: any = jwtDecode(jwt);
            console.log('디버그 - 토큰 디코딩 결과:', debugDecoded);
        } catch (error) {
            console.error('디버그 - 토큰 디코딩 실패:', error);
        }
        console.log('웹소켓 연결 시도 중...');
        console.log('현재 사용자 ID:', currentUserId);
        const socket = new SockJS(
            `http://localhost:8090/ws?token=${jwt}`,
            undefined,
            {
                xhrWithCredentials: true,
            } as any
        );
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { Authorization: addBearer(jwt) },
            onConnect: () => {
                console.log('✅ 웹소켓 연결됨');
                console.log(`구독 중: /topic/chatroom/${roomId}`);
                stompClient.current?.subscribe(
                    `/topic/chatroom/${roomId}`,
                    (msg) => {
                        try {
                            const data = JSON.parse(msg.body);
                            console.log('📩 새로운 메시지 도착!', data);
                            const isSentByMe =
                                String(data.senderId) === String(currentUserId);
                            setMessages((prevMessages) => {
                                const dateObj = new Date(data.timestamp);
                                const dateStr = dateObj.toLocaleDateString(
                                    'ko-KR',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long',
                                    }
                                );
                                const timeStr = dateObj.toLocaleTimeString(
                                    'ko-KR',
                                    {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    }
                                );
                                const newMessages = [...prevMessages];
                                if (
                                    newMessages.length === 0 ||
                                    (newMessages[newMessages.length - 1]
                                        .type === 'message' &&
                                        (
                                            newMessages[
                                                newMessages.length - 1
                                            ] as Message
                                        ).date !== dateStr)
                                ) {
                                    newMessages.push({
                                        type: 'divider',
                                        text: dateStr,
                                    });
                                }
                                const participant = findParticipantById(
                                    String(data.senderId)
                                );
                                const senderName = participant
                                    ? participant.memberName
                                    : '알 수 없음';
                                const senderProfile =
                                    participant?.profileImageUrl || '';
                                newMessages.push({
                                    type: 'message',
                                    sender: isSentByMe ? 'me' : 'other',
                                    text: data.message,
                                    time: timeStr,
                                    date: dateStr,
                                    senderName,
                                    senderProfile,
                                });
                                return newMessages;
                            });
                        } catch (error) {
                            console.error('메시지 처리 중 오류 발생:', error);
                        }
                    }
                );
                connectionActive.current = false;
            },
            onStompError: (frame) => {
                console.error('❌ 웹소켓 STOMP 에러 발생!', frame);
                if (frame.body && frame.body.indexOf('만료된 JWT 토큰') >= 0) {
                    refreshAccessTokenAndReconnect();
                }
                connectionActive.current = false;
            },
            onDisconnect: () => {
                console.log('⚠️ 웹소켓 연결 끊김! 5초 후 재연결 시도...');
                connectionActive.current = false;
                setTimeout(connectWebSocket, 5000);
            },
            onWebSocketClose: () => {
                console.log('⚠️ 웹소켓 닫힘');
                connectionActive.current = false;
            },
            onWebSocketError: (event) => {
                console.error('⚠️ 웹소켓 에러:', event);
                connectionActive.current = false;
            },
        });
        stompClient.current.activate();
    };

    useEffect(() => {
        if (jwt && roomId) {
            console.log('웹소켓 연결 요소 변경 - 재연결 시도');
            console.log('사용중인 사용자 ID:', currentUserId);
            connectWebSocket();
        }
        return () => {
            if (stompClient.current) {
                console.log('컴포넌트 언마운트 - 웹소켓 연결 종료');
                stompClient.current.deactivate();
                stompClient.current = null;
                connectionActive.current = false;
            }
        };
    }, [roomId, jwt, currentUserId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() === '') return;
        const currentToken = localStorage.getItem('accessToken') || '';
        const latestUserId = getUserIdFromToken(currentToken);
        if (currentToken !== jwt) {
            console.log('메시지 전송 - 토큰 변경 감지, 업데이트 중');
            setJwt(currentToken);
            setCurrentUserId(latestUserId);
            console.log('메시지 전송 - 사용자 ID 업데이트:', latestUserId);
        } else {
            console.log('메시지 전송 - 사용자 ID:', currentUserId);
        }
        if (stompClient.current?.connected) {
            stompClient.current.publish({
                destination: '/app/chat/sendMessage',
                headers: { Authorization: addBearer(currentToken) },
                body: JSON.stringify({
                    roomId,
                    chatType,
                    message: input,
                    attachment: null,
                }),
            });
            console.log(
                '메시지 전송됨 - 인증 토큰:',
                currentToken.substring(0, 20) + '...'
            );
        } else {
            console.warn(
                '웹소켓 연결이 없어 메시지를 전송할 수 없습니다. 재연결을 시도합니다.'
            );
            connectWebSocket();
        }
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
            e.preventDefault();
            setInput((prev) => prev + '\n');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-full m-4 flex flex-col gap-4">
            {/* 메시지 영역 */}
            <div className="flex flex-col p-4 overflow-y-auto h-full bg-purple-100 rounded-xl">
                <div className="overflow-y-auto p-4">
                    {messages.map((msg, index) =>
                        msg.type === 'divider' ? (
                            <div
                                className="text-center text-gray-500 mt-4 mb-4"
                                key={index}
                            >
                                {msg.text}
                            </div>
                        ) : (
                            <div
                                key={index}
                                className={`flex my-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'other' && (
                                    <div className="flex flex-col items-center mr-2">
                                        {msg.senderProfile ? (
                                            <img
                                                src={msg.senderProfile}
                                                alt="프로필"
                                                className="w-10 h-10 rounded-full object-cover mb-1"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                                        )}
                                        <span className="text-xs">
                                            {msg.senderName}
                                        </span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[60%] p-3 rounded-lg shadow-md ${
                                        msg.sender === 'me'
                                            ? 'bg-white text-gray-800'
                                            : 'bg-white text-gray-800'
                                    }`}
                                >
                                    {msg.text}
                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                        {msg.time}
                                    </div>
                                </div>
                                {msg.sender === 'me' && (
                                    <div className="flex flex-col items-center ml-2"></div>
                                )}
                            </div>
                        )
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>
            {/* 입력 영역 */}
            <div className="flex p-2 bg-white shadow-md rounded-xl border border-gray-200">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요."
                    className="flex-1 p-2 resize-none border-none outline-none text-sm h-10 rounded-md"
                />
                <SubmitButton
                    onClick={sendMessage}
                    color="bg-purple-200"
                    clickColor="hover:bg-purple-300 active:bg-purple-380"
                    label="전송"
                />
            </div>
        </div>
    );
};

export default Chat;
