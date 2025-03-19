import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Archive, Settings, Home, Calendar, Clipboard } from 'lucide-react';

const StudyNavBar: React.FC = () => {
    const { studyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 경로 확인

    const navItems = [
        { path: `/study/${studyId}`, label: '메인', icon: <Home size={16} /> },
        {
            path: `/study/${studyId}/calendar`,
            label: '캘린더',
            icon: <Calendar size={16} />,
        },
        {
            path: `/study/${studyId}/document`,
            label: '아카이브',
            icon: <Archive size={16} />,
        },
        {
            path: `/study/${studyId}/article`,
            label: '게시판',
            icon: <Clipboard size={16} />,
        },
        {
            path: `/study/${studyId}/recruitment`,
            label: '모집',
            icon: <Clipboard size={16} />,
        },
        {
            path: `/study/${studyId}/setting`,
            label: '설정',
            icon: <Settings size={16} />,
        },
    ];

    return (
        <div className="border-b bg-[#FAFBFF] col-span-12 h-fit border-gray-200">
            {navItems.map(({ path, label, icon }) => {
                const isActive =
                    path === `/study/${studyId}`
                        ? location.pathname === path
                        : location.pathname.startsWith(path);
                return (
                    <button
                        key={path}
                        className={`px-4 py-2 text-sm font-medium cursor-pointer hover:text-black
                            ${
                                isActive
                                    ? 'border-b-2 border-purple-500 text-black font-medium'
                                    : 'text-gray-500'
                            }`}
                        onClick={() => navigate(path)}
                    >
                        <div className="flex items-center gap-1">
                            {icon}
                            <span>{label}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default StudyNavBar;
