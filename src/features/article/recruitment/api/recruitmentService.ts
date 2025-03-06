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
    thumbnail: File | null;
}

export const postRecruitmentArticle = async (
    payload: RecruitmentArticlePayload
) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('content', payload.content);
    formData.append('introduction', payload.introduction);
    formData.append('region', payload.region);
    formData.append('maxMember', payload.maxMember.toString());
    formData.append(
        'startDate',
        new Date(payload.recruitmentPeriod.start).toISOString().split('T')[0]
    );
    formData.append(
        'endDate',
        new Date(payload.recruitmentPeriod.end).toISOString().split('T')[0]
    );
    if (payload.hashtags.length > 0) {
        formData.append('hashtags', payload.hashtags.join(','));
    }
    if (payload.thumbnail) {
        formData.append('thumbnail', payload.thumbnail);
    }

    return apiClient.post(
        `/api/v1/study/${payload.studyId}/recruitmentArticle`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};
