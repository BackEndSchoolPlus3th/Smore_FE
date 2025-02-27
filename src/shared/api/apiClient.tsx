import axios from 'axios';

const apiClient = axios.create({
    baseURL:  'http://localhost:8090/api',
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
    (error) => {
        return Promise.reject(error);
    }
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

        // 성공인 경우 data만 반환하여 이후 then()에서 바로 사용 가능
        return data;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
