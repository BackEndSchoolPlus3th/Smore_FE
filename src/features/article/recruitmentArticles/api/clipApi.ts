import { apiClient } from '../../../../shared';

export const clipArticle = async (articleId: number) => {
    const response = await apiClient.post('/v1/recruitmentArticle/clip', {
        recruitmentArticleId: articleId,
    });
    return response.data;
};

export const unclipArticle = async (articleId: number) => {
    const response = await apiClient.delete('/v1/recruitmentArticle/clip', {
        params: { recruitmentArticleId: articleId },
    });
    return response.data;
};
