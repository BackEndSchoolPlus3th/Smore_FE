import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../widgets/sidebar/Sidebar";
import Navbar from "../../widgets/navbarArticle/Navbar";

const MyStudySelectPage = () => {
    const navigate = useNavigate();
    const { studyId } = useParams();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [studies, setStudies] = useState([]);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [articles, setArticles] = useState([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    const goToStudyEditPage = () => {
        if (selectedStudy) {
            navigate(`/study/${studyId}/edit`);
        } else {
            alert("스터디를 선택해주세요.");
        }
    };

    const handleExitClick = () => {
        const userConfirmed = window.confirm("탈퇴하시겠습니까?");
        if (userConfirmed) {
            alert("탈퇴가 완료되었습니다.");
            navigate("/");
        }
    };

    const token = localStorage.getItem("accessToken");

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
            setStudies(data);
        } catch (error) {
            console.error("스터디 목록 가져오기 실패:", error);
        }
    };

    const fetchStudyDetails = async (studyId) => {
        if (!studyId) {
            console.error("studyId가 undefined입니다.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8090/api/v1/study/${studyId}`, {
                method: "GET",
                headers: {
                    "Authorization": `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("스터디 상세 정보 가져오기 실패");
            }

            const data = await response.json();
            setSelectedStudy(data);

        } catch (error) {
            console.error("스터디 상세 정보 가져오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchStudies();
    }, []);

    useEffect(() => {
        if (studyId) {
            fetchStudyDetails(studyId);
        }
    }, [studyId]);

    useEffect(() => {
        if (selectedStudy) {
            fetch(`http://localhost:8090/api/v1/study/${selectedStudy.id}/articles`, {
                method: "GET",
                headers: {
                    "Authorization": `${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => setArticles(data))
                .catch((error) => console.error("게시글 가져오기 실패:", error));
        }
    }, [selectedStudy]);

    const handleStudySelect = (study) => {
        if (study && study.id) {
            console.log("선택된 스터디 ID:", study.id);  // 선택된 study.id 확인
            setSelectedStudy(study);
            navigate(`/study/${study.id}`);
        } else {
            console.error("선택된 스터디에 id가 없습니다.");
        }
    };

    const handleArticleClick = (articleId) => {
        navigate(`/study/${studyId}/articles/${articleId}`);
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
                            {/* <div className="w-50 h-50 bg-gray-500 rounded-full">{selectedStudy.imageUrls}</div> */}
                            <div className="pl-10">
                                <div className="text-xl font-bold pb-5">{selectedStudy.title}</div>
                                <div className="text-sm text-gray-700 pb-5">{selectedStudy.introduction}</div>
                                <div className="text-sm text-gray-700">{selectedStudy.hashTags && selectedStudy.hashTags.join(", ")}</div>
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
                        {articles.slice(0, 8).length > 0 ? (
                            articles.slice(0, 8).map((article, index) => (
                                <div key={article.id} onClick={() => handleArticleClick(article.id)} className="cursor-pointer p-4 bg-white shadow rounded">
                                    <div
                                        className="w-full h-32 bg-gray-300"></div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <div className="bg-gray-600 w-8 h-8 rounded-full"></div>
                                        <button
                                            className="text-black text-xl mt-1"
                                        >
                                            {article.title}
                                        </button>
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

export default MyStudySelectPage;
