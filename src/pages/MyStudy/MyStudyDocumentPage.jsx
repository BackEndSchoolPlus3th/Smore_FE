import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../widgets/header/Header";

const MyStudyDocumentPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const studyDocuments = [
      {
        postId: 1,
        title: "스터디A 게시글",
        files: [
          { name: "정보처리기사 실기 요악노트 (1. 소프트웨어 공학).pdf" },
          { name: "Study Guide.pdf" }
        ]
      },
      {
        postId: 2,
        title: "스터디B 게시글",
        files: [
          { name: "React_Tutorial.pdf" },
          { name: "JS_Exercises.pdf" }
        ]
      },
      {
        postId: 3,
        title: "스터디C 게시글",
        files: [
          { name: "NodeJS_Introduction.pdf" }
        ]
      }
    ];

    // 모든 게시글에서 파일을 추출하여 파일 목록을 생성합니다.
    const allFiles = studyDocuments.flatMap((doc) => doc.files);
    setFiles(allFiles);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const goToStudyMainPage = () => {
    navigate("/MyStudy");
};
const goToSchedulePage = () => {
    navigate("/MyStudySchedule");
};
const goToDocumentPage = () => {
    navigate("/MyStudyDocument");
};
const goToStudyArticlePage = () => {
    navigate("/MyStudyArticle");
};
const goToSettingPage = () => {
    navigate("/MyStudySetting");
};
const goToEditPage = () => {
    navigate("/MyStudyEdit");
};

  const handleDownload = (fileName) => {
    alert(`${fileName}을 다운로드합니다.`);
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

        {/* 사이드바 열고 닫기 버튼 */}
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
            </div>
          </div>

          {/* 문서함 */}
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">문서함</h2>

            {files.length === 0 ? (
              <p>현재 첨부된 파일이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center">
                    <div className="w-full h-32 bg-gray-300 mb-4"></div>
                    <div className="text-lg font-semibold mb-2">{file.name}</div>
                    <button
                      onClick={() => handleDownload(file.name)}
                      className="px-4 py-2 bg-black text-white rounded cursor-pointer"
                    >
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default MyStudyDocumentPage;
