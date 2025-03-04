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
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

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
            setIsLoading(true); // 로딩 시작
            const response = await apiClient.get(
                `/v1/recruitmentArticles/detail`,
                {
                    params: {
                        recruitmentArticleId: recruitmentId,
                    },
                }
            );
            setRecruitmentContent(response.data);
            setIsClipped(response.data.clipped);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
        } finally {
            setIsLoading(false); // 로딩 종료
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
            id: 0,
            title: '',
            content: '',
            introduction: '',
            region: '',
            imageUrls: '',
            startDate: '',
            endDate: '',
            isRecruiting: false,
            createDate: '',
            maxMember: 0,
            hashTags: '',
            clipCount: 0,
            isClipped: false,
            writerName: '',
            writerProfileImageUrl: '',
        });
    }, [recruitmentId]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4">
            {isLoading ? (
                <div className="flex justify-center items-center w-full h-screen">
                    <FaSpinner className="text-blue-500 text-5xl animate-spin" />
                </div>
            ) : (
                <>
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
                                    src={
                                        recruitmentContent?.writerProfileImageUrl
                                    }
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
                                            ? new Date(
                                                  recruitmentContent.endDate
                                              ) < new Date()
                                            : false)
                                    }
                                >
                                    지원하기
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecuitmentContentPage;
