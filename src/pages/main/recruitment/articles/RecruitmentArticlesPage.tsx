import React, { useEffect, useState } from 'react';
import {
    RecruitmentArticle,
    RecruitmentArticleProps,
} from '../../../../entities';
import './RecruitmentArticlesPageStyle.css';
import { apiClient, ApiResponse } from '../../../../shared';
import { PagingButton } from '../../../../widgets';

const RecruitmentArticlesPage: React.FC = () => {
    const [recruitmentArticles, setRecruitmentArticles] = useState<
        RecruitmentArticleProps[]
    >([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(12);
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isEndPage, setIsEndPage] = useState(false);
    const [endPage, setEndPage] = useState(0);

    console.log('page: ', page);

    useEffect(() => {
        setRecruitmentArticles([
            {
                id: 1,
                title: '프론트엔드 스터디 모집',
                content:
                    'React와 TypeScript를 함께 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '이영희',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 5,
                region: '서울',
                isRecruiting: true,
            },
            {
                id: 2,
                title: '백엔드 스터디 모집',
                content: 'Spring Boot와 JPA를 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '박철수',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 8,
                region: '부산',
                isRecruiting: true,
            },
            {
                id: 3,
                title: '알고리즘 스터디 모집',
                content:
                    '매주 알고리즘 문제를 풀고 리뷰할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '김민수',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 12,
                region: '대구',
                isRecruiting: true,
            },
            {
                id: 4,
                title: '데이터베이스 스터디 모집',
                content:
                    'SQL과 데이터베이스 설계를 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '최지우',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 7,
                region: '인천',
                isRecruiting: true,
            },
            {
                id: 5,
                title: '모바일 앱 개발 스터디 모집',
                content:
                    'Flutter를 이용한 모바일 앱 개발을 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '정다은',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 9,
                region: '광주',
                isRecruiting: true,
            },
            {
                id: 6,
                title: '머신러닝 스터디 모집',
                content:
                    'Python과 TensorFlow를 이용한 머신러닝을 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '한지민',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 15,
                region: '대전',
                isRecruiting: true,
            },
            {
                id: 7,
                title: '클라우드 컴퓨팅 스터디 모집',
                content: 'AWS와 Azure를 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '이준호',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 11,
                region: '울산',
                isRecruiting: true,
            },
            {
                id: 8,
                title: 'DevOps 스터디 모집',
                content:
                    'CI/CD와 Docker, Kubernetes를 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '김하늘',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 6,
                region: '세종',
                isRecruiting: true,
            },
            {
                id: 9,
                title: '보안 스터디 모집',
                content:
                    '네트워크 보안과 해킹 방어를 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '박서준',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 13,
                region: '경기',
                isRecruiting: true,
            },
            {
                id: 10,
                title: '게임 개발 스터디 모집',
                content:
                    'Unity와 Unreal Engine을 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '오세훈',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 10,
                region: '강원',
                isRecruiting: true,
            },
            {
                id: 11,
                title: '블록체인 스터디 모집',
                content:
                    '블록체인 기술과 스마트 계약을 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '홍길동',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 14,
                region: '충북',
                isRecruiting: true,
            },
            {
                id: 12,
                title: '로봇공학 스터디 모집',
                content: '로봇공학과 ROS를 공부할 스터디원을 모집합니다.',
                imageUrl: 'https://picsum.photos/400/200?random=1',
                writerName: '이순신',
                writerProfileImageUrl: 'https://picsum.photos/50/50?random=1',
                clipCount: 16,
                region: '전북',
                isRecruiting: true,
            },
        ]);

        const hashTags = ['프론트', 'react', 'javascript'];
        fetchRecruitmentArticles({ hashTags, page: 1, size: 12 });
        setEndPage(page - 1 - ((page - 1) % 10) + 10);
    }, [page]);

    interface FetchRecruitmentArticlesParams {
        hashTags: string[];
        page: number;
        size: number;
    }

    const fetchRecruitmentArticles = async ({
        hashTags,
        page,
        size,
    }: FetchRecruitmentArticlesParams): Promise<void> => {
        try {
            // axios의 get 메서드에 params 옵션으로 해시태그 배열과 페이지 정보를 전달
            const response = await apiClient.get<
                ApiResponse<RecruitmentArticleProps[]>
            >('/v1/recruitmentArticles');
            console.log('모집글 조회 결과:', response);
            console.log('모집글 조회 결과 데이터:', response.data);
            setRecruitmentArticles(
                response.data.data.map((article) => article)
            );
        } catch (error) {
            console.error('모집글 조회 에러:', error);
        }
    };

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
                    {recruitmentArticles.map((article) => (
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
                    switchPage={(page) => {
                        setPage(page);
                        fetchRecruitmentArticles({ hashTags, page, size });
                    }}
                    currentPage={page}
                    endPage={endPage}
                    isEndPage={isEndPage}
                />
            </div>
        </div>
    );
};

export default RecruitmentArticlesPage;
