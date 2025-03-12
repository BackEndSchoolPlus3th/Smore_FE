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
                    id: clip.id,
                    title: clip.title,
                    introduction: clip.introduction,
                    isRecruiting: clip.isRecruiting,
                    endDate: clip.endDate,
                    hashTags: clip.hashTags ? clip.hashTags.split(',') : null,
                    clipCreatedDate: clip.clipCreatedDate,
                }))
            );
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchClipListData();
    // }, []);

    return (
        <div>
            {loading ? (
                <div>로딩중...</div>
            ) : error ? (
                <div>에러 발생</div>
            ) : clipList ? (
                clipList.map((clip) => (
                    <MyClipCard
                        key={clip.id}
                        id={clip.id}
                        title={clip.title}
                        introduction={clip.introduction}
                        isRecruiting={clip.isRecruiting}
                        endDate={clip.endDate}
                        hashTags={clip.hashTags}
                        clipCreatedDate={clip.clipCreatedDate}
                    />
                ))
            ) : (
                <div>클립이 없습니다.</div>
            )}
        </div>
    );
};

export default ClipBoard;
