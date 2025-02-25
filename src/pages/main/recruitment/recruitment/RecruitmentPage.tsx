import React, { useEffect, useState } from 'react';
import { MarkdownRenderer } from '../../../../shared';

interface RecruitmentContentsProps {
    title: string;
    content: string;
    region: string;
    imageUrls?: string[];
    startDate: string;
    endDate: string;
    isRecruiting: boolean;
    createDate: string;
    writer: string;
    clipCount: number;
    hashtags?: string[];
}

const RecuitmentContentPage: React.FC = () => {
    const [recruitmentContent, setRecruitmentContent] =
        useState<RecruitmentContentsProps | null>(null);

    useEffect(() => {
        // API로부터 모집글 데이터를 가져온다.
        // setRecruitmentContent(response.data);
        setRecruitmentContent({
            title: '프론트엔드 스터디 모집',
            content: `
# 프론트엔드 스터디 모집

React와 TypeScript를 함께 공부할 스터디원을 모집합니다. 

### 스터디 소개
- **주제**: React와 TypeScript
- **기간**: 2021-09-01 ~ 2021-09-30
- **장소**: 서울

### 스터디 목표
- React 기본 개념 이해
- TypeScript와 함께 사용하는 방법 학습
- 프로젝트를 통한 실습

### 지원 방법
- 아래 지원하기 버튼을 눌러 지원해주세요.

많은 참여 부탁드립니다!
`,
            region: '서울',
            imageUrls: [
                'https://picsum.photos/300/200',
                'https://picsum.photos/300/200',
            ],
            startDate: '2021-09-01',
            endDate: '2021-09-30',
            isRecruiting: true,
            createDate: '2021-08-01',
            writer: '이영희',
            clipCount: 5,
            hashtags: ['React', 'TypeScript'],
        });
    }, []);

    return (
        <div>
            {/** 모집글 상세 페이지 */}
            {/** 찜하기 버튼 */}
            <div>
                {/** 찜하기 버튼 박스 */}
                <div>
                    <div></div>
                </div>
            </div>
            {/** 제목, 이미지들, 내용 */}
            <div>
                {/** 제목 */}
                <div>
                    <h1>{recruitmentContent?.title}</h1>
                </div>
                {/** 이미지들 */}
                <div>
                    {recruitmentContent?.imageUrls?.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={imageUrl + index}
                        />
                    ))}
                </div>
                {/** 내용 */}
                <div>
                    {recruitmentContent?.content && (
                        <MarkdownRenderer
                            content={recruitmentContent.content}
                        />
                    )}
                </div>
            </div>
            {/** 해시태그, 모집 기간, 지역, 작성일, 작성자, 지원 버튼 */}
            <div>
                {/** 기타정보, 지원 버튼 박스 */}
                <div>
                    {/** 해시태그 */}
                    <div>
                        {recruitmentContent?.hashtags?.map((hashtag, index) => (
                            <span key={index}>{hashtag}</span>
                        ))}
                    </div>
                    {/** 모집 기간 */}
                    <div>
                        <span>{recruitmentContent?.startDate}</span>
                        <span>{recruitmentContent?.endDate}</span>
                    </div>
                    {/** 지역 */}
                    <div>
                        <span>{recruitmentContent?.region}</span>
                    </div>
                    {/** 작성일, 작성자 */}
                    <div>
                        <span>{recruitmentContent?.createDate}</span>
                        <span>{recruitmentContent?.writer}</span>
                    </div>
                    {/** 지원 버튼 */}
                    <div>
                        <button>지원하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuitmentContentPage;
