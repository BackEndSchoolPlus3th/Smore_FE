import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from './ApiResponse';

const getCookie = (name: any) => {
    const matches = document.cookie.match(
        new RegExp(
            '(?:^|; )' +
                name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
                '=([^;]*)'
        )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const refreshApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = getCookie('refreshToken');
        if (accessToken) {
            config.headers['authorization'] = `${accessToken}`;
        }
        if (refreshToken) {
            config.headers['Set-Cookie'] = `${refreshToken}`;
        }
        console.log('config::::', config.headers['authorization']);
        console.log('refreshToken::::', config.headers['Set-Cookie']);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
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

        // if(statusCode==401){

        //     try {
        //         const response = await refreshApiClient.post('/member/refresh');
        //         const { accessToken } = response.headers["authorization"];

        //         localStorage.setItem('accessToken', accessToken);
        //         originalRequest.headers[
        //             'authorization'
        //         ] = `${accessToken}`;
        //         return apiClient(originalRequest);
        //     } catch (refreshError) {
        //         // 토큰 재발급 실패시 로그인 페이지로 이동
        //        // localStorage.removeItem('accessToken');
        //       //  window.location.href = '/login';
        //         return Promise.reject(refreshError);
        //     }
        // }

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

//,
//     async (error) => {
//         const originalRequest = error.config;
//         const { resultCode, msg, data } = error.response.data;
//         const statusCode = parseInt(resultCode);
//         if (import.meta.env.DEV) {
//             console.log(msg);
//         }
//         // 401 에러이고 refreshToken이 존재할 경우 토큰 재발급 시도
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const response = await refreshApiClient.post('/member/refresh');
//                 const { accessToken } = response.headers["authorization"];

//                 localStorage.setItem('accessToken', accessToken);
//                 originalRequest.headers[
//                     'authorization'
//                 ] = `${accessToken}`;

//                 return apiClient(originalRequest);
//             } catch (refreshError) {
//                 // 토큰 재발급 실패시 로그인 페이지로 이동
//                // localStorage.removeItem('accessToken');
//               //  window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     },

export default apiClient;
