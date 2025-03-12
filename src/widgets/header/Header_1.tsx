// src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../shared';
import AlarmPage from '../../pages/alarm/AlarmPage';
import { FaBell } from 'react-icons/fa';
import { useLogout } from '../../features';

const Header = () => {
    const navigate = useNavigate();
    const [isAlarm, setIsAlarm] = useState(false);
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user;

    const logoutHandler = useLogout();

    const goToStudyMainPage = () => {
        navigate('/mystudy');
    };

    const goToChatPage = () => {
        navigate('/chat');
    };

    const goToLoginPage = () => {
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-between bg-muted-purple p-4">
            <Link to="/" className="flex items-center space-x-4 cursor-pointer">
                <img
                    src="/logo_rectangle.png"
                    alt="logo"
                    className="h-15 rounded-lg"
                />
            </Link>
            <div className="flex items-center space-x-4">
                <AlarmPage isOpen={isAlarm} onClose={() => setIsAlarm(false)} />
                {user ? (
                    // 로그인된 경우: 내스터디, 채팅페이지, 알림, 닉네임, 로그아웃 버튼 표시
                    <>
                        <button
                            className="text-lg font-semibold cursor-pointer"
                            onClick={goToStudyMainPage}
                        >
                            내스터디
                        </button>
                        <button
                            className="text-lg font-semibold cursor-pointer"
                            onClick={goToChatPage}
                        >
                            채팅페이지
                        </button>
                        <FaBell
                            className="text-2xl cursor-pointer"
                            color="yellow"
                            onClick={() => setIsAlarm(true)}
                        />
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">
                                {user.nickname}
                            </span>
                            <button
                                className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                                onClick={logoutHandler}
                            >
                                로그아웃
                            </button>
                        </div>
                    </>
                ) : (
                    // 로그인되지 않은 경우: 로그인 버튼 표시
                    <button
                        className="px-4 py-2 bg-dark-purple text-white rounded cursor-pointer"
                        onClick={goToLoginPage}
                    >
                        로그인
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
