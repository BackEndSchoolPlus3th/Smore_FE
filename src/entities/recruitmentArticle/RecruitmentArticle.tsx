import React from 'react';
import { RecruitmentArticleProps } from './RecruitmentArticleProb';
import { FaHeart } from 'react-icons/fa6';
import './RecruitmentArticleStyle.css';

const RecruitmentArticle: React.FC<RecruitmentArticleProps> = ({
    title,
    introduction,
    thumbnailUrl,
    writerName,
    writerProfileImageUrl,
    clipCount,
    hashTags,
}: RecruitmentArticleProps) => {
    return (
        <div className="RecruitmentArticleContainer w-full h-full flex flex-col justify-between">
            {/* 썸네일, 내용 */}
            <div className="flex flex-col space-y-4">
                {/* 썸네일 */}
                <div className="w-full h-48 overflow-hidden rounded-lg">
                    {/* 썸네일 이미지, null일 경우 흰 배경 div */}
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="bg-gray-100 w-full h-full"></div>
                    )}
                </div>
                {/* 내용 */}
                <div className="flex flex-col space-y-2">
                    <div className="text-lg font-semibold">{title}</div>
                    <div className="text-gray-600">{introduction}</div>
                </div>
            </div>
            {/* 해시태그, 작성자, 좋아요 */}
            <div>
                {/* 해시태그 */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {hashTags &&
                        hashTags.split(',').map((hashTag, index) => (
                            <div
                                key={index}
                                className="px-2 py-1 bg-light-purple rounded-full text-sm"
                            >
                                #{hashTag}
                            </div>
                        ))}
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
            </div>
        </div>
    );
};

export default RecruitmentArticle;
