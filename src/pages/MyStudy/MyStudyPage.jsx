import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../widgets/header/Header";

const MyStudyPage = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const goToStudyMainPage = () => {
    navigate("/MyStudy");
  };

  const goToSchedulePage = () => {
    navigate("/Schedule");
  };
  const goToDocumentPage = () => {
    navigate("/Document");
  };
  const goToStudyArticlePage = () => {
    navigate("/StudyArticle");
  };
  const goToSettingPage = () => {
    navigate("/StudySetting");
  };

  const goToStudyEditPage = () => {
    navigate("/StudyEdit");
  };

  const handleExitClick = () => {
    const userConfirmed = window.confirm("탈퇴하시겠습니까?");
    if (userConfirmed) {
      alert("탈퇴가 완료되었습니다.");
      navigate("/");
    } else {
      console.log("탈퇴를 취소했습니다.");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      <Header />

      <div className="flex flex-1">
        {/* 사이드바 */}
        <div className={`w-1/5 bg-gray-400 p-4 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <div className="mb-4 text-lg font-bold">스터디 목록</div>
          <ul>
            {['스터디A', '스터디B', '스터디C', '스터디D'].map((study, index) => (
              <li key={index} className="p-2 bg-gray-500 text-white rounded mb-2 text-right flex items-center space-x-2">
                <div className="bg-gray-600 w-8 h-8 rounded-full" />
                <span>{study}</span>
              </li>

            ))}
          </ul>
        </div>

        {/* 버튼을 클릭하여 사이드바를 열고 닫을 수 있도록 */}
        <div className="bg-gray-400">
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 bg-gray-500 text-white mb-4"
          >
            {isSidebarOpen ? '=' : '='}
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 pt-0 p-6 bg-gray-200">
          <div>
            {/* 네브 바 */}
            <div className="bg-gray-200 text-white flex justify-between mx-auto mt-0 pb-3">
              <div className="flex justify-center w-full">
                <button className="px-3 py-1 bg-gray-600 cursor-pointer" onClick={goToStudyMainPage}>메인</button>
                <button className="px-3 py-1 bg-gray-600 cursor-pointer" onClick={goToSchedulePage}>캘린더</button>
                <button className="px-3 py-1 bg-gray-600 cursor-pointer" onClick={goToDocumentPage}>문서함</button>
                <button className="px-3 py-1 bg-gray-600 cursor-pointer" onClick={goToStudyArticlePage}>게시판</button>
                <button className="px-3 py-1 bg-gray-600 cursor-pointer" onClick={goToSettingPage}>설정</button>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-1 py-1 bg-black text-white font-semibold cursor-pointer whitespace-nowrap rounded mt-3"
                  onClick={handleExitClick}
                >
                  탈퇴
                </button>
              </div>
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="flex items-center space-x-4 justify-center">
            <div className="w-50 h-50 bg-gray-500 rounded-full"></div>
            <div className="pl-10">
              <div className="text-xl font-bold pb-5">스터디명</div>
              <div className="text-sm text-gray-700 pb-5">스터디 소개(과목, 운영 시간)</div>
              <div className="text-sm text-gray-700">해시태그</div>
            </div>
          </div>

          {/* 글작성 */}
          <div className="mb-2 flex justify-end">
            <button
              className="px-1 py-1 bg-black text-white font-semibold cursor-pointer rounded"
              onClick={goToStudyEditPage}
            >
              글작성
            </button>
          </div>

          {/* 게시판 */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 bg-white shadow rounded">
                <div className="w-full h-32 bg-gray-300"></div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="bg-gray-600 w-8 h-8 rounded-full"></div>
                  <div className="mt-2 text-lg font-semibold">제목</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudyPage;
