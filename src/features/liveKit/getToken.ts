import  apiClient  from '../../shared/api/ApiClient';

export async function getToken(): Promise<string> {
    const APPLICATION_SERVER_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:8090/api/v1/' 
        : `https://${window.location.hostname}:6443/`;
    const accessToken = localStorage.getItem('accessToken');
    // const cleanToken = accessToken.replace(/\s+/g, '');  // 공백 제거
    console.log('accessToken ', accessToken);
    try {
        const response = await apiClient.post(APPLICATION_SERVER_URL + 'token', {
            baseURL: APPLICATION_SERVER_URL, // API 요청의 기본 URL 설정
            headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(`Error fetching token: ${(error as Error).message}`);
    }
}
