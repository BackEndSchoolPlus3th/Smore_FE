import React, { useEffect, useState } from 'react';
import {
    RecruitmentArticle,
    RecruitmentArticleProps,
} from '../../../../entities';
import './RecruitmentArticlesPageStyle.css';
import { apiClient, ApiResponse } from '../../../../shared';
import { PagingButton } from '../../../../widgets';
interface FetchRecruitmentArticlesParams {
    hashTags?: string;
    page: number;
    size?: number;
}

const pagesPerBlock: number = 10;

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
    const [currentBlock, setCurrentBlock] = useState(
        Math.floor((page - 1) / pagesPerBlock)
    );

    const [recruitmentArticles, setRecruitmentArticles] = useState<
        RecruitmentArticleProps[]
    >([]);
    const [hashTags, setHashTags] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isEndPage, setIsEndPage] = useState(false);

    // API 호출 함수 (한 블록 단위로 호출)
    const fetchBlockArticles = async (page: number) => {
        const block = Math.floor((page - 1) / pagesPerBlock);
        try {
            const response = await apiClient.get('/v1/recruitmentArticles', {
                params: {
                    hashTags: hashTags,
                    page: page,
                    size: pageSize,
                },
            });
            const blockData: RecruitmentArticleProps[] = response.data; // 10페이지 내용
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
        } catch (error) {
            console.error('모집글 조회 에러:', error);
        }
    };

    // 페이지 변경 시 호출
    const handlePageChange = (page: number) => {
        setPage(page);
        setEndPage(page - 1 - ((page - 1) % 10) + 10);

        // 캐시에 현재 블록의 데이터가 이미 있으면 슬라이싱만 진행
        if (articlesCache[currentBlock]) {
            const blockData = articlesCache[currentBlock];
            const startIndex = ((page - 1) % pagesPerBlock) * pageSize;
            const slicedData = blockData.slice(
                startIndex,
                startIndex + pageSize
            );
            setDisplayedArticles(slicedData);
        } else {
            // 캐시에 없으면 API 호출하여 블록 데이터 받아오기
            fetchBlockArticles(currentBlock);
        }
    };

    useEffect(() => {
        setHashTags('프론트,react,javascript');
        handlePageChange(page);
        setEndPage(page - 1 - ((page - 1) % 10) + 10);
    }, [page, hashTags]);

    return (
        <div className="flex flex-col gap-4 p-4 w-full">
            <div className="flex justify-between items-center w-full">
                <div>
                    <h1>스터디 모집 게시판</h1>
                </div>
                <div>
                    {/* 제목, 내용, 작성자 선택 드롭박스 */}
                    <div></div>
                    {/* 검색창 */}
                    <input type="text" placeholder="검색어를 입력하세요" />
                </div>
            </div>
            {/* 게시글 목록 */}
            <div className=" items-center w-full">
                <div className=" flex flex-wrap gap-4 w-full justify-center">
                    {displayedArticles.map((article) => (
                        <div
                            className="recruitment-article-card card bg-light-lavender p-4 bg-white shadow-lg rounded-lg w-80 min-w-80 h-96"
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
