import { useEffect, useState } from 'react';
import { CommentList } from '../../../widgets';
import { apiClient, SubmitButton } from '../../../shared';
import { CommentProps } from '../../../entities';

interface CommentFormProps {
    recruitmentId: string;
}

const CommentForm: React.FC<CommentFormProps> = (props: CommentFormProps) => {
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [newComment, setNewComment] = useState('');

    // 댓글 목록 조회
    const fetchComments = async () => {
        try {
            const response = await apiClient.get(
                `/api/v1/recruitmentArticles/${props.recruitmentId}/comments`,
                {
                    params: { recruitmentArticleId: props.recruitmentId },
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
                `/api/v1/recruitmentArticles/${props.recruitmentId}/comments/${commentId}/edit`,
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
                `/api/v1/recruitmentArticles/${props.recruitmentId}/comments/${commentId}`
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
            await apiClient.post(
                `/api/v1/recruitmentArticles/${props.recruitmentId}/comments`,
                { comment: newComment }
            );
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('댓글 작성 에러:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-lg p-6 w-full shadow-lg bg-white h-md">
            <h2 className="text-lg font-bold text-gray-900 mb-1 border-b border-gray-200 pb-1">
                댓글 목록
            </h2>
            <div className="flex flex-col justify-between h-96 overflow-y-auto">
                <CommentList
                    comments={comments}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                />
                <div className="flex flex-row gap-4 mt-4 w-full items-center justify-center w-full">
                    <input
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 작성하세요..."
                    />
                    <SubmitButton label="작성" onClick={handleCommentSubmit} />
                </div>
            </div>
        </div>
    );
};

export default CommentForm;
