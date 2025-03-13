import { apiClient } from '../../../../shared';
import { PagedArticleResponse } from '../../../../entities';
import { FetchRecruitmentArticlesParams } from '../../../../entities';

export const fetchRecruitmentArticles = async (
    params: FetchRecruitmentArticlesParams
): Promise<PagedArticleResponse> => {
    const response = await apiClient.get('/api/v1/recruitmentArticles', {
        params,
    });
    console.log('response.data::::', response.data);
    return response.data;
};
