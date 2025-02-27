import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from './ApiResponse';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // 서버 응답 객체에서 resultCode, msg, data를 구조 분해로 추출
        const { resultCode, msg, data } = response.data;
        const statusCode = parseInt(resultCode, 10);

        // 개발 환경인 경우 서버 메시지 출력
        if (import.meta.env.DEV) {
            console.log(msg);
        }

        // 에러 코드(400 이상)인 경우, 에러 처리
        if (statusCode >= 400) {
            return Promise.reject(new Error(msg));
        }

        // 성공인 경우, 기존 response 객체의 data만 가공하여 ApiResponse 형식으로 대체
        const apiResponse: ApiResponse<typeof data> = {
            code: statusCode,
            msg,
            data,
        };

        // 기존 AxiosResponse의 필드들을 유지하면서 data만 교체
        return {
            ...response,
            data: apiResponse,
        } as AxiosResponse<ApiResponse<typeof data>>;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
