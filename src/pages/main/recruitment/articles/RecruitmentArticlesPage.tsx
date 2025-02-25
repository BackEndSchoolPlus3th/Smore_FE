import React, { useEffect, useState } from 'react';
import {
    RecruitmentArticle,
    RecruitmentArticleProps,
} from '../../../../entities';
import './RecruitmentArticlesPageStyle.css';

const RecruitmentArticlesPage: React.FC = () => {
    const [recruitmentArticles, setRecruitmentArticles] = useState<
        RecruitmentArticleProps[]
    >([]);

    useEffect(() => {
        setRecruitmentArticles([
            {
                id: 1,
                title: '프론트엔드 스터디 모집',
                content:
                    'React와 TypeScript를 함께 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '이영희',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 5,
            },
            {
                id: 2,
                title: '백엔드 스터디 모집',
                content: 'Spring Boot와 JPA를 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '박철수',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 8,
            },
            {
                id: 3,
                title: '알고리즘 스터디 모집',
                content:
                    '매주 알고리즘 문제를 풀고 리뷰할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '김민수',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 12,
            },
            {
                id: 4,
                title: '데이터베이스 스터디 모집',
                content:
                    'SQL과 데이터베이스 설계를 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '최지우',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 7,
            },
            {
                id: 5,
                title: '모바일 앱 개발 스터디 모집',
                content:
                    'Flutter를 이용한 모바일 앱 개발을 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '정다은',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 9,
            },
            {
                id: 6,
                title: '머신러닝 스터디 모집',
                content:
                    'Python과 TensorFlow를 이용한 머신러닝을 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '한지민',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 15,
            },
            {
                id: 7,
                title: '클라우드 컴퓨팅 스터디 모집',
                content: 'AWS와 Azure를 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '이준호',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 11,
            },
            {
                id: 8,
                title: 'DevOps 스터디 모집',
                content:
                    'CI/CD와 Docker, Kubernetes를 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '김하늘',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 6,
            },
            {
                id: 9,
                title: '보안 스터디 모집',
                content:
                    '네트워크 보안과 해킹 방어를 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '박서준',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 13,
            },
            {
                id: 10,
                title: '게임 개발 스터디 모집',
                content:
                    'Unity와 Unreal Engine을 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '오세훈',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 10,
            },
            {
                id: 11,
                title: '블록체인 스터디 모집',
                content:
                    '블록체인 기술과 스마트 계약을 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '홍길동',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 14,
            },
            {
                id: 12,
                title: '로봇공학 스터디 모집',
                content: '로봇공학과 ROS를 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '이순신',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 16,
            },
        ]);
    }, []);

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
                <div className="container flex flex-wrap gap-4 w-full">
                    {recruitmentArticles.map((article) => (
                        <RecruitmentArticle key={article.id} {...article} />
                    ))}
                </div>
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center w-full">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
            </div>
        </div>
    );
};

export default RecruitmentArticlesPage;
