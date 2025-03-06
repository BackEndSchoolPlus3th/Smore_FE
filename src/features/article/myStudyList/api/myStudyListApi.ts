import { apiClient } from '../../../../shared';
import { RecruitmentArticleProps } from '../../../../entities';

interface FetchRecruitmentArticlesParams {
    page: number;
    size: number;
}

export const fetchMyStudyList = async (
    params: FetchRecruitmentArticlesParams
): Promise<RecruitmentArticleProps[]> => {
    const response = await apiClient.get('/api/v1/my-study', {
        params,
    });
    console.log('response.data::::', response.data);
    return response.data;
};
