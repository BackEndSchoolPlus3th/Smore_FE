import React from 'react';

const Sidebar: React.FC = () => {
    const studyRooms = ["DM", "Python 스터디", "Java를 배워봅시다"];

    return (
        <div className="w-1/5 bg-yellow-200 p-4">
            <h2 className="text-xl font-bold">SMore</h2>
            <ul className="mt-4">
                {studyRooms.map((room, index) => (
                    <li key={index} className="p-2 hover:bg-yellow-300 cursor-pointer">
                        {room}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
