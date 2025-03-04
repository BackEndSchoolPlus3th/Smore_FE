import axios from 'axios';

const getCookie = (name: string) => {
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
refreshApiClient.interceptors.request.use(
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
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 refreshToken이 존재할 경우 토큰 재발급 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const presentAccessToken = localStorage.getItem('accessToken');
                // const presentRefreshToken = getCookie('refreshToken');
                const response = await axios.post(
                    'http://localhost:8090/api/member/refresh',
                    {
                        presentAccessToken,
                    },
                    {
                        withCredentials: true, // 쿠키 포함
                    }
                );
                const accessToken = response.headers['authorization'];
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                }
                console.log(response);
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers['Authorization'] =
                    `Bearer ${accessToken}`;

                return refreshApiClient(originalRequest);
            } catch (refreshError) {
                // 토큰 재발급 실패시 로그인 페이지로 이동
                localStorage.removeItem('accessToken');
                //window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
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
