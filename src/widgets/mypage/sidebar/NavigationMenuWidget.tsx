import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Contact, Settings, Heart } from 'lucide-react';

const NavigationMenuWidget: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            path: `/mypage`,
            label: '소개글',
            icon: <Contact size={16} />,
        },
        {
            path: `/mypage/heart`,
            label: '좋아요 목록',
            icon: <Heart size={16} />,
        },
        {
            path: `/mypage/setting`,
            label: '설정',
            icon: <Settings size={16} />,
        },
    ];

    return (
        <nav className="flex flex-col w-full">
            <ul className="space-y-4 text-base font-medium text-gray-700">
                {navItems.map(({ path, label, icon }) => {
                    const isActive =
                        path === `/mypage`
                            ? location.pathname === path
                            : location.pathname.startsWith(path);
                    return (
                        <li key={path}>
                            <button
                                className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:text-black
                                        ${
                                            isActive
                                                ? 'border-l-2 border-blue-500 text-black font-bold'
                                                : 'text-gray-500'
                                        }`}
                                onClick={() => navigate(path)}
                            >
                                {icon}
                                <span>{label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default NavigationMenuWidget;
