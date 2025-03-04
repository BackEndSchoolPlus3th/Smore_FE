// import React from "react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AlarmPage from '../../pages/alarm/AlarmPage.tsx';
import { FaBell } from 'react-icons/fa';

const Header = () => {
    const navigate = useNavigate();
    const [isAlarm, setIsAlarm] = useState(false);
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

    return (
        <div className="flex items-center justify-between bg-muted-purple p-4">
            <img
                src="/logo_rectangle.png"
                alt="logo"
                className="h-20 cursor-pointer"
                onClick={goToMainPage}
            />
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
                    className="text-2xl"
                    color="yellow"
                    onClick={() => setIsAlarm(true)}
                />

                <AlarmPage isOpen={isAlarm} onClose={() => setIsAlarm(false)} />
                <button
                    className="px-4 py-2 bg-dark-purple text-white rounded cursor-pointer"
                    onClick={goToLoginPage}
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default Header;
