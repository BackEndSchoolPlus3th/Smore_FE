import React from 'react';
import { MyStudyListArticleProps } from '../../../../entities';

const MyStudyArticle: React.FC<MyStudyListArticleProps> = ({
    title,
    introduction,
    thumbnailUrl,
    studyPosition,
    hashTags,
    memberCnt,
    registrationDate,
}: MyStudyListArticleProps) => {
    return (
        <div className="RecruitmentArticleContainer w-full h-full flex flex-col justify-between">
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
                    <div className="text-gray-600">{introduction}</div>
                </div>
            </div>
            {/* 해시태그, 작성자, 좋아요 */}
            <div>
                {/* 해시태그 */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {hashTags?.split(',').map((hashTag, index) => (
                        <div
                            key={index}
                            className="px-2 py-1 bg-light-purple rounded-full text-sm"
                        >
                            #{hashTag}
                        </div>
                    ))}
                </div>
                {/* 가입일, 인원 */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">
                            {registrationDate}
                        </div>
                        <div className="text-sm font-medium">
                            인원 {memberCnt}명
                        </div>
                    </div>
                    <div className="text-sm font-medium">{studyPosition}</div>
                </div>
            </div>
        </div>
    );
};

export default MyStudyArticle;
