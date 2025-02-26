import React from 'react';
import { RecruitmentArticleProps } from './RecruitmentArticleProb';
import { FaHeart } from 'react-icons/fa6';
import './RecruitmentArticleStyle.css';

const RecruitmentArticle: React.FC<RecruitmentArticleProps> = ({
    id,
    title,
    content,
    thumbnailUrl,
    writer,
    writerProfileUrl,
    clipCount,
}: RecruitmentArticleProps) => {
    return (
        <div className="RecruitmentArticleContainer bg-light-blue p-4 bg-white shadow-lg rounded-lg w-96 h-96">
            {/* 썸네일, 내용 */}
            <div className="flex flex-col space-y-4">
                {/* 썸네일 */}
                <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="object-cover w-full h-full"
                    />
                </div>
                {/* 내용 */}
                <div className="flex flex-col space-y-2">
                    <div className="text-lg font-semibold">{title}</div>
                    <div className="text-gray-600">{content}</div>
                </div>
            </div>
            {/* 작성자, 좋아요 */}
            <div className="flex justify-between items-center mt-4">
                {/* 작성자 */}
                <div className="flex items-center space-x-2">
                    <img
                        src={writerProfileUrl}
                        alt={writer}
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm font-medium">{writer}</div>
                </div>
                {/* 좋아요 */}
                <div className="flex items-center space-x-2">
                    <FaHeart color="red" />
                    <div className="text-sm">{clipCount}</div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentArticle;
