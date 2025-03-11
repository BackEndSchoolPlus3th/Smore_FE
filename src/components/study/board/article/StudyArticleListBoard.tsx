import { useState, useEffect } from 'react';
import { apiClient } from '../../../../shared';
import { useNavigate, useParams } from 'react-router-dom';

interface Article {
    id: number;
    title: string;
}

const StudyArticleListBoard: React.FC = () => {
    const studyId = useParams().studyId;
    const navigate = useNavigate();
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState<Article[]>([]);
    const [currentDisplayPosts, setCurrentDisplayPosts] = useState<Article[]>(
        []
    );
    const totalPages = Math.ceil(currentPosts.length / 4);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const fetchArticles = async () => {
        try {
            const response = await apiClient.get('/articles');

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

    const handleArticleClick = (articleId: number) => () => {
        navigate(`/study/${studyId}/article/${articleId}`);
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        setCurrentPosts(articles);
    }, [currentPage, articles]);

    return (
        <>
            <div className="mb-4 flex justify-end space-x-2 items-center">
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
                <button
                    className="p-1 bg-dark-purple text-white font-semibold rounded cursor-pointer"
                    onClick={goToStudyEditPage}
                >
                    글작성
                </button>
            </div>
            {/* 게시판 */}
            <div className="grid grid-cols-4 gap-4">
                {currentDisplayPosts.map((article) => (
                    <div
                        onClick={() => handleArticleClick(article.id)}
                        key={article.id}
                        className="cursor-pointer p-4 bg-white shadow rounded"
                    >
                        <div className="w-full h-32 bg-dark-purple"></div>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="bg-dark-purple w-8 h-8 rounded-full"></div>
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
        </>
    );
};

export default StudyArticleListBoard;
