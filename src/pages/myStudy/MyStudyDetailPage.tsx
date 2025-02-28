import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MyStudyDetailPage = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();

  const [articleData, setArticleData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // 게시글의 상세 데이터를 받아오는 부분
    const fetchedArticleData = {
      title: "React 공부하기",
      content: "이 게시글은 리액트 학습을 위한 게시글입니다. 다양한 내용이 포함되어 있습니다.",
      author: "홍길동",
      createdAt: "2025-02-24",
      files: [
      ],
    };
    
    setArticleData(fetchedArticleData);
  }, [articleId]);

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

  const handleDeleteArticle = () => {
    const userConfirmed = window.confirm("이 게시글을 삭제하시겠습니까?");
    if (userConfirmed) {
      alert("게시글이 삭제되었습니다.");
      navigate("/StudyArticle");
    }
  };

  const handleEditArticle = () => {
    navigate(`/StudyEdit/${articleId}`);
  };

  if (!articleData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
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
            </div>
          </div>

          {/* 게시글 상세 정보 */}
          <div className="p-4 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">{articleData.title}</h1>
            <div className="text-sm text-gray-600 mb-2">
              <span>작성자: {articleData.author}</span> | 
              <span> 작성일: {articleData.createdAt}</span>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">내용</h3>
              <p>{articleData.content}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">첨부 파일</h3>
              {articleData.files.length > 0 ? (
                <div>
                  {articleData.files.map((file, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>첨부된 파일이 없습니다.</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleEditArticle}
                className="px-4 py-1 bg-black text-white rounded cursor-pointer"
              >
                수정
              </button>
              <button
                onClick={handleDeleteArticle}
                className="px-4 py-1 bg-black text-white rounded cursor-pointer"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudyDetailPage;
