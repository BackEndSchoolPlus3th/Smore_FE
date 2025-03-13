// src/widgets/navbar/Navbar.js
import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Archive, Settings, Home, Calendar, Clipboard } from 'lucide-react';


const Navbar = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 경로 확인

  const navItems = [
    { path: `/study/${studyId}/`, label: "메인", icon: <Home size={16} /> },
    { path: `/study/${studyId}/schedules`, label: "캘린더", icon: <Calendar size={16} /> },
    { path: `/study/${studyId}/document`, label: "아카이브", icon: <Archive size={16} /> },
    { path: `/study/${studyId}/article`, label: "게시판", icon: <Clipboard size={16} /> },
    { path: `/study/${studyId}/studysetting`, label: "설정", icon: <Settings size={16} /> },
  ];

  return (
    <div className="flex border-b bg-[#FAFBFF]">
      {navItems.map(({ path, label, icon }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            className={`px-4 py-2 text-sm font-medium ${
              isActive ? "border-b-2 border-[#7743DB] text-black font-medium" : "text-gray-500"
            }`}
            onClick={() => navigate(path)}
          >
            <div className="flex items-center gap-1">{icon}<span>{label}</span></div>
          </button>
        );
      })}
    </div>
  );
};

export default Navbar;
