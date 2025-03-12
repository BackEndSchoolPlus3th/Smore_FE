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
        setHasNewAlarm(false);  // 알림을 확인했으므로 빨간 점 없애기
    };
    
    const handleShowMyPagePopup = () => {
        setShowMyPagePopup((prev) => !prev);
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

    // 바깥 영역 클릭 시 드롭다운 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // dropdownRef의 내부를 클릭하지 않았다면 드롭다운을 닫음
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
        <div className="flex justify-between items-center bg-[#FAFBFF] border-b border-gray-200 shadow-md h-16 w-full z-50">
            <div className="space-x-12 cursor-pointer rounded hover:bg-gray-100 ml-4 mt-2 mb-2">
                <Link
                    to="/"
                    className="flex items-center space-x-4 cursor-pointer"
                >
                    <img src="/logo_final.png" alt="로고" className="h-12" />
                </Link>
            </div>
            <div className="flex gap-2 mr-4 h-full">
                <AlarmPage
                    isOpen={isAlarm}
                    onClose={() => setIsAlarm(false)}
                    events={events}
                />
                {user ? (
                    <>
                        <div className="flex items-center text-center w-full">
                            <button
                                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                onClick={goToStudyMainPage}
                            >
                                <BookOpen size={20} />
                            </button>
                        </div>
                        <div className="flex items-center text-center w-full">
                            <button
                                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                onClick={openAlarmPage}
                            >
                                <Bell size={20} />
                                {hasNewAlarm && (
                                  <span className="absolute top-5 right-30 w-2 h-2 bg-red-500 rounded-full"></span>
                                )} 
                             
                            </button>
                        </div>
                        <div className="flex items-center text-center w-full">
                            <button
                                className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                onClick={goToChatPage}
                            >
                                <MessageSquare size={20} />
                            </button>
                        </div>
                        <div
                            className="flex items-center text-center w-full relative"
                            ref={dropdownRef}
                        >
                            {user.profileImageUrl ? (
                                <img
                                    className="rounded-full w-7 h-7 cursor-pointer"
                                    src={user.profileImageUrl}
                                    alt={user.nickname}
                                    onClick={handleShowMyPagePopup}
                                />
                            ) : (
                                <button
                                    className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                    onClick={handleShowMyPagePopup}
                                >
                                    <User size={20} />
                                </button>
                            )}
                            {showMyPagePopup && user && (
                                <div className="absolute top-full right-0 bg-white border border-gray-200 shadow-md rounded-md z-100 min-w-40">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row border-b border-gray-200 hover:bg-gray-100">
                                            <button
                                                className="flex items-center pb-4 pt-2 pl-2 pr-2 pt-4 cursor-pointer"
                                                onClick={handleMyPage}
                                            >
                                                {user.profileImageUrl ? (
                                                    <img
                                                        className="rounded-full w-10 h-10 ml-2"
                                                        src={
                                                            user.profileImageUrl
                                                        }
                                                        alt={user.nickname}
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 ml-2" />
                                                )}
                                                <p className="ml-2">
                                                    {user.nickname}
                                                </p>
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                        <button
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2"
                                            onClick={handleSetting}
                                        >
                                            <Settings size={20} />
                                            <span>설정</span>
                                        </button>
                                        <button
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2"
                                            onClick={handleHeart}
                                        >
                                            <Heart size={20} />
                                            <span>좋아요</span>
                                        </button>

                                        <button
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={20} />
                                            <span className="">로그아웃</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <button
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2"
                        onClick={goToLoginPage}
                    >
                        <User size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
