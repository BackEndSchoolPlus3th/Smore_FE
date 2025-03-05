// src/widgets/sidebar/Sidebar.js

import React from 'react';

const Sidebar = ({ studies, onStudySelect, isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`w-1/5 bg-muted-purple p-4 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
      <div className="mb-4 font-bold">스터디 목록</div>
      <ul>
        {studies.map((study) => (
          <li
            key={study.id}
            className="p-2 bg-gray-500 text-white rounded mb-2 text-right flex items-center space-x-2 cursor-pointer"
            onClick={() => onStudySelect(study)}
          >
            <div className="bg-dark-purple w-8 h-8 rounded-full" />
            <span>{study.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
