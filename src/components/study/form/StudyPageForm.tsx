import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudySideBar from '../sidebar/StudySideBar';
import StudyNavBar from '../nav/StudyNavBar';

const StudyPageForm: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex flex-row w-full min-h-full">
            {/* 사이드바 */}
            {isSidebarOpen && (
                <div className="w-1/5">
                    <StudySideBar />
                </div>
            )}
            <div className="">
                <button
                    className="bg-blue-500 text-white p-2 cursor-pointer"
                    onClick={handleToggleSidebar}
                >
                    =
                </button>
            </div>
            <div className="flex flex-col w-full">
                {/* nav바 */}
                <div className="flex w-full">
                    <StudyNavBar />
                </div>
                {/* 보드 영역 */}
                <div className="flex flex-1 w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudyPageForm;
