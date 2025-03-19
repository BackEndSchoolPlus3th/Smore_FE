import React, { useState, useEffect } from 'react';
import { ClipListResponse, ClipCardProps } from '../../../entities';
import { apiClient } from '../../../shared';
import { MyClipCard } from '../../../widgets';

const ClipBoard: React.FC = () => {
    const [clipList, setClipList] = useState<ClipCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchClipListData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get<ClipListResponse[]>(
                '/api/v1/recruitmentArticle/clips'
            );
            setClipList(
                response.data.map((clip) => ({
                    recruitmentArticleId: clip.recruitmentArticleId,
                    title: clip.title,
                    introduction: clip.introduction,
                    isRecruiting: clip.isRecruiting,
                    hashTags: clip.hashTags?.split(',') || null,
                }))
            );
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    // 삭제된 clip의 id를 받아 clipList에서 제거하는 함수
    const handleRemoveClip = (recruitmentArticleId: string | number) => {
        setClipList((prevList) =>
            prevList.filter(
                (clip) => clip.recruitmentArticleId !== recruitmentArticleId
            )
        );
    };

    useEffect(() => {
        fetchClipListData();
    }, []);

    return (
        <div className="flex flex-col w-full rounded-lg shadow-md bg-[#fafbff] p-4 h-full overflow-y-auto">
            {loading ? (
                <div>로딩중...</div>
            ) : error ? (
                <div>에러 발생</div>
            ) : clipList && clipList.length > 0 ? (
                clipList.map((clip) => (
                    <MyClipCard
                        key={clip.recruitmentArticleId}
                        recruitmentArticleId={clip.recruitmentArticleId}
                        title={clip.title}
                        introduction={clip.introduction}
                        isRecruiting={clip.isRecruiting}
                        hashTags={clip.hashTags}
                        onDelete={handleRemoveClip}
                    />
                ))
            ) : (
                <div>클립이 없습니다.</div>
            )}
        </div>
    );
};

export default ClipBoard;
