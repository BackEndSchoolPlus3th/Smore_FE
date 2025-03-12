<<<<<<< Updated upstream
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
=======
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../shared";
import AlarmPage from "../../pages/alarm/AlarmPage";
import { FaBell } from "react-icons/fa";
import { useLogout } from "../../features";
import { useGlobalEvents } from "../../shared/sse/EventProvider";
>>>>>>> Stashed changes

const Header = () => {
    const navigate = useNavigate();
    const [isAlarm, setIsAlarm] = useState(false);
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user;
    const logoutHandler = useLogout();
<<<<<<< Updated upstream
    const { events } = useGlobalEvents() || { events: [] };
    const [showMyPagePopup, setShowMyPagePopup] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
=======
    const { events: sseEvents } = useGlobalEvents() || { events: [] };
    
    // 🚨 새로운 알림이 있는지 확인하는 상태
    const [hasNewAlarm, setHasNewAlarm] = useState(false);

    useEffect(() => {
        if (sseEvents.length > 0) {
            setHasNewAlarm(true);  // 새로운 알림이 오면 빨간불 표시
        }
    }, [sseEvents]); // SSE 이벤트가 변경될 때 감지
>>>>>>> Stashed changes

    const goToStudyMainPage = () => {
        navigate("/mystudy");
    };

    const goToChatPage = () => {
        navigate("/chat");
    };

    const goToLoginPage = () => {
        navigate("/login");
    };

    // 🔔 알림 창 열 때 새로운 알림 상태 초기화
    const openAlarmPage = () => {
        setIsAlarm(true);
        setHasNewAlarm(false);  // 알림을 확인했으므로 빨간 점 없애기
    };

    const goToMyPagePage = () => {
        navigate('/mypage');
    };

    const handleShowMyPagePopup = () => {
        setShowMyPagePopup((prev) => !prev);
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
<<<<<<< Updated upstream
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
=======
        <div className="flex items-center justify-between bg-muted-purple p-4">
            <Link to="/" className="flex items-center space-x-4 cursor-pointer">
                <img src="/logo_rectangle.png" alt="logo" className="h-15 rounded-lg" />
            </Link>
            <div className="flex items-center space-x-4">
                <AlarmPage isOpen={isAlarm} onClose={() => setIsAlarm(false)} events={sseEvents}  />
                {user ? (
                    <>
                        <button className="text-lg font-semibold cursor-pointer" onClick={goToStudyMainPage}>
                            내스터디
                        </button>
                        <button className="text-lg font-semibold cursor-pointer" onClick={goToChatPage}>
                            채팅페이지
                        </button>

                        {/* 🔔 종 아이콘과 새로운 알림 표시 */}
                        <div className="relative">
                            <FaBell className="text-2xl cursor-pointer" color="yellow" onClick={openAlarmPage} />
                            {hasNewAlarm && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">{user.nickname}</span>
                            <button className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer" onClick={logoutHandler}>
                                로그아웃
>>>>>>> Stashed changes
                            </button>
                        </div>
                        <div className="flex items-center text-center w-full">
                            <button className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                                <Bell size={20} />
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
                                    className="rounded-full"
                                    src={user.profileImageUrl}
                                    alt={user.nickname}
                                    width={20}
                                    height={20}
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
                                        <div className="flex flex-row border-b border-gray-200">
                                            <button
                                                className="flex items-center pb-4 pt-2 pl-2 pr-2 pt-4 cursor-pointer"
                                                onClick={goToMyPagePage}
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
                                            onClick={() => {}}
                                        >
                                            <Settings size={20} />
                                            <span>설정</span>
                                        </button>
                                        <button
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2"
                                            onClick={() => {}}
                                        >
                                            <Heart size={20} />
                                            <span>좋아요</span>
                                        </button>

                                        <button
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2"
                                            onClick={logoutHandler}
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
<<<<<<< Updated upstream
                    <button
                        className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={goToLoginPage}
                    >
                        <User size={20} />
=======
                    <button className="px-4 py-2 bg-dark-purple text-white rounded cursor-pointer" onClick={goToLoginPage}>
                        로그인
>>>>>>> Stashed changes
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
