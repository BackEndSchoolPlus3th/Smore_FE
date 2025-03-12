import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MarkdownRenderer } from '../../../../shared';
import { FaSpinner } from 'react-icons/fa';
import { apiClient } from '../../../../shared';
import { RecruitmentArticleClip } from '../../../../features';
import { CommentList } from '../../../../components';

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
    writerProfileImageUrl: string | null;
}

export interface CommentProps {
    id: number;
    comment: string;
    writerName: string;
    createdDate: string;
    editable: boolean;
    writerProfileImageUrl: string | null;
}

const RecuitmentContentPage: React.FC = () => {
    const { recruitmentId } = useParams<{ recruitmentId: string }>();
    const [recruitmentContent, setRecruitmentContent] =
        useState<RecruitmentContentsProps>({} as RecruitmentContentsProps);
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchApply = async () => {
        try {
            setIsProcessing(true);
            const response = await apiClient.post(
                `/api/v1/recruitmentArticles/${recruitmentId}/apply`
            );
            if (response.status === 200) alert('지원이 완료되었습니다.');
        } catch (error) {
            console.error('지원 에러:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // 모집글 상세조회
    const fetchRecruitmentContent = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(
                `/api/v1/recruitmentArticles/detail`,
                {
                    params: { recruitmentArticleId: recruitmentId },
                }
            );
            setRecruitmentContent(response.data);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 댓글 목록 조회
    const fetchComments = async () => {
        try {
            const response = await apiClient.get(
                `/api/v1/recruitmentArticles/${recruitmentId}/comments`,
                {
                    params: { recruitmentArticleId: recruitmentId },
                }
            );
            if (response.data) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('댓글 조회 에러:', error);
        }
    };

    // 댓글 수정 요청
    const handleEditComment = async (
        commentId: number,
        newCommentText: string
    ) => {
        try {
            await apiClient.put(
                `/api/v1/recruitmentArticles/${recruitmentId}/comments/${commentId}/edit`,
                {
                    comment: newCommentText,
                }
            );
            fetchComments();
        } catch (error) {
            console.error('댓글 수정 에러:', error);
        }
    };

    // 댓글 삭제 요청
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await apiClient.delete(
                `/api/v1/recruitmentArticles/${recruitmentId}/comments/${commentId}`
            );
            fetchComments();
        } catch (error) {
            console.error('댓글 삭제 에러:', error);
        }
    };

    // 댓글 작성 요청
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        try {
            setIsProcessing(true);
            await apiClient.post(
                `/api/v1/recruitmentArticles/${recruitmentId}/comments`,
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
                    {/* 좌측 댓글 섹션 */}
                    <div className="lg:w-1/4 flex flex-col items-center gap-4">
                        <div className="sticky top-60 flex flex-col gap-4 border-2 border-gray-300 rounded-lg p-6 w-full shadow-lg bg-white h-110">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1 border-b border-gray-200 pb-1">
                                댓글 목록
                            </h2>
                            <div className="flex flex-col justify-between h-96 overflow-y-auto">
                                <CommentList
                                    comments={comments}
                                    onEdit={handleEditComment}
                                    onDelete={handleDeleteComment}
                                />
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
                    {/* 중앙 모집글 상세 페이지 */}
                    <div className="lg:w-2/4 flex flex-col items-center gap-8 p-6 bg-white rounded-lg shadow-lg">
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
                        <div className="prose max-w-none w-full pb-4">
                            {recruitmentContent?.content && (
                                <MarkdownRenderer
                                    content={recruitmentContent.content}
                                />
                            )}
                        </div>
                    </div>
                    {/* 우측 해시태그, 모집 정보, 지원 버튼 */}
                    <div className="lg:w-1/4 flex flex-col items-center gap-4">
                        <div className="sticky top-60 flex flex-col gap-4 border-2 border-gray-300 rounded-lg p-6 w-full shadow-lg bg-white">
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
                            <div className="text-gray-600 font-bold">
                                <span>지역: {recruitmentContent.region}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                {recruitmentContent.writerProfileImageUrl ===
                                null ? (
                                    <div className="w-10 h-10 rounded-full border-2 border-gray-300"></div>
                                ) : (
                                    <img
                                        src={
                                            recruitmentContent?.writerProfileImageUrl
                                        }
                                        alt="writer"
                                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                                    />
                                )}
                                <span className="font-bold">
                                    {recruitmentContent?.writerName}
                                </span>
                            </div>
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
