import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../shared';
import AlarmPage from '../../pages/alarm/AlarmPage';
import { useLogout } from '../../features';
import {
    BookOpen,
    Settings,
    User,
    Bell,
    MessageSquare,
    Heart,
    LogOut,
    ChevronRight,
} from 'lucide-react';
import { useGlobalEvents } from '../../shared/sse/EventProvider';

const Header = () => {
    const navigate = useNavigate();
    const [isAlarm, setIsAlarm] = useState(false);
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user;
    const logoutHandler = useLogout();
    const { events } = useGlobalEvents() || { events: [] };
    const [showMyPagePopup, setShowMyPagePopup] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [hasNewAlarm, setHasNewAlarm] = useState(false);

    const goToStudyMainPage = () => {
        navigate('/mystudy');
    };

    const goToChatPage = () => {
        navigate('/chat');
    };

    const goToLoginPage = () => {
        navigate('/login');
    };

    const openAlarmPage = () => {
        setIsAlarm(true);
        setHasNewAlarm(false); // 알림 확인 시 빨간 점 제거
    };

    const handleMyPage = () => {
        navigate('/mypage');
        setShowMyPagePopup(false);
    };

    const handleSetting = () => {
        navigate('/mypage/setting');
        setShowMyPagePopup(false);
    };

    const handleHeart = () => {
        navigate('/mypage/heart');
        setShowMyPagePopup(false);
    };

    const handleLogout = () => {
        logoutHandler();
        setShowMyPagePopup(false);
    };

    // 드롭다운 바깥 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowMyPagePopup(false);
            }
        }
        if (events.length > 0) {
            setHasNewAlarm(true);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [events]);

    return (
        <div className="flex flex-col w-full bg-white shadow-md items-center z-49">
            <div className="w-[75rem] mx-10 grid grid-cols-12 gap-6">
                {/* 로고: 왼쪽 2컬럼 사용 */}
                <div className="col-span-2 flex items-center">
                    <Link
                        to="/"
                        className="col-span-2 flex items-center cursor-pointer"
                    >
                        <img
                            src="/logo_final.png"
                            alt="로고"
                            className="h-12 w-auto"
                        />
                    </Link>
                </div>

                {/* 네비게이션 아이콘: 오른쪽 10컬럼, flex로 오른쪽 정렬 */}
                <div className="col-span-10 flex justify-end items-center gap-4 relative">
                    <AlarmPage
                        isOpen={isAlarm}
                        onClose={() => setIsAlarm(false)}
                        events={events}
                    />
                    {user ? (
                        <>
                            <button
                                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                onClick={goToStudyMainPage}
                            >
                                <BookOpen size={20} />
                            </button>
                            <button
                                className="p-2 rounded hover:bg-gray-100 cursor-pointer relative"
                                onClick={openAlarmPage}
                            >
                                <Bell size={20} />
                                {hasNewAlarm && !isAlarm && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>
                            <button
                                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                onClick={goToChatPage}
                            >
                                <MessageSquare size={20} />
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                {user.profileImageUrl ? (
                                    <img
                                        className="rounded-full w-7 h-7 cursor-pointer"
                                        src={user.profileImageUrl}
                                        alt={user.nickname}
                                        onMouseEnter={() =>
                                            setShowMyPagePopup(true)
                                        }
                                        onMouseLeave={() =>
                                            setShowMyPagePopup(false)
                                        }
                                    />
                                ) : (
                                    <button
                                        className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                        onMouseEnter={() =>
                                            setShowMyPagePopup(true)
                                        }
                                        onMouseLeave={() =>
                                            setShowMyPagePopup(false)
                                        }
                                    >
                                        <User size={20} />
                                    </button>
                                )}
                                {showMyPagePopup && user && (
                                    <div
                                        className="absolute top-full right-0 bg-white border border-gray-200 shadow-md rounded-md z-50 min-w-[160px]"
                                        onMouseEnter={() =>
                                            setShowMyPagePopup(true)
                                        }
                                        onMouseLeave={() =>
                                            setShowMyPagePopup(false)
                                        }
                                    >
                                        <div className="flex flex-col">
                                            <button
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={handleMyPage}
                                            >
                                                {user.profileImageUrl ? (
                                                    <img
                                                        className="rounded-full w-10 h-10"
                                                        src={
                                                            user.profileImageUrl
                                                        }
                                                        alt={user.nickname}
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5" />
                                                )}
                                                <span>{user.nickname}</span>
                                                <ChevronRight size={20} />
                                            </button>
                                            <button
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={handleSetting}
                                            >
                                                <Settings size={20} />
                                                <span>설정</span>
                                            </button>
                                            <button
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={handleHeart}
                                            >
                                                <Heart size={20} />
                                                <span>좋아요</span>
                                            </button>
                                            <button
                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={20} />
                                                <span>로그아웃</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button
                            className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                            onClick={goToLoginPage}
                        >
                            <User size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
