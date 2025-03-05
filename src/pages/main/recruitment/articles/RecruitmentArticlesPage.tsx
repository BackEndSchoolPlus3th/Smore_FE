import React, { useEffect, useState } from 'react';
import {
    RecruitmentArticle,
    RecruitmentArticleProps,
} from '../../../../entities';
import './RecruitmentArticlesPageStyle.css';
import { PagingButton } from '../../../../widgets';
import {
    RecruitmentArticleSearch,
    fetchRecruitmentArticles,
} from '../../../../features';

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
    const [endPage, setEndPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);

    // 검색 관련 상태: 각 검색 필드는 기본값을 빈 문자열로 초기화 (필요시 기본 해시태그 값 설정 가능)
    const [searchParams, setSearchParams] = useState({
        title: '',
        content: '',
        introduction: '',
        hashTags: '',
        region: '',
    });
    const [isEndPage, setIsEndPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // API 호출 함수 (한 블록 단위)
    const fetchBlockArticles = async (page: number) => {
        const block = Math.floor((page - 1) / pagesPerBlock);
        try {
            const blockData: RecruitmentArticleProps[] =
                await fetchRecruitmentArticles({
                    ...searchParams,
                    page: page,
                    size: pageSize,
                });
            // 캐시에 저장
            setArticlesCache((prevCache) => ({
                ...prevCache,
                [block]: blockData,
            }));
            // 현재 페이지에 해당하는 데이터 슬라이싱
            const startIndex = ((page - 1) % pagesPerBlock) * pageSize;
            const slicedData = blockData.slice(
                startIndex,
                startIndex + pageSize
            );
            setDisplayedArticles(slicedData);
            setIsLoading(false);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
            setIsLoading(false);
        }
    };

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (page: number) => {
        const newEndPage =
            page - 1 - ((page - 1) % pagesPerBlock) + pagesPerBlock;
        const newCurrentBlock = Math.floor((page - 1) / pagesPerBlock);

        setPage(page);
        setEndPage(newEndPage);

        // 캐시에 데이터가 있으면 슬라이싱만 진행
        if (articlesCache[newCurrentBlock]) {
            const blockData = articlesCache[newCurrentBlock];
            const startIndex = ((page - 1) % pagesPerBlock) * pageSize;
            const slicedData = blockData.slice(
                startIndex,
                startIndex + pageSize
            );
            setDisplayedArticles(slicedData);
            setIsLoading(false);
        } else {
            // 없으면 API 호출
            setIsLoading(true);
            fetchBlockArticles(page);
        }
    };

    // 검색 실행 시 호출 (RecruitmentArticleSearch에서 전달)
    const onSearch = (newParam: { [key: string]: string }) => {
        // 새로운 검색 파라미터가 전달되면 다른 필드는 초기화하고 해당 필드만 갱신
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
                {/* 검색 필드 */}
                <RecruitmentArticleSearch onSearch={onSearch} />
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
                              <div
                                  className="recruitment-article-card card bg-light-lavender p-4 bg-white shadow-lg rounded-lg w-80 min-w-80 h-110"
                                  key={article.id}
                              >
                                  <RecruitmentArticle {...article} />
                              </div>
                          ))}
                </div>
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center w-full">
                <PagingButton
                    setPage={setPage}
                    page={page}
                    endPage={endPage}
                    isEndPage={isEndPage}
                />
            </div>
        </div>
    );
};

export default RecruitmentArticlesPage;
