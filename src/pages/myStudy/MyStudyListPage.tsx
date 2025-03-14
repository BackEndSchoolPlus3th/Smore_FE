import React, { useEffect, useState } from 'react';
import { PagingButton } from '../../widgets';
import { fetchMyStudyList } from '../../features';
import { MyStudyListResponse } from '../../entities';
import { PageSizeSelect } from '../../shared';
import { MyStudyCard } from '../../widgets';

const MyStudyListPage: React.FC = () => {
    const [articles, setArticles] = useState<MyStudyListResponse[]>([]);
    const [displayedArticles, setDisplayedArticles] = useState<
        MyStudyListResponse[]
    >([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(16);

    // 전체 데이터를 한 번만 가져오기
    const fetchArticles = async () => {
        try {
            const data: MyStudyListResponse[] = await fetchMyStudyList();
            setArticles(data);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
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
        <>
            <div
                className="sticky top-0 flex justify-between items-center border border-gray-200 bg-white
             shadow-md p-2 z-10 col-span-12 h-fit mt-6 rounded-md"
            >
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
            {displayedArticles.map((article) => (
                <MyStudyCard
                    key={article.id}
                    title={article.title}
                    introduction={article.introduction}
                    thumbnailUrl={article.thumbnailUrl}
                    hashtagList={
                        article.hashTags ? article.hashTags.split(',') : []
                    }
                    registrationDate={article.registrationDate}
                    memberCnt={article.memberCnt}
                    link={`/study/${article.id}`}
                    studyPosition={article.studyPosition}
                />
            ))}
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center col-span-12">
                <PagingButton
                    setPage={(newPage) => handlePageChange(newPage)}
                    page={page}
                    totalCount={articles.length}
                    pageSize={pageSize}
                />
            </div>
        </>
    );
};

export default MyStudyListPage;
