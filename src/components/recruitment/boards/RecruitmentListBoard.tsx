import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../shared';
import {
    PagedArticleResponse,
    SimpleRecruitmentResponse,
} from '../../../entities';
import { PagingButton, RecruitmentCard } from '../../../widgets';
import {
    RecruitmentArticleSearch,
    fetchRecruitmentArticles,
} from '../../../features';
import { PageSizeSelect } from '../../../shared';

const pagesPerBlock = 10;

const RecruitmentListBoard = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 초기 URL 파라미터 읽기
    const initialPage = Number(searchParams.get('page')) || 1;
    const initialPageSize = Number(searchParams.get('pageSize')) || 16;
    const initialFilters = {
        title: searchParams.get('title') || '',
        content: searchParams.get('content') || '',
        introduction: searchParams.get('introduction') || '',
        hashTags: searchParams.get('hashTags') || '',
        region: searchParams.get('region') || '',
    };

    // Redux 스토어에서 로그인 상태 가져오기
    const auth = useSelector((state: RootState) => state.auth);
    const isLoggedIn = Boolean(auth.user);

    // 기존 상태들
    const [articlesCache, setArticlesCache] = useState<{
        [key: number]: SimpleRecruitmentResponse[];
    }>({});
    const [displayedArticles, setDisplayedArticles] = useState<
        SimpleRecruitmentResponse[]
    >([]);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [searchFilters, setSearchFilters] = useState(initialFilters);

    // 맞춤 추천 체크박스 상태 (로그인 상태가 아닐 경우 false로 유지)
    const [isCustomRecommended, setIsCustomRecommended] = useState(false);

    // URL 업데이트 함수 (추천 여부 포함)
    const updateUrlParams = (
        newPage: number,
        newPageSize: number,
        filters: { [key: string]: string },
        customRecommended: boolean = isCustomRecommended
    ) => {
        const params: { [key: string]: string } = {
            page: newPage.toString(),
            pageSize: newPageSize.toString(),
            ...filters,
            // 로그인되지 않은 경우 추천 여부는 무조건 false
            customRecommended: (isLoggedIn
                ? customRecommended
                : false
            ).toString(),
        };
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
            const response: PagedArticleResponse =
                await fetchRecruitmentArticles({
                    ...searchFilters,
                    page: currentPage,
                    size: effectivePageSize,
                    // 로그인되지 않은 경우 무조건 false 전달
                    customRecommended: isLoggedIn ? isCustomRecommended : false,
                });
            const blockData: SimpleRecruitmentResponse[] = response.data;
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
        } catch (error) {
            console.error('모집글 조회 에러:', error);
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
        } else {
            fetchBlockArticles(newPage, usedPageSize);
        }
        updateUrlParams(newPage, usedPageSize, searchFilters);
    };

    // 검색 실행 시 호출
    const onSearch = (newFilters: { [key: string]: string }) => {
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
        setPage(1);
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

    // 맞춤 추천 토글 핸들러 (로그인된 경우에만 작동)
    const handleCustomRecommendationToggle = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;
        setIsCustomRecommended(checked);
        // 체크 상태 변경 시 캐시 초기화 및 1페이지부터 다시 조회
        setArticlesCache({});
        setPage(1);
        updateUrlParams(1, pageSize, searchFilters, checked);
        handlePageChange(1);
    };

    // 페이지, 검색 필터 또는 추천 상태가 변경될 때 데이터 로드
    useEffect(() => {
        handlePageChange(page);
    }, [page, searchFilters, isCustomRecommended]);

    return (
        <>
            {/* 상단 고정 헤더 */}
            <div
                className="sticky top-0 w-full shadow-md p-2 col-span-12 rounded-md z-30
                grid grid-cols-12 gap-6 h-fit bg-white border border-gray-200 mt-6"
            >
                <p className="font-bold text-dark-purple col-span-5 flex items-center">
                    모집글 목록
                </p>

                <div className="col-span-3 flex justify-end items-center gap-4">
                    {/* 로그인 된 경우에만 맞춤 추천 체크박스 표시 */}
                    {isLoggedIn && (
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isCustomRecommended}
                                onChange={handleCustomRecommendationToggle}
                                className="form-checkbox h-3 w-3 text-indigo-600 
                                transition duration-150 ease-in-out
                                text-indigo-400 focus:ring-indigo-500
                                "
                            />
                            <span className="text-sm font-medium text-gray-700">
                                맞춤 추천
                            </span>
                        </label>
                    )}
                    <PageSizeSelect
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    />
                </div>
                <div className="col-span-4 flex justify-end items-center gap-4">
                    <RecruitmentArticleSearch onSearch={onSearch} />
                </div>
            </div>

            {/* 게시글 목록 */}
            <div className="col-span-12 gap-4">
                <div className="w-[75rem] grid grid-cols-12 gap-6">
                    {displayedArticles.map((article) => (
                        <RecruitmentCard
                            key={article.id}
                            title={article.title}
                            introduction={article.introduction}
                            hashtagList={
                                article.hashTags
                                    ? article.hashTags.split(',')
                                    : null
                            }
                            clipCount={article.clipCount}
                            writerName={article.writerName}
                            writerProfile={article.writerProfile}
                            thumbnailUrl={article.thumbnailUrl}
                            link={`/${article.id}`}
                        />
                    ))}
                </div>
            </div>

            {/* 페이징 버튼 */}
            <div className="col-span-12 flex justify-center items-center gap-4">
                <PagingButton
                    setPage={handlePageChange}
                    page={page}
                    totalCount={totalCount}
                    pageSize={pageSize}
                />
            </div>
        </>
    );
};

export default RecruitmentListBoard;
