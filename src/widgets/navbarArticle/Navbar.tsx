// src/widgets/navbar/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const goToStudyMainPage = () => {
    navigate("/mystudy");
  };
  const goToSchedulePage = () => {
    navigate("/mystudyschedule");
  };
  const goToDocumentPage = () => {
    navigate("/document");
  };
  const goToStudyArticlePage = () => {
    navigate("/study/:studyId/article");
  };
  const goToSettingPage = () => {
    navigate("/studysetting");
  };

  return (
    <div className="bg-purple-100 text-white flex justify-between mx-auto mt-0 pb-3">
      <div className="flex justify-center w-full">
        <button className="px-3 py-1 bg-dark-purple cursor-pointer" onClick={goToStudyMainPage}>
          메인
        </button>
        <button className="px-3 py-1 bg-dark-purple cursor-pointer" onClick={goToSchedulePage}>
          캘린더
        </button>
        <button className="px-3 py-1 bg-dark-purple cursor-pointer" onClick={goToDocumentPage}>
          문서함
        </button>
        <button className="px-3 py-1 bg-dark-purple cursor-pointer" onClick={goToStudyArticlePage}>
          게시판
        </button>
        <button className="px-3 py-1 bg-dark-purple cursor-pointer" onClick={goToSettingPage}>
          설정
        </button>
      </div>
    </div>
  );
};

export default Navbar;
