import axios from 'axios';

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
    (response) => {
        // 서버 응답 객체에서 resultCode, msg, data를 구조 분해로 추출
        const { resultCode, msg, data } = response.data;
        const statusCode = parseInt(resultCode);

        // 개발 환경인 경우에만 서버에서 보낸 메시지를 콘솔에 출력
        if (import.meta.env.DEV) {
            console.log(msg);
        }

        // 에러 코드(400 이상)인 경우, msg를 포함하여 에러 처리
        if (statusCode >= 400) {
            return Promise.reject(new Error(msg));
        }

        // 성공인 경우 code와 data를 함께 반환
        response.data = { code: statusCode, msg, data };
        return response.data;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
