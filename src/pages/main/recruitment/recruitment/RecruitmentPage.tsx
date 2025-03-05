import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MarkdownRenderer } from '../../../../shared';
import { FaSpinner } from 'react-icons/fa';
import { apiClient } from '../../../../shared';
import { RecruitmentArticleClip } from '../../../../features';

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
    createdDate: string;
    maxMember: number;
    hashTags?: string;
    clipCount: number;
    clipped: boolean;
    writerName: string;
    writerProfileImageUrl?: string;
}

interface CommentProps {
    id: number;
    comment: string;
    writerName: string;
    createdDate: string;
}

const RecuitmentContentPage: React.FC = () => {
    const { recruitmentId } = useParams<{ recruitmentId: string }>();
    const [recruitmentContent, setRecruitmentContent] =
        useState<RecruitmentContentsProps>({} as RecruitmentContentsProps);
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    const fetchApply = async () => {
        try {
            setIsProcessing(true);
            const response = await apiClient.post(
                `/v1/recruitmentArticles/${recruitmentId}/apply`
            );
            alert('지원이 완료되었습니다.');
        } catch (error) {
            console.error('지원 에러:', error);
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
        } catch (error) {
            console.error('모집글 조회 에러:', error);
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    // 댓글 목록 조회
    const fetchComments = async () => {
        try {
            const response = await apiClient.get(
                `/v1/recruitmentArticles/${recruitmentId}/comments`,
                {
                    params: {
                        recruitmentArticleId: recruitmentId,
                    },
                }
            );
            setComments(response.data);
        } catch (error) {
            console.error('댓글 조회 에러:', error);
        }
    };

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            setIsProcessing(true);
            await apiClient.post(
                `/v1/recruitmentArticles/${recruitmentId}/comments`,
                { comment: newComment }
            );
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('댓글 작성 에러:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        fetchRecruitmentContent();
        fetchComments();
    }, [recruitmentId]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 min-h-223">
            {isLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <FaSpinner className="text-blue-500 text-5xl animate-spin" />
                </div>
            ) : (
                <>
                    <div className="lg:w-1/4 flex flex-col items-center gap-4">
                        {/** 댓글 섹션 */}
                        <div className="sticky top-60 flex flex-col gap-4 border-2 border-gray-300 rounded-lg p-6 w-full shadow-lg bg-white h-110">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1 border-b border-gray-200 pb-1">
                                댓글 목록
                            </h2>
                            <div className="flex flex-col justify-between h-96 overflow-y-auto">
                                <div className="flex flex-col gap-4 max-h-full h-full overflow-y-auto">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="border-b border-gray-200 pb-4"
                                        >
                                            <p className="text-gray-700">
                                                {comment.comment}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {comment.writerName} -{' '}
                                                {new Date(
                                                    comment.createdDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-row gap-4 mt-4 w-full items-center justify-center">
                                    <input
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        value={newComment}
                                        onChange={(e) =>
                                            setNewComment(e.target.value)
                                        }
                                        placeholder="댓글을 작성하세요..."
                                    />
                                    <button
                                        className="w-40 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-bold"
                                        onClick={handleCommentSubmit}
                                        disabled={isProcessing}
                                    >
                                        작성
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** 모집글 상세 페이지 */}
                    <div className="lg:w-2/4 flex flex-col items-center gap-8 p-6 bg-white rounded-lg shadow-lg">
                        {/** 제목, 짧은 소개글, 작성날짜 */}
                        <div className="text-center mb-8 w-full border-b border-gray-200 pb-4">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                                {recruitmentContent.title}
                            </h1>
                            <p className="text-lg text-gray-700 mb-2">
                                {recruitmentContent.introduction}
                            </p>
                            <p className="text-sm text-gray-500">
                                {recruitmentContent.createdDate &&
                                    new Date(
                                        recruitmentContent.createdDate
                                    ).toLocaleDateString()}
                            </p>
                        </div>
                        {/** 이미지들 */}
                        <div className="flex flex-wrap justify-center w-full border-b border-gray-200 pb-4">
                            {recruitmentContent.imageUrls
                                ?.split(',')
                                .map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt="recruitment"
                                        className="w-full h-auto"
                                    />
                                ))}
                        </div>
                        {/** 내용 */}
                        <div className="prose max-w-none w-full  pb-4">
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
                            {/** 찜하기 버튼 */}
                            <div className="flex flex-row w-full justify-center">
                                <RecruitmentArticleClip
                                    articleId={recruitmentContent.id}
                                    initialClipCount={
                                        recruitmentContent.clipCount
                                    }
                                    initialIsClipped={
                                        recruitmentContent.clipped
                                    }
                                />
                            </div>
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
                                    onClick={fetchApply}
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
