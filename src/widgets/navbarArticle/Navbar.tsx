// src/widgets/navbar/Navbar.js
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LayoutGrid, BookOpen, Image, Settings, Home, Calendar, MessageSquare } from 'lucide-react';


const Navbar = () => {
const { studyId } = useParams();
  const navigate = useNavigate();

  const goToStudyMainPage = () => {
    navigate(`/study/${studyId}`);
  };
  const goToSchedulePage = () => {
    navigate(`/study/${studyId}/schedules`);
  };
  const goToDocumentPage = () => {
    navigate(`/study/${studyId}/document`);
  };
  const goToStudyArticlePage = () => {
    navigate(`/study/${studyId}/article`);
  };
  const goToSettingPage = () => {
    navigate(`/study/${studyId}/studysetting`);
  };

  return (
    <div className="flex border-b bg-[#FAFBFF]">
      <button className="px-4 py-2 border-b-2 border-purple-500 text-sm font-medium" 
      onClick={goToStudyMainPage}>
        <div className="flex items-center gap-1">
          <Home size={16} />
          <span>메인</span>
        </div>
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-500" 
      onClick={goToSchedulePage}>
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>캘린더</span>
          </div>
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-500"
      onClick={goToDocumentPage}>
        <div className="flex items-center gap-1">
          <Image size={16} />
          <span>아카이브</span>
          </div>
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-500" 
      onClick={goToStudyArticlePage}>
        <div className="flex items-center gap-1">
          <MessageSquare size={16} />
          <span>작업실</span>
          </div>
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-500" 
      onClick={goToSettingPage}>
        <div className="flex items-center gap-1">
          <Settings size={16} />
          <span>설정</span>
          </div>
      </button>
    </div>
  );
};

export default Navbar;
