import { apiClient } from '../../../../shared';
import { MyStudyListResponse } from '../../../../entities';

export const fetchMyStudyList = async (): Promise<MyStudyListResponse[]> => {
    const response = await apiClient.get('/api/v1/my-study');
    console.log('response.data::::', response.data);
    return response.data;
};
