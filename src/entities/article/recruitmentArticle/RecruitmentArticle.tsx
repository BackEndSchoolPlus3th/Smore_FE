import React from 'react';
import { RecruitmentArticleProps } from './RecruitmentArticleProb';
import { FaHeart } from 'react-icons/fa6';
import './RecruitmentArticleStyle.css';
import { Link } from 'react-router-dom';

const RecruitmentArticle: React.FC<RecruitmentArticleProps> = ({
    id,
    title,
    introduction,
    imageUrl,
    writerName,
    writerProfileImageUrl,
    clipCount,
}: RecruitmentArticleProps) => {
    return (
        <Link
            to={`/recruitment/${id}`}
            className="RecruitmentArticleContainer w-full h-full"
        >
            {/* 썸네일, 내용 */}
            <div className="flex flex-col space-y-4">
                {/* 썸네일 */}
                <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full"
                    />
                </div>
                {/* 내용 */}
                <div className="flex flex-col space-y-2">
                    <div className="text-lg font-semibold">{title}</div>
                    <div className="text-gray-600">{introduction}</div>
                </div>
            </div>
            {/* 작성자, 좋아요 */}
            <div className="flex justify-between items-center mt-4">
                {/* 작성자 */}
                <div className="flex items-center space-x-2">
                    <img
                        src={writerProfileImageUrl}
                        alt={writerName}
                        className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm font-medium">{writerName}</div>
                </div>
                {/* 좋아요 */}
                <div className="flex items-center space-x-2">
                    <FaHeart color="red" />
                    <div className="text-sm">{clipCount}</div>
                </div>
            </div>
        </Link>
    );
};

export default RecruitmentArticle;
