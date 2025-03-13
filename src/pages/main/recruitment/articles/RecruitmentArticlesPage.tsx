import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../shared';
import {
    PagedArticleResponse,
    SimpleRecruitmentResponse,
} from '../../../../entities';
import '../../../../shared/style/ArticleListPageStyle.css';
import { PagingButton, RecruitmentCard } from '../../../../widgets';
import {
    RecruitmentArticleSearch,
    fetchRecruitmentArticles,
} from '../../../../features';
import { PageSizeSelect } from '../../../../shared';

const pagesPerBlock = 10;

const RecruitmentArticlesPage: React.FC = () => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchFilters, isCustomRecommended]);

    const sampleArticles: SimpleRecruitmentResponse[] = [
        {
            id: 1,
            title: '제목1',
            introduction: '소개1',
            thumbnailUrl: 'https://picsum.photos/200/300?random=1',
            writerName: '작성자1',
            writerProfile: 'https://picsum.photos/200/300?random=2',
            clipCount: 1,
            hashTags: '태그1,태그2',
            isRecruiting: true,
        },
        {
            id: 2,
            title: '제목2',
            introduction: '소개2',
            thumbnailUrl: 'https://picsum.photos/200/300?random=3',
            writerName: '작성자2',
            writerProfile: 'https://picsum.photos/200/300?random=4',
            clipCount: 2,
            hashTags: '태그3,태그4',
            isRecruiting: true,
        },
        {
            id: 3,
            title: '제목3',
            introduction: '소개3',
            thumbnailUrl: 'https://picsum.photos/200/300?random=5',
            writerName: '작성자3',
            writerProfile: 'https://picsum.photos/200/300?random=6',
            clipCount: 3,
            hashTags: '태그5,태그6',
            isRecruiting: false,
        },
        {
            id: 4,
            title: '제목4',
            introduction: '소개4',
            thumbnailUrl: 'https://picsum.photos/200/300?random=7',
            writerName: '작성자4',
            writerProfile: 'https://picsum.photos/200/300?random=8',
            clipCount: 4,
            hashTags: '태그7,태그8',
            isRecruiting: true,
        },
        {
            id: 5,
            title: '제목5',
            introduction: '소개5',
            thumbnailUrl: 'https://picsum.photos/200/300?random=9',
            writerName: '작성자5',
            writerProfile: 'https://picsum.photos/200/300?random=10',
            clipCount: 5,
            hashTags: '태그9,태그10',
            isRecruiting: true,
        },
        {
            id: 6,
            title: '제목6',
            introduction: '소개6',
            thumbnailUrl: 'https://picsum.photos/200/300?random=11',
            writerName: '작성자6',
            writerProfile: 'https://picsum.photos/200/300?random=12',
            clipCount: 6,
            hashTags: '태그11,태그12',
            isRecruiting: false,
        },
        {
            id: 7,
            title: '제목7',
            introduction: '소개7',
            thumbnailUrl: null,
            writerName: '작성자7',
            writerProfile: 'https://picsum.photos/200/300?random=14',
            clipCount: 7,
            hashTags: '태그13,태그14',
            isRecruiting: true,
        },
        {
            id: 8,
            title: '제목8',
            introduction: '소개8',
            thumbnailUrl: 'https://picsum.photos/200/300?random=15',
            writerName: '작성자8',
            writerProfile: 'https://picsum.photos/200/300?random=16',
            clipCount: 8,
            hashTags: '태그15,태그16',
            isRecruiting: true,
        },
        {
            id: 9,
            title: '제목9',
            introduction: '소개9',
            thumbnailUrl: 'https://picsum.photos/200/300?random=17',
            writerName: '작성자9',
            writerProfile: 'https://picsum.photos/200/300?random=18',
            clipCount: 9,
            hashTags: '태그17,태그18',
            isRecruiting: false,
        },
        {
            id: 10,
            title: '제목10',
            introduction: '소개10',
            thumbnailUrl: 'https://picsum.photos/200/300?random=19',
            writerName: '작성자10',
            writerProfile: 'https://picsum.photos/200/300?random=20',
            clipCount: 10,
            hashTags: '태그19,태그20',
            isRecruiting: true,
        },
        {
            id: 11,
            title: '제목11',
            introduction: '소개11',
            thumbnailUrl: 'https://picsum.photos/200/300?random=21',
            writerName: '작성자11',
            writerProfile: 'https://picsum.photos/200/300?random=22',
            clipCount: 11,
            hashTags: '태그21,태그22',
            isRecruiting: true,
        },
    ];

    useEffect(() => {
        setTotalCount(sampleArticles.length);
        setDisplayedArticles(sampleArticles.slice(0, pageSize));
    }, [pageSize]);

    return (
        <>
            {/* 상단 고정 헤더 */}
            <div className="sticky top-0 flex justify-between items-center w-full bg-[#FAFBFF] shadow p-2 col-span-12 rounded-b-md z-30">
                <p className="font-bold text-dark-purple">모집글 목록</p>

                <div className="flex gap-4 items-center">
                    {/* 로그인 된 경우에만 맞춤 추천 체크박스 표시 */}
                    {isLoggedIn && (
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isCustomRecommended}
                                    onChange={handleCustomRecommendationToggle}
                                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    맞춤 추천
                                </span>
                            </label>
                        </div>
                    )}
                    <div>
                        <PageSizeSelect
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        />
                    </div>
                    <div>
                        <RecruitmentArticleSearch onSearch={onSearch} />
                    </div>
                </div>
            </div>

            {/* 게시글 목록 */}
            <div className="col-span-12 gap-4">
                <div className="w-[75rem] grid grid-cols-12 gap-6">
                    {sampleArticles.map((article) => (
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
                            link={`/recruitment/${article.id}`}
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

export default RecruitmentArticlesPage;
