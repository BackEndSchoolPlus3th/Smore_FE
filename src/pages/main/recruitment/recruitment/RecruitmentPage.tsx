import React, { useEffect, useState } from 'react';
import { MarkdownRenderer } from '../../../../shared';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

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
    const [isClipped, setIsClipped] = useState(false);

    const handleClip = () => {
        setIsClipped(!isClipped);
    };

    useEffect(() => {
        // API로부터 모집글 데이터를 가져온다.
        // setRecruitmentContent(response.data);
        setRecruitmentContent({
            title: '프론트엔드 스터디 모집',
            content:
                '# MarkdownRenderer 테스트 페이지\n\nMarkdownRenderer 컴포넌트의 **모든 기능**을 실험하기 위한 예제입니다. 아래에서는 다양한 Markdown 요소를 사용하여 스타일이 어떻게 적용되는지 확인할 수 있습니다.\n\n## 헤딩\n### h3 헤딩 예제\n#### h4 헤딩 예제\n##### h5 헤딩 예제\n###### h6 헤딩 예제\n\n## 텍스트 스타일\n이 문단에서는 **굵은 텍스트**, *기울임 텍스트* 그리고 `인라인 코드`를 사용하여 다양한 텍스트 스타일을 보여줍니다.\n\n## 리스트\n\n### 순서 없는 리스트\n- 항목 1\n- 항목 2\n  - 하위 항목 A\n  - 하위 항목 B\n\n### 순서 있는 리스트\n1. 첫 번째 항목\n2. 두 번째 항목\n3. 세 번째 항목\n\n## 코드 블록\n다음은 JavaScript 예제 코드입니다:\n\n```\n// 두 수를 더하는 함수\nfunction add(a, b) {\n\treturn a + b;\n}\nconsole.log(add(2, 3)); // 결과: 5\n```\n코드 블럭 끝',
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
        <div className="flex flex-row">
            {/** 모집글 상세 페이지 */}
            {/** 찜하기 버튼 */}
            <div>
                {/** 찜하기 버튼 박스 */}
                <div>
                    <div>
                        {isClipped ? (
                            <FaHeart onClick={handleClip} />
                        ) : (
                            <FaRegHeart onClick={handleClip} />
                        )}
                    </div>
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
