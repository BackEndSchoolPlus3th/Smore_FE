import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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

const pagesPerBlock = 10;

const RecruitmentArticlesPage: React.FC = () => {
    // useSearchParams 훅을 이용해 URL의 쿼리 파라미터 읽기
    const [searchParams, setSearchParams] = useSearchParams();

    // URL 파라미터에서 초기 상태 읽기 (숫자는 변환 필요)
    const initialPage = Number(searchParams.get('page')) || 1;
    const initialPageSize = Number(searchParams.get('pageSize')) || 16;
    const initialFilters = {
        title: searchParams.get('title') || '',
        content: searchParams.get('content') || '',
        introduction: searchParams.get('introduction') || '',
        hashTags: searchParams.get('hashTags') || '',
        region: searchParams.get('region') || '',
    };

    // 캐시 및 화면에 표시할 게시글 관련 상태
    const [articlesCache, setArticlesCache] = useState<{
        [key: number]: RecruitmentArticleProps[];
    }>({});
    const [displayedArticles, setDisplayedArticles] = useState<
        RecruitmentArticleProps[]
    >([]);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [searchFilters, setSearchFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(true);

    // URL 업데이트 함수: 페이지, 페이지 사이즈, 검색 필터를 반영
    const updateUrlParams = (
        newPage: number,
        newPageSize: number,
        filters: { [key: string]: string }
    ) => {
        const params: { [key: string]: string } = {
            page: newPage.toString(),
            pageSize: newPageSize.toString(),
            ...filters,
        };
        // 빈 문자열인 값은 URL에서 제거
        Object.keys(params).forEach((key) => {
            if (!params[key]) {
                delete params[key];
            }
        });
        setSearchParams(params);
    };

    // API 호출 (한 블록 단위)
    const fetchBlockArticles = async (
        currentPage: number,
        effectivePageSize: number = pageSize
    ) => {
        const block = Math.floor((currentPage - 1) / pagesPerBlock);
        try {
            const response: pagedResponse = await fetchRecruitmentArticles({
                ...searchFilters,
                page: currentPage,
                size: effectivePageSize,
            });
            const blockData: RecruitmentArticleProps[] = response.data;
            setArticlesCache((prevCache) => ({
                ...prevCache,
                [block]: blockData,
            }));
            setTotalCount(response.totalCount);
            const startIndex =
                ((currentPage - 1) % pagesPerBlock) * effectivePageSize;
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

    // 페이지 변경 핸들러
    const handlePageChange = (newPage: number, effectivePageSize?: number) => {
        const usedPageSize = effectivePageSize ?? pageSize;
        setPage(newPage);
        const currentBlock = Math.floor((newPage - 1) / pagesPerBlock);
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
            setIsLoading(true);
            fetchBlockArticles(newPage, usedPageSize);
        }
        updateUrlParams(newPage, usedPageSize, searchFilters);
    };

    // 검색 실행 시 호출 (검색 버튼 또는 엔터키)
    const onSearch = (newFilters: { [key: string]: string }) => {
        // 캐시 초기화 및 검색 필터 갱신
        setArticlesCache({});
        const updatedFilters = {
            title: '',
            content: '',
            introduction: '',
            hashTags: '',
            region: '',
            ...newFilters,
        };
        setSearchFilters(updatedFilters);
        setPage(1); // 검색 시 1페이지로 초기화
        updateUrlParams(1, pageSize, updatedFilters);
        handlePageChange(1);
    };

    // 페이지 사이즈 변경 핸들러
    const handlePageSizeChange = (newPageSize: number) => {
        setArticlesCache({});
        setPageSize(newPageSize);
        setPage(1);
        updateUrlParams(1, newPageSize, searchFilters);
        handlePageChange(1, newPageSize);
    };

    // 페이지나 검색 필터가 변경될 때 데이터를 로드
    useEffect(() => {
        handlePageChange(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchFilters]);

    return (
        <div className="flex flex-col gap-4 w-full pb-4">
            <div className="sticky top-0 flex justify-between items-center w-full bg-white shadow p-4">
                <p className="text-2xl font-bold text-dark-purple">
                    스터디 모집 게시판
                </p>
                <div className="flex gap-4 items-center">
                    <PageSizeSelect
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    />
                    <RecruitmentArticleSearch onSearch={onSearch} />
                </div>
            </div>
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
            <div className="flex justify-center items-center w-full">
                <PagingButton
                    setPage={handlePageChange}
                    page={page}
                    totalCount={totalCount}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default RecruitmentArticlesPage;
