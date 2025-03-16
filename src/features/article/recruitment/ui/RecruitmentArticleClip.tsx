import React, { useCallback, useState } from 'react';
import { FaRegHeart, FaHeart, FaSpinner } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { clipArticle, unclipArticle } from '../api/clipApi';

interface RecruitmentArticleClipProps {
    articleId: number;
    initialClipCount: number;
    initialIsClipped: boolean;
    onClipChange?: (newClipCount: number, isClipped: boolean) => void;
}

export const RecruitmentArticleClip: React.FC<RecruitmentArticleClipProps> = ({
    articleId,
    initialClipCount,
    initialIsClipped,
    onClipChange,
}) => {
    const [clipCount, setClipCount] = useState(initialClipCount);
    const [isClipped, setIsClipped] = useState(initialIsClipped);
    const [isProcessing, setIsProcessing] = useState(false);

    const sendClipRequest = useCallback(() => {
        setIsProcessing(true);
        if (isClipped) {
            unclipArticle(articleId)
                .then(() => {
                    setIsClipped(false);
                    setClipCount((prev) => {
                        const newCount = prev - 1;
                        if (onClipChange) onClipChange(newCount, false);
                        return newCount;
                    });
                })
                .catch((error) => {
                    console.error('클립 삭제 에러:', error);
                })
                .finally(() => {
                    setIsProcessing(false);
                });
        } else {
            clipArticle(articleId)
                .then(() => {
                    setIsClipped(true);
                    setClipCount((prev) => {
                        const newCount = prev + 1;
                        if (onClipChange) onClipChange(newCount, true);
                        return newCount;
                    });
                })
                .catch((error) => {
                    console.error('클립 추가 에러:', error);
                })
                .finally(() => {
                    setIsProcessing(false);
                });
        }
    }, [articleId, isClipped, onClipChange]);

    // 500ms debounce: 빠른 연속 클릭 무시
    const debouncedClip = useCallback(
        debounce(() => {
            sendClipRequest();
        }, 500),
        [sendClipRequest]
    );

    const handleClip = () => {
        if (isProcessing) return;
        debouncedClip();
    };

    return (
        <div
            className={`flex flex-col items-center gap-2 border-2 border-gray-300 rounded-full p-4 w-24 h-24 transition-transform transform bg-white ${
                isProcessing
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer hover:scale-110'
            }
                ${isClipped ? 'border-red-200' : 'border-gray-300'}
            `}
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
                {clipCount}
            </span>
        </div>
    );
};
