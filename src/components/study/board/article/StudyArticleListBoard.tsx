import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../../shared';
import { useNavigate, useParams } from 'react-router-dom';
import { SubmitButton } from '../../../../shared';

const StudyArticleListBoard: React.FC = () => {
    const {studyId} = useParams();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studies, setStudies] = useState([]);
    const postsPerPage = 16;
    const currentPosts = articles;
    const currentDisplayPosts = currentPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
    const totalPages = Math.ceil(currentPosts.length / postsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const fetchStudies = async () => {
        try {
            const response = await apiClient.get(`/api/v1/user/studies`);

            setStudies(response.data);
        } catch (error) {
            console.error("스터디 목록 가져오기 실패:", error);
        }
    };

    const fetchArticles = async () => {
        try {
            const response = await apiClient.get(`/api/v1/study/${studyId}/articles`);

            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`);
            }

            setArticles(response.data);
        } catch (error) {
            console.error('게시글 목록 가져오기 실패:', error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const goToStudyEditPage = () => {
        navigate(`/study/${studyId}/article/edit`);
    };

    const handleArticleClick = (articleId) => {
        navigate(`/study/${studyId}/article/${articleId}`);
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("검색어:", searchQuery);
        }
    };

    useEffect(() => {
        fetchArticles(studyId);
        fetchStudies();
    }, [studyId]);

    useEffect(() => {
    }, [currentPage, articles]);

    return (
        <>
        <div className="p-4 w-full">
            <div className="mb-4 flex justify-end space-x-2 items-center p-10">
                {/* 검색창 */}
                <div className="flex items-center space-x-2 w-full max-w-xs">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="검색"
                        className="p-1 border rounded-l-md flex-1"
                    />
                </div>

                {/* 글 작성 버튼 */}
                <SubmitButton
                label="글 작성"
                    onClick={goToStudyEditPage}
                />
            </div>
            {/* 게시판 */}
            <div className="grid grid-cols-4 gap-4 px-10">
                        {currentDisplayPosts.map((article) => (
                            <div
                                onClick={() => handleArticleClick(article.id)} key={article.id} className="cursor-pointer p-4 bg-white shadow rounded">
                                <div className="w-full h-32 bg-gray-300"></div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="bg-gray-600 w-8 h-8 rounded-full"></div>
                                    <div className="mt-2 text-xl font-semibold text-black">
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
                    className="px-4 py-2 text-sm bg-whit hover:bg-gray-200 transition-colors border-gray-300 cursor-pointer text-black font-bold border rounded-lg"
                >
                    이전
                </button>

                {/* 페이지 번호 버튼 */}
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`px-4 py-2 text-sm bg-whit hover:bg-gray-200 transition-colors border-gray-300 cursor-pointer text-black font-bold border rounded-lg ${currentPage === page ? 'bg-gray-600 text-white' : 'bg-white text-black cursor-pointer'}`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageClick(currentPage + 1)}
                    className="px-4 py-2 text-sm bg-whit hover:bg-gray-200 transition-colors border-gray-300 cursor-pointer text-black font-bold border rounded-lg"
                >
                    다음
                </button>
            </div>
            </div>
        </>
    );
};

export default StudyArticleListBoard;
