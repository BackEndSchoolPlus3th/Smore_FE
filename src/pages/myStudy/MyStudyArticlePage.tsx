import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudyArticlePage = () => {
    const token = localStorage.getItem("accessToken");
    const { studyId } = useParams();

    const fetchStudies = async () => {
        try {
            const response = await fetch("http://localhost:8090/api/v1/user/studies", {
                method: "GET",
                headers: {
                    "Authorization": `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("서버에서 반환된 데이터:", data); // 데이터 확인
            setStudies(data);
        } catch (error) {
            console.error("스터디 목록 가져오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchStudies();
    }, []);

    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [studies, setStudies] = useState([]);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [selectedTab, setSelectedTab] = useState("study");
    const [articles, setArticles] = useState([]); // 게시글 상태 추가
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const postsPerPage = 16;

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    const fetchArticles = async (studyId) => {
        if (!studyId) return;

        try {
            const response = await fetch(
                `http://localhost:8090/api/v1/study/${studyId}/articles`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setArticles(data); // 받은 게시글 데이터를 상태에 저장
        } catch (error) {
            console.error("게시글 가져오기 실패:", error);
        }
    };

    const handleArticleClick = (articleId) => {
        navigate(`/study/${studyId}/articles/${articleId}`);
    };

    const goToStudyEditPage = () => {
        if (studyId) {
            navigate(`/study/${studyId}/edit`);
        } else {
            alert("스터디를 선택해주세요.");
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("검색어:", searchQuery);
        }
    };

    const currentPosts = selectedTab === "study" ? articles : [];

    const totalPages = Math.ceil(currentPosts.length / postsPerPage);
    const currentDisplayPosts = currentPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleStudySelect = (study) => {
        setSelectedStudy(study);
    };

    useEffect(() => {
        fetchStudies();
    }, []);

    useEffect(() => {
        if (studyId) {
            fetchArticles(studyId);
        }
    }, [studyId]);

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
                            className="p-1 bg-dark-purple text-white font-semibold rounded cursor-pointer"
                            onClick={goToStudyEditPage}
                        >
                            글작성
                        </button>
                    </div>

                    <div className="mb-4 flex space-x-4">
                        <button
                            onClick={() => setSelectedTab("study")}
                            className={`px-4 py-2 rounded ${selectedTab === "study" ? "bg-dark-purple text-white" : "bg-white text-black cursor-pointer"}`}
                        >
                            스터디글
                        </button>
                        <button
                            onClick={() => setSelectedTab("recruitment")}
                            className={`px-4 py-2 rounded ${selectedTab === "recruitment" ? "bg-dark-purple text-white" : "bg-white text-black cursor-pointer"}`}
                        >
                            모집글
                        </button>
                    </div>

                    {/* 게시판 */}
                    <div className="grid grid-cols-4 gap-4">
                        {currentDisplayPosts.map((article) => (
                            <div
                                onClick={() => handleArticleClick(article.id)} key={article.id} className="cursor-pointer p-4 bg-white shadow rounded">
                                <div className="w-full h-32 bg-dark-purple"></div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="bg-dark-purple w-8 h-8 rounded-full"></div>
                                    <div

                                        className="mt-2 text-xl font-semibold text-black"
                                    >
                                        {article.title}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 페이징 버튼 */}
                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageClick(currentPage - 1)}
                            className="px-4 py-2 bg-dark-purple text-white font-semibold rounded cursor-pointer"
                        >
                            이전
                        </button>

                        {/* 페이지 번호 버튼 */}
                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`px-4 py-2 font-semibold rounded ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-white text-black cursor-pointer'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageClick(currentPage + 1)}
                            className="px-4 py-2 bg-dark-purple text-white font-semibold rounded cursor-pointer"
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
