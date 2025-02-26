import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyStudyArticlePage = () => {
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("study");

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("검색어:", searchQuery);
        }
    };

    const studyPosts = Array.from({ length: 500 }, (_, index) => ({
        id: index + 1,
        title: `스터디 게시글 ${index + 1}`,
        content: `내용 ${index + 1}`,
        type: "study", // 스터디글
    }));

    const recruitmentPosts = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `모집 게시글 ${index + 1}`,
        content: `내용 ${index + 1}`,
        type: "recruitment", // 모집글
    }));

    const currentPosts = selectedTab === "study" ? studyPosts : recruitmentPosts;

    const postsPerPage = 16;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(currentPosts.length / postsPerPage);
    const currentDisplayPosts = currentPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const pageNumbers = [];
    const maxPagesToShow = 10;
    const startPage = Math.max(1, currentPage - 5);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

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
                        className="px-4 py-2 bg-gray-500 text-white mb-4 cursor-pointer"
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

                    <div className="mb-4 flex justify-end space-x-2 items-center">
                        {/* 검색창 */}
                        <div className="flex items-center space-x-2 w-full max-w-xs">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                placeholder="검색"
                                className="p-1 border rounded-l-md flex-1"
                            />
                        </div>

                        {/* 글 작성 버튼 */}
                        <button
                            className="p-1 bg-black text-white font-semibold rounded cursor-pointer"
                            onClick={goToStudyEditPage}
                        >
                            글작성
                        </button>
                    </div>

                    <div className="mb-4 flex space-x-4">
                        <button
                            onClick={() => setSelectedTab("study")}
                            className={`px-4 py-2 rounded ${selectedTab === "study" ? "bg-gray-600 text-white" : "bg-white text-black cursor-pointer"}`}
                        >
                            스터디글
                        </button>
                        <button
                            onClick={() => setSelectedTab("recruitment")}
                            className={`px-4 py-2 rounded ${selectedTab === "recruitment" ? "bg-gray-600 text-white" : "bg-white text-black cursor-pointer"}`}
                        >
                            모집글
                        </button>
                    </div>

                    {/* 게시판 */}
                    <div className="grid grid-cols-4 gap-4">
                        {currentDisplayPosts.map((post) => (
                            <div key={post.id} className="p-4 bg-white shadow rounded">
                                <div className="w-full h-32 bg-gray-300"></div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="bg-gray-600 w-8 h-8 rounded-full"></div>
                                    <div className="mt-2 text-lg font-semibold">{post.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 페이징 버튼 */}
                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageClick(currentPage - 1)}
                            className="px-4 py-2 bg-black text-white font-semibold rounded cursor-pointer"
                        >
                            이전
                        </button>

                        {/* 페이지 번호 버튼 */}
                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`px-4 py-2 font-semibold rounded ${currentPage === page ? 'bg-gray-600 text-white' : 'bg-white text-black cursor-pointer'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageClick(currentPage + 1)}
                            className="px-4 py-2 bg-black text-white font-semibold rounded cursor-pointer"
                        >
                            다음
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MyStudyArticlePage;
