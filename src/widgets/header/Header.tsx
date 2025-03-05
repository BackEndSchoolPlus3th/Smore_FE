// src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../shared';
import AlarmPage from '../../pages/alarm/AlarmPage';
import { FaBell } from 'react-icons/fa';
import { logout } from '../../features/auth/model/authSlice'; // logout 액션 import

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isAlarm, setIsAlarm] = useState(false);
    // Redux 스토어에서 로그인 상태를 가져옵니다.
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user;

    const goToMainPage = () => {
        navigate('/');
    };

    const goToChatPage = () => {
        navigate('/chat');
    };

    const goToStudyMainPage = () => {
        navigate('/mystudy');
    };

    const goToLoginPage = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        dispatch(logout());
        // 로그아웃 후 로그인 페이지로 이동하거나, 메인 페이지로 이동할 수 있습니다.
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
                <AlarmPage isOpen={isAlarm} onClose={() => setIsAlarm(false)} />
                {user ? (
                    // 로그인 상태이면 사용자 이름과 로그아웃 버튼을 옆에 배치
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">
                            {user.nickname}
                        </span>
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    // 로그인되지 않은 상태면 로그인 버튼 표시
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
