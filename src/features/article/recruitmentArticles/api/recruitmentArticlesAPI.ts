import { apiClient } from '../../../../shared';
import { RecruitmentArticleProps } from '../../../../entities';

interface FetchRecruitmentArticlesParams {
    title: string;
    content: string;
    introduction: string;
    hashTags: string;
    region: string;
    page: number;
    size: number;
}

export const fetchRecruitmentArticles = async (
    params: FetchRecruitmentArticlesParams
): Promise<RecruitmentArticleProps[]> => {
    const response = await apiClient.get('/v1/recruitmentArticles', { params });
    console.log('response.data::::', response.data);
    return response.data;
};
