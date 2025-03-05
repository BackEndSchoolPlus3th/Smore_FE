import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudyPage = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [articles, setArticles] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

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
const goToStudyEditPage = () => {
    navigate("/studyedit");
};
const goToStudyArticleDetailPage = () => {
  navigate("/studydetail");
}

  const handleExitClick = () => {
    const userConfirmed = window.confirm("탈퇴하시겠습니까?");
    if (userConfirmed) {
      alert("탈퇴가 완료되었습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    fetch("/api/study/my-studies")
      .then((response) => response.json())
      .then((data) => setStudies(data))
      .catch((error) => console.error("스터디 목록 가져오기 실패:", error));
  }, []);

  useEffect(() => {
    if (selectedStudy) {
      fetch(`/api/study/${selectedStudy.id}/articles`)
        .then((response) => response.json())
        .then((data) => setArticles(data))
        .catch((error) => console.error("게시글 가져오기 실패:", error));
    }
  }, [selectedStudy]);

  const handleStudySelect = (study) => {
    setSelectedStudy(study);
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-1">
        {/* 사이드바 */}
        <Sidebar
          studies={studies}
          onStudySelect={handleStudySelect}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* 버튼을 클릭하여 사이드바를 열고 닫을 수 있도록 */}
        <div className="bg-muted-purple">
          <button
            onClick={toggleSidebar}
            className="px-4 py-2 bg-dark-purple text-white mb-4"
          >
            {isSidebarOpen ? '=' : '='}
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 pt-0 p-6 bg-purple-100">
          <div>
            {/* 네브 바 */}
            <Navbar />
          </div>

          {/* 선택된 스터디 정보 */}
          {selectedStudy && (
            <div className="flex items-center space-x-4 justify-center">
              <div className="w-50 h-50 bg-gray-500 rounded-full"></div>
              <div className="pl-10">
                <div className="text-xl font-bold pb-5">{selectedStudy.title}</div>
                <div className="text-sm text-gray-700 pb-5">{selectedStudy.introduction}</div>
                <div className="text-sm text-gray-700">{selectedStudy.hashTags}</div>
              </div>
            </div>
          )}

          {/* 글작성 */}
          <div className="mb-2 flex justify-end">
            <button
              className="px-1 py-1 bg-dark-purple text-white font-semibold cursor-pointer rounded"
              onClick={goToStudyEditPage}
            >
              글작성
            </button>
          </div>

          {/* 게시글 최신순으로 보여주기 */}
          <div className="grid grid-cols-4 gap-4">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div key={article.id} className="p-4 bg-white shadow rounded">
                  <div className="w-full h-32 bg-gray-300"></div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="bg-gray-600 w-8 h-8 rounded-full"></div>
                    <div className="mt-2 text-lg font-semibold">{article.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">게시글이 없습니다.</div>
            )}
          </div>
          
          <div className="flex justify-end">
                <button
                  className="px-1 py-1 bg-dark-purple text-white font-semibold cursor-pointer rounded mt-2"
                  onClick={handleExitClick}
                >
                  탈퇴
                </button>
              </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudyPage;
