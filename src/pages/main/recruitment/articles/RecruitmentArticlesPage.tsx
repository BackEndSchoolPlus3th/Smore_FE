import React, { useEffect, useState } from 'react';
import {
    RecruitmentArticle,
    RecruitmentArticleProps,
    pagedResponse,
} from '../../../../entities';
import '../../../../shared/style/ArticleListPageStyle.css';
import { PagingButton } from '../../../../widgets';
import {
    RecruitmentArticleSearch,
    fetchRecruitmentArticles,
} from '../../../../features';
import { PageSizeSelect } from '../../../../shared';
import { Link } from 'react-router-dom';

const pagesPerBlock = 10;

const RecruitmentArticlesPage: React.FC = () => {
    // 캐시: 블록 번호 => 게시글 배열
    const [articlesCache, setArticlesCache] = useState<{
        [key: number]: RecruitmentArticleProps[];
    }>({});
    // 현재 화면에 보여질 게시글들
    const [displayedArticles, setDisplayedArticles] = useState<
        RecruitmentArticleProps[]
    >([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(16);
    const [totalCount, setTotalCount] = useState<number>(0);

    // 검색 관련 상태: 각 검색 필드를 기본값 빈 문자열로 초기화
    const [searchParams, setSearchParams] = useState({
        title: '',
        content: '',
        introduction: '',
        hashTags: '',
        region: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    // API 호출 함수 (한 블록 단위)
    const fetchBlockArticles = async (
        page: number,
        effectivePageSize: number = pageSize
    ) => {
        const block = Math.floor((page - 1) / pagesPerBlock);
        try {
            const response: pagedResponse = await fetchRecruitmentArticles({
                ...searchParams,
                page: page,
                size: effectivePageSize,
            });
            const blockData: RecruitmentArticleProps[] = response.data;
            // 캐시에 저장
            setArticlesCache((prevCache) => ({
                ...prevCache,
                [block]: blockData,
            }));
            // 전체 게시글 개수 저장
            setTotalCount(response.totalCount);
            // 현재 페이지에 해당하는 데이터 슬라이싱
            const startIndex = ((page - 1) % pagesPerBlock) * effectivePageSize;
            const slicedData = blockData.slice(
                startIndex,
                startIndex + effectivePageSize
            );
            setDisplayedArticles(slicedData);
            setIsLoading(false);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
            setIsLoading(false);
        }
    };

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (newPage: number, effectivePageSize?: number) => {
        const usedPageSize = effectivePageSize ?? pageSize;
        const currentBlock = Math.floor((newPage - 1) / pagesPerBlock);
        setPage(newPage);

        // 캐시에 데이터가 있으면 슬라이싱만 진행
        if (articlesCache[currentBlock]) {
            const blockData = articlesCache[currentBlock];
            const startIndex = ((newPage - 1) % pagesPerBlock) * usedPageSize;
            const slicedData = blockData.slice(
                startIndex,
                startIndex + usedPageSize
            );
            setDisplayedArticles(slicedData);
            setIsLoading(false);
        } else {
            // 없으면 API 호출
            setIsLoading(true);
            fetchBlockArticles(newPage, usedPageSize);
        }
    };

    // 검색 실행 시 호출 (RecruitmentArticleSearch에서 전달)
    const onSearch = (newParam: { [key: string]: string }) => {
        // 새로운 검색 파라미터가 전달되면 캐시 초기화 및 파라미터 갱신
        setArticlesCache({});
        setSearchParams({
            title: '',
            content: '',
            introduction: '',
            hashTags: '',
            region: '',
            ...newParam,
        });
        setPage(1);
        handlePageChange(1);
    };

    useEffect(() => {
        // 검색 파라미터나 페이지가 변경되면 데이터 로드
        handlePageChange(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchParams]);

    return (
        <div className="flex flex-col gap-4 w-full pb-4">
            <div className="sticky top-0 flex justify-between items-center w-full bg-white shadow p-4">
                <p className="text-2xl font-bold text-dark-purple">
                    스터디 모집 게시판
                </p>
                <div className="flex gap-4 items-center">
                    {/* 페이지 사이즈 설정 드롭다운 */}
                    <PageSizeSelect
                        value={pageSize}
                        onChange={(newPageSize) => {
                            // 페이지 사이즈 변경 시 캐시 초기화 후 1페이지 데이터를 새 사이즈로 로드
                            setArticlesCache({});
                            setPageSize(newPageSize);
                            handlePageChange(1, newPageSize);
                        }}
                    />
                    {/* 검색 필드 */}
                    <RecruitmentArticleSearch onSearch={onSearch} />
                </div>
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
                                  to={`/recruitment/${article.id}`}
                                  className="recruitment-article-card card bg-light-lavender p-4 bg-white shadow-lg rounded-lg w-80 min-w-80 h-110"
                                  key={article.id}
                              >
                                  <RecruitmentArticle {...article} />
                              </Link>
                          ))}
                </div>
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center w-full">
                <PagingButton
                    setPage={(newPage) => handlePageChange(newPage)}
                    page={page}
                    totalCount={totalCount}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default RecruitmentArticlesPage;
