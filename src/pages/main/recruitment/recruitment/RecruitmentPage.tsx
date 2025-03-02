import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MarkdownRenderer } from '../../../../shared';
import { FaRegHeart, FaHeart, FaSpinner } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { apiClient } from '../../../../shared';
import { set } from 'lodash';

interface RecruitmentContentsProps {
    id: number;
    title: string;
    content: string;
    introduction: string;
    region: string;
    imageUrls?: string;
    startDate: string;
    endDate: string;
    isRecruiting: boolean;
    createDate: string;
    maxMember: number;
    hashTags?: string;
    clipCount: number;
    isClipped: boolean;
    writerName: string;
    writerProfileImageUrl?: string;
}

const RecuitmentContentPage: React.FC = () => {
    const { recruitmentId } = useParams<{ recruitmentId: string }>();
    const [recruitmentContent, setRecruitmentContent] =
        useState<RecruitmentContentsProps>({} as RecruitmentContentsProps);
    const [isClipped, setIsClipped] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchClipPost = async () => {
        try {
            const response = await apiClient.post(
                '/v1/recruitmentArticle/clip',
                {
                    recruitmentArticleId: recruitmentContent.id,
                }
            );
            setIsClipped(true);
            recruitmentContent.clipCount++;
            console.log('클립 추가:', response.data);
        } catch (error) {
            console.error('클립 추가 에러:', error);
        }
    };

    const fetchClipDelete = async () => {
        try {
            const response = await apiClient.delete(
                '/v1/recruitmentArticle/clip',
                {
                    params: {
                        recruitmentArticleId: recruitmentContent.id,
                    },
                }
            );
            setIsClipped(false);
            recruitmentContent.clipCount--;
        } catch (error) {
            console.error('클립 삭제 에러:', error);
        }
    };

    // 모집글 상세조회
    const fetchRecruitmentContent = async () => {
        try {
            const response = await apiClient.get(
                `/v1/recruitmentArticles/detail`,
                {
                    params: {
                        recruitmentArticleId: recruitmentId,
                    },
                }
            );
            setRecruitmentContent(response.data);
            setIsClipped(response.data.isClipped);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
        }
    };

    useEffect(() => {
        fetchRecruitmentContent();
    }, [recruitmentId]);

    // 실제 서버 요청을 보내는 함수(예시로 상태만 토글)
    const sendClipRequest = useCallback(() => {
        // API 요청 코드 삽입 (예: axios.post(...))
        if (isClipped) {
            fetchClipDelete();
        } else {
            fetchClipPost();
        }
    }, [isClipped]);

    // debounce 적용: 500ms 동안 빠른 연속 클릭 무시 + 요청 후 isProcessing false로 처리
    const debouncedClip = useCallback(
        debounce(() => {
            sendClipRequest();
            setIsProcessing(false);
        }, 500),
        [sendClipRequest]
    );

    const handleClip = () => {
        if (isProcessing) return; // 이미 처리 중이면 무시
        setIsProcessing(true);
        debouncedClip();
    };

    useEffect(() => {
        // API로부터 모집글 데이터를 가져온다.
        // setRecruitmentContent(response.data);
        setRecruitmentContent({
            id: 1,
            title: '프론트엔드 스터디 모집',
            content:
                '# MarkdownRenderer 테스트 페이지\n\nMarkdownRenderer 컴포넌트의 **모든 기능**을 실험하기 위한 예제입니다. 아래에서는 다양한 Markdown 요소를 사용하여 스타일이 어떻게 적용되는지 확인할 수 있습니다.\n\n## 헤딩\n### h3 헤딩 예제\n#### h4 헤딩 예제\n##### h5 헤딩 예제\n###### h6 헤딩 예제\n\n## 텍스트 스타일\n이 문단에서는 **굵은 텍스트**, *기울임 텍스트* 그리고 `인라인 코드`를 사용하여 다양한 텍스트 스타일을 보여줍니다.\n\n## 리스트\n\n### 순서 없는 리스트\n- 항목 1\n- 항목 2\n  - 하위 항목 A\n  - 하위 항목 B\n\n### 순서 있는 리스트\n1. 첫 번째 항목\n2. 두 번째 항목\n3. 세 번째 항목\n\n## 코드 블록\n다음은 JavaScript 예제 코드입니다:\n\n```\n// 두 수를 더하는 함수\nfunction add(a, b) {\n\treturn a + b;\n}\nconsole.log(add(2, 3)); // 결과: 5\n```\n코드 블럭 끝',
            introduction:
                '프론트엔드 스터디를 함께 진행할 분들을 찾습니다. 많은 관심 부탁드립니다.',
            region: '서울',
            imageUrls:
                'https://picsum.photos/2000/4000,https://picsum.photos/2000/5000',
            startDate: '2025-02-28T17:16:51.319138',
            endDate: '2025-03-10T17:38:51.243581',
            isRecruiting: true,
            createDate: '2025-02-28T17:16:51.327716',
            maxMember: 5,
            hashTags: '프론트엔드,스터디,모집',
            clipCount: 5,
            isClipped: false,
            writerName: '이영희',
            writerProfileImageUrl: 'https://picsum.photos/50/50',
        });
    }, [recruitmentId]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4">
            {/** 찜하기 버튼 */}
            <div className="lg:w-1/4 flex flex-col items-center gap-4">
                <div
                    className={`sticky top-80 flex flex-col items-center gap-2 border-2 border-gray-300 rounded-full p-4 w-24 h-24 transition-transform transform ${
                        isProcessing
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer hover:scale-110'
                    }`}
                    onClick={handleClip}
                >
                    {isProcessing ? (
                        <FaSpinner className="text-blue-500 text-5xl animate-spin" />
                    ) : isClipped ? (
                        <FaHeart className="text-red-500 text-5xl" />
                    ) : (
                        <FaRegHeart className="text-gray-500 text-5xl" />
                    )}
                    <span className="text-lg font-semibold text-gray-700">
                        {recruitmentContent?.clipCount}
                    </span>
                </div>
            </div>
            {/** 모집글 상세 페이지 */}
            <div className="lg:w-2/4 flex flex-col items-center gap-4">
                {/** 제목, 짧은 소개글, 작성날짜 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        {recruitmentContent.title}
                    </h1>
                    <p className="text-lg text-gray-700 mb-2">
                        {recruitmentContent.introduction}
                    </p>
                    <p className="text-sm text-gray-500">
                        {recruitmentContent.createDate &&
                            new Date(
                                recruitmentContent.createDate
                            ).toLocaleDateString()}
                    </p>
                </div>
                {/** 이미지들 */}
                <div className="flex flex-wrap justify-center">
                    {recruitmentContent.imageUrls
                        ?.split(',')
                        .map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt="recruitment"
                                className="w-full h-auto object-contain"
                            />
                        ))}
                </div>
                {/** 내용 */}
                <div className="prose">
                    {recruitmentContent?.content && (
                        <MarkdownRenderer
                            content={recruitmentContent.content}
                        />
                    )}
                </div>
            </div>
            {/** 해시태그, 모집 기간, 지역, 작성일, 작성자, 지원 버튼 */}
            <div className="lg:w-1/4 flex flex-col items-center gap-4">
                {/** 기타정보, 지원 버튼 박스 */}
                <div className="sticky top-60 flex flex-col gap-4 border-2 border-gray-300 rounded-lg p-6 w-full shadow-lg bg-white">
                    {/** 해시태그 */}
                    <div className="flex flex-wrap gap-2">
                        {recruitmentContent?.hashTags &&
                            recruitmentContent.hashTags
                                .split(',')
                                .map((hashtag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                                    >
                                        #{hashtag}
                                    </span>
                                ))}
                    </div>
                    {/** 모집 기간 */}
                    <div className="flex flex-col text-gray-600 gap-2">
                        <span className="font-bold">
                            시작:{' '}
                            {recruitmentContent?.startDate &&
                                new Date(
                                    recruitmentContent.startDate
                                ).toLocaleDateString()}
                        </span>
                        <span className="font-bold">
                            마감:{' '}
                            {recruitmentContent?.endDate &&
                                new Date(
                                    recruitmentContent.endDate
                                ).toLocaleDateString()}
                        </span>
                    </div>
                    {/** 지역 */}
                    <div className="text-gray-600 font-bold">
                        <span>지역: {recruitmentContent.region}</span>
                    </div>
                    {/** 작성일, 작성자 */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <img
                            src={recruitmentContent?.writerProfileImageUrl}
                            alt="writer"
                            className="w-10 h-10 rounded-full border-2 border-gray-300"
                        />
                        <span className="font-bold">
                            {recruitmentContent?.writerName}
                        </span>
                    </div>
                    {/** 지원 버튼 */}
                    <div className="w-full">
                        <button
                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-green-600 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                            disabled={
                                !recruitmentContent.isRecruiting ||
                                (recruitmentContent.endDate
                                    ? new Date(recruitmentContent.endDate) <
                                      new Date()
                                    : false)
                            }
                        >
                            지원하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuitmentContentPage;
