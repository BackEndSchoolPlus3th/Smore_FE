// src/shared/api.ts (또는 해당 API 파일)
import { apiClient } from '../../../../shared';

interface RecruitmentArticlePayload {
    studyId: string;
    title: string;
    content: string;
    introduction: string;
    hashtags: string[];
    region: string;
    recruitmentPeriod: { start: string; end: string };
    maxMember: number;
    thumbnail: string | null;
    imageUrls?: string;
}

export const postRecruitmentArticle = async (
    payload: RecruitmentArticlePayload
) => {
    const data = {
        title: payload.title,
        content: payload.content,
        introduction: payload.introduction,
        region: payload.region,
        maxMember: payload.maxMember,
        startDate: new Date(payload.recruitmentPeriod.start)
            .toISOString()
            .split('T')[0],
        endDate: new Date(payload.recruitmentPeriod.end)
            .toISOString()
            .split('T')[0],
        hashtags: payload.hashtags,
        thumbnail: payload.thumbnail,
        imageUrls: payload.imageUrls,
    };

    console.log('JSON 데이터 전송:', data);

    return apiClient.post(
        `/api/v1/study/${payload.studyId}/recruitmentArticle`,
        data
    );
};
