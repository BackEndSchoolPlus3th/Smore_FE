import React, { useEffect, useState } from 'react';
import { RecruitmentArticle, RecruitmentArticleProps } from '../../../entities';

const RecruitmentPage: React.FC = () => {
    const [recruitmentArticles, setRecruitmentArticles] = useState<
        RecruitmentArticleProps[]
    >([]);

    useEffect(() => {
        // fetch recruitment articles
        // setRecruitmentArticles(response.data);
        setRecruitmentArticles([
            {
                id: 1,
                title: '스터디원 모집합니다',
                content:
                    '스터디원을 모집합니다. 같이 공부하실 분들은 연락주세요',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '김철수',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 10,
            },
            {
                id: 2,
                title: '스터디원 모집합니다',
                content:
                    '스터디원을 모집합니다. 같이 공부하실 분들은 연락주세요',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '김철수',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 10,
            },
            {
                id: 3,
                title: '스터디원 모집합니다',
                content:
                    '스터디원을 모집합니다. 같이 공부하실 분들은 연락주세요',
                thumbnailUrl: 'https://picsum.photos/400/200',
                writer: '김철수',
                writerProfileUrl: 'https://picsum.photos/50/50',
                clipCount: 10,
            },
        ]);
    }, []);

    return (
        <div>
            <div>
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
            <div>
                {recruitmentArticles.map((article) => (
                    <RecruitmentArticle key={article.id} {...article} />
                ))}
            </div>
        </div>
    );
};

export default RecruitmentPage;
