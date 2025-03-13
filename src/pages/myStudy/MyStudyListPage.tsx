import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PagingButton } from '../../widgets';
import { fetchMyStudyList, MyStudyArticle } from '../../features';
import { MyStudyListArticleProps } from '../../entities';
import { PageSizeSelect } from '../../shared';

const MyStudyListPage: React.FC = () => {
    const [articles, setArticles] = useState<MyStudyListArticleProps[]>([]);
    const [displayedArticles, setDisplayedArticles] = useState<
        MyStudyListArticleProps[]
    >([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(16);
    const [isLoading, setIsLoading] = useState(true);

    // 전체 데이터를 한 번만 가져오기
    const fetchArticles = async () => {
        try {
            const data: MyStudyListArticleProps[] = await fetchMyStudyList();
            setArticles(data);
            setIsLoading(false);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
            setIsLoading(false);
        }
    };

    // pageSize를 인자로 받아 올바른 페이지의 데이터를 계산하도록 수정
    const handlePageChange = (
        newPage: number,
        effectivePageSize: number = pageSize
    ) => {
        const totalPages = articles.length
            ? Math.ceil(articles.length / effectivePageSize)
            : 1;
        if (newPage < 1 || newPage > totalPages) return;

        setPage(newPage);
        const startIndex = (newPage - 1) * effectivePageSize;
        const slicedData = articles.slice(
            startIndex,
            startIndex + effectivePageSize
        );
        setDisplayedArticles(slicedData);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // 최초 articles 데이터가 로드되면 현재 페이지를 계산
    useEffect(() => {
        if (articles.length > 0) {
            handlePageChange(page);
        }
    }, [articles]);

    return (
        <div className="flex flex-col gap-4 w-full pb-4">
            <div className="sticky top-0 flex justify-between items-center w-full bg-[#FAFBFF] shadow p-2">
                <p className="font-bold text-dark-purple">내 스터디 목록</p>
                {/* 페이지 사이즈 설정 드롭다운 */}
                <PageSizeSelect
                    value={pageSize}
                    onChange={(newPageSize) => {
                        setPageSize(newPageSize);
                        // 새로운 pageSize로 1페이지 데이터를 계산
                        handlePageChange(1, newPageSize);
                    }}
                />
            </div>
            {/* 게시글 목록 */}
            <div className="items-center w-full">
                <div className="flex flex-wrap gap-4 w-full justify-center">
                    {isLoading
                        ? Array.from({ length: pageSize }).map((_, index) => (
                              <div
                                  className="recruitment-article-card card bg-light-lavender p-4 bg-white shadow-lg rounded-lg w-80 min-w-80 h-96"
                                  key={index}
                              >
                                  <div className="animate-pulse bg-light-lavender h-full w-full rounded"></div>
                              </div>
                          ))
                        : displayedArticles.map((article) => (
                              <Link
                                  to={`/study/${article.id}`}
                                  className={`recruitment-article-card card p-4 bg-white shadow-lg rounded-lg w-80 min-w-80 h-110 bg-light-lavender
                                    ${
                                        article.studyPosition === 'LEADER'
                                            ? 'border-2 border-yellow-400'
                                            : ''
                                    }`}
                                  key={article.id}
                              >
                                  <MyStudyArticle {...article} />
                              </Link>
                          ))}
                </div>
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center w-full">
                <PagingButton
                    setPage={(newPage) => handlePageChange(newPage)}
                    page={page}
                    totalCount={articles.length}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default MyStudyListPage;
