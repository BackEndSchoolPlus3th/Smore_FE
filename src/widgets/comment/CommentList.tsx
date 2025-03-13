import React from 'react';
import { CommentProps } from '../../entities';
import CommentItem from './CommentItem';

interface CommentListProps {
    comments: CommentProps[];
    onEdit: (commentId: number, newComment: string) => Promise<void>;
    onDelete: (commentId: number) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({
    comments,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex flex-col gap-4 max-h-full h-full overflow-y-auto">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default CommentList;
