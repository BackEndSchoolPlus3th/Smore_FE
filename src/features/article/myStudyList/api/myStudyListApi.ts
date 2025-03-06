import { apiClient } from '../../../../shared';
import { MyStudyListArticleProps } from '../../../../entities';

export const fetchMyStudyList = async (): Promise<
    MyStudyListArticleProps[]
> => {
    const response = await apiClient.get('/api/v1/my-study');
    console.log('response.data::::', response.data);
    return response.data;
};
