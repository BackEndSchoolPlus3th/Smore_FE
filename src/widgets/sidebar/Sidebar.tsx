import { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { Component } from 'lucide-react';

const Sidebar = ({ studies, onStudySelect, isSidebarOpen, toggleSidebar }) => {
  const [selectedStudy, setSelectedStudy] = useState(null);
  return (
    <div className={`w-1/5 bg-grey p-4 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
      <div className="mb-4 font-medium text-gray-600">스터디 목록</div>
      <ul>
        {Array.isArray(studies) && studies.length > 0 ? (
          studies.map((study) => (
            <li
              key={study.id}
              className="p-3 rounded flex items-center space-x-2 cursor-pointer"
              onClick={() => onStudySelect(study)}
            >
              <Component className="w-5 h-5 text-gray-700" />
              <span className="text-gray-900">{study.title}</span>
            </li>
          ))
        ) : (
          <li className="px-4 py-3 text-sm text-gray-500">스터디가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
