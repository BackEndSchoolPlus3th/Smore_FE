import React, { useState, useEffect } from 'react';
import { apiClient, SubmitButton } from '../../../../shared';
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleCard, PagingButton } from '../../../../widgets';
import { ArticleCardResponse } from '../../../../entities';

const StudyArticleListBoard: React.FC = () => {
    const { studyId } = useParams();
    const navigate = useNavigate();
    const [articles, setArticles] = useState<ArticleCardResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 16;
    const currentPosts = articles;
    const currentDisplayPosts = currentPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );
    const totalPages = Math.ceil(currentPosts.length / postsPerPage);

    const fetchArticles = async () => {
        try {
            const response = await apiClient.get(
                `/api/v1/study/${studyId}/articles`
            );

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

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [studyId]);

    useEffect(() => {}, [currentPage, articles]);

    return (
        <>
            {/* 검색창 */}
            <div className="flex items-center col-start-10 col-span-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="검색"
                    className="p-1 border rounded-md"
                />
            </div>

            {/* 글 작성 버튼 */}
            <SubmitButton
                label="작성"
                onClick={goToStudyEditPage}
                className="col-span-1"
            />

            {/* 게시판 */}
            {currentDisplayPosts.map((article) => (
                <ArticleCard
                    key={article.id}
                    title={article.title}
                    content={article.content}
                    imageUrl={
                        article.imageUrls
                            ? article.imageUrls.split(',')[0]
                            : null
                    }
                    hashtagList={
                        article.hashTags ? article.hashTags.split(',') : null
                    }
                    link={`/study/${studyId}/article/${article.id}`}
                />
            ))}
            <div className="flex justify-center col-span-12">
                <PagingButton
                    setPage={(newPage) => handlePageClick(newPage)}
                    page={currentPage}
                    totalCount={articles.length}
                    pageSize={postsPerPage}
                />
            </div>
        </>
    );
};

export default StudyArticleListBoard;
