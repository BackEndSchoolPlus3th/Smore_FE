import { apiClient } from '../../../../shared';
import { pagedResponse } from '../../../../entities';

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
): Promise<pagedResponse> => {
    const response = await apiClient.get('/api/v1/recruitmentArticles', {
        params,
    });
    console.log('response.data::::', response.data);
    return response.data;
};
