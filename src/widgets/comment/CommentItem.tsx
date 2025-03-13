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

    const handleEditClick = () => {
        setIsEditing(true);
        setInputValue(comment.comment);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    const handleConfirm = async () => {
        await onEdit(comment.id, inputValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setInputValue(comment.comment);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {comment.isPublisher ? (
                <div className="flex flex-row justify-start items-start">
                    <img
                        src={comment.writerProfileImageUrl ?? undefined}
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-2">
                        <div className="font-bold">{comment.writerName}</div>
                        <div className="relative bg-blue-100 border border-gray-300 rounded-r-lg rounded-bl-lg p-2 max-w-xs break-words">
                            <div className="absolute top-0 left-0 w-0 h-0 border-t-0 border-r-8 border-b-8 border-l-8 border-transparent border-b-blue-100"></div>
                            {isEditing ? (
                                <textarea
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full p-1 border-0 rounded"
                                />
                            ) : (
                                comment.comment
                            )}
                        </div>
                        <div className="flex flex-row text-xs text-gray-500 mt-1">
                            <div>{comment.createdDate}</div>
                            {isEditing ? (
                                <>
                                    <button
                                        className="ml-2 cursor-pointer text-green-900 hover:underline"
                                        onClick={handleConfirm}
                                    >
                                        확인
                                    </button>
                                    <button
                                        className="ml-2 cursor-pointer text-red-900 hover:underline"
                                        onClick={handleCancel}
                                    >
                                        취소
                                    </button>
                                </>
                            ) : (
                                comment.editable && (
                                    <>
                                        <button
                                            className="ml-2 cursor-pointer text-green-900 hover:underline"
                                            onClick={handleEditClick}
                                        >
                                            수정
                                        </button>
                                        <button
                                            className="ml-2 cursor-pointer text-red-900 hover:underline"
                                            onClick={() => onDelete(comment.id)}
                                        >
                                            삭제
                                        </button>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row justify-end items-start">
                    <div className="mr-2">
                        <div className="font-bold text-right">
                            {comment.writerName}
                        </div>
                        <div className="relative bg-gray-100 border border-gray-300 rounded-l-lg rounded-br-lg p-2 max-w-xs break-words">
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-0 border-l-8 border-b-8 border-r-8 border-transparent border-b-gray-100"></div>
                            {isEditing ? (
                                <textarea
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className="w-full p-1 border-0 rounded"
                                />
                            ) : (
                                comment.comment
                            )}
                        </div>
                        <div className="flex flex-row justify-end text-xs text-gray-500 mt-1">
                            <div>{comment.createdDate}</div>
                            {isEditing ? (
                                <>
                                    <button
                                        className="ml-2 cursor-pointer text-green-900 hover:underline"
                                        onClick={handleConfirm}
                                    >
                                        확인
                                    </button>
                                    <button
                                        className="ml-2 cursor-pointer text-red-900 hover:underline"
                                        onClick={handleCancel}
                                    >
                                        취소
                                    </button>
                                </>
                            ) : (
                                comment.editable && (
                                    <>
                                        <button
                                            className="ml-2 cursor-pointer text-green-900 hover:underline"
                                            onClick={handleEditClick}
                                        >
                                            수정
                                        </button>
                                        <button
                                            className="ml-2 cursor-pointer text-red-900 hover:underline"
                                            onClick={() => onDelete(comment.id)}
                                        >
                                            삭제
                                        </button>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                    <img
                        src={comment.writerProfileImageUrl ?? undefined}
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
            )}
        </div>
    );
};

export default CommentItem;
