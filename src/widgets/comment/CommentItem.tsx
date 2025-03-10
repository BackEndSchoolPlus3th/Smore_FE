import React, { useState } from 'react';
import { CommentProps } from '../../entities';

interface CommentItemProps {
    comment: CommentProps;
    onEdit: (commentId: number, newComment: string) => Promise<void>;
    onDelete: (commentId: number) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onEdit,
    onDelete,
}) => {
    // 로컬 편집 상태 관리
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(comment.comment);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
        setInputValue(comment.comment);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsConfirming(true);
        }
    };

    const handleConfirm = async () => {
        await onEdit(comment.id, inputValue);
        setIsEditing(false);
        setIsConfirming(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsConfirming(false);
        setInputValue(comment.comment);
    };

    return (
        <div className="border-b border-gray-200 pb-4">
            {isEditing ? (
                isConfirming ? (
                    <div className="mt-2">
                        <p className="text-gray-700">{inputValue}</p>
                        <div className="flex gap-2 mt-2">
                            <button
                                className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                                onClick={handleConfirm}
                            >
                                확인
                            </button>
                            <button
                                className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                                onClick={handleCancel}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                ) : (
                    <input
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                )
            ) : (
                <>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-gray-700">{comment.comment}</p>
                        {comment.editable && (
                            <div className="flex gap-2">
                                <button
                                    className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                                    onClick={handleEditClick}
                                >
                                    수정
                                </button>
                                <button
                                    className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                                    onClick={() => onDelete(comment.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">
                        {comment.writerName} -{' '}
                        {new Date(comment.createdDate).toLocaleDateString()}
                    </p>
                </>
            )}
        </div>
    );
};

export default CommentItem;
