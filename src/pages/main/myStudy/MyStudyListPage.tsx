import React, { useEffect, useState } from 'react';
import '../../../shared/style/ArticleListPageStyle.css';
import { PagingButton } from '../../../widgets';
import { fetchMyStudyList, MyStudyArticle } from '../../../features';
import { MyStudyListArticleProps } from '../../../entities';
import { Link } from 'react-router-dom';

const MyStudyListPage: React.FC = () => {
    // 전체 게시글을 저장
    const [articles, setArticles] = useState<MyStudyListArticleProps[]>([]);
    // 현재 페이지에 보여질 게시글들
    const [displayedArticles, setDisplayedArticles] = useState<
        MyStudyListArticleProps[]
    >([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [isLoading, setIsLoading] = useState(true);

    // 전체 데이터를 한번만 가져오기
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

    // 전체 게시글 수를 바탕으로 총 페이지 수 계산 (게시글이 없으면 최소 1페이지)
    const totalPages = articles.length
        ? Math.ceil(articles.length / pageSize)
        : 1;

    // 페이지 번호 변경 및 표시할 게시글 업데이트
    const handlePageChange = (newPage: number) => {
        // newPage가 총 페이지 수 범위를 벗어나면 변경하지 않음
        if (newPage < 1 || newPage > totalPages) return;

        setPage(newPage);

        // 현재 페이지에 해당하는 게시글 슬라이싱
        const startIndex = (newPage - 1) * pageSize;
        const slicedData = articles.slice(startIndex, startIndex + pageSize);
        setDisplayedArticles(slicedData);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // 게시글 데이터를 불러온 후 현재 페이지에 맞게 표시 업데이트
    useEffect(() => {
        if (articles.length > 0) {
            handlePageChange(page);
        }
    }, [articles]);

    return (
        <div className="flex flex-col gap-4 w-full pb-4">
            <div className="sticky top-0 flex justify-between items-center w-full bg-white shadow p-4">
                <p className="text-2xl font-bold text-dark-purple">
                    내 스터디 목록
                </p>
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
                                  className={`recruitment-article-card card p-4 bg-white shadow-lg rounded-lg w-80 min-w-80 h-110 ${
                                      article.studyPosition === 'LEADER'
                                          ? 'bg-light-purple'
                                          : 'bg-light-lavender'
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
                    setPage={handlePageChange}
                    page={page}
                    totalCount={articles.length}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default MyStudyListPage;
