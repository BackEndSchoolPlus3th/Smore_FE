// import axios from 'axios';

// const getCookie = (name: string) => {
//     const matches = document.cookie.match(
//         new RegExp(
//             '(?:^|; )' +
//                 name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
//                 '=([^;]*)'
//         )
//     );
//     return matches ? decodeURIComponent(matches[1]) : undefined;
// };

// const apiClient = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withCredentials: true,
// });

// const refreshApiClient = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withCredentials: true,
// });

// apiClient.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem('accessToken');
//         const refreshToken = getCookie('refreshToken');
//         if (accessToken) {
//             config.headers['authorization'] = `${accessToken}`;
//         }
//         if (refreshToken) {
//             config.headers['Set-Cookie'] = `${refreshToken}`;
//         }
//         console.log('config::::', config.headers['authorization']);
//         console.log('refreshToken::::', config.headers['Set-Cookie']);
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
// refreshApiClient.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem('accessToken');
//         const refreshToken = getCookie('refreshToken');
//         if (accessToken) {
//             config.headers['authorization'] = `${accessToken}`;
//         }
//         if (refreshToken) {
//             config.headers['Set-Cookie'] = `${refreshToken}`;
//         }
//         console.log('config::::', config.headers['authorization']);
//         console.log('refreshToken::::', config.headers['Set-Cookie']);
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
// apiClient.interceptors.response.use(
//     (response) => {
//         const accessToken = response.headers['authorization'];
//         if (accessToken) {
//             localStorage.setItem('accessToken', accessToken);
//         }

//         if (import.meta.env.DEV) {
//             console.log('response::::', response);
//             console.log('data::::', response.data);
//         }
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         if (import.meta.env.DEV) {
//             console.error('error::::', error);
//             console.error('error.response::::', error.response);
//         }

//         // 401 에러이고 refreshToken이 존재할 경우 토큰 재발급 시도
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const presentAccessToken = localStorage.getItem('accessToken');
//                 // const presentRefreshToken = getCookie('refreshToken');
//                 const response = await axios.post(
//                     'http://localhost:8090/api/member/refresh',
//                     {
//                         presentAccessToken,
//                     },
//                     {
//                         withCredentials: true, // 쿠키 포함
//                     }
//                 );
//                 const accessToken = response.headers['authorization'];
//                 if (accessToken) {
//                     localStorage.setItem('accessToken', accessToken);
//                 }
//                 console.log(response);
//                 localStorage.setItem('accessToken', accessToken);

//                 originalRequest.headers['Authorization'] =
//                     `Bearer ${accessToken}`;

//                 return refreshApiClient(originalRequest);
//             } catch (refreshError) {
//                 // 토큰 재발급 실패시 로그인 페이지로 이동
//                 localStorage.removeItem('accessToken');
//                 //window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             }
//         } else if (error.response?.status === 409) {
//             // 중복 에러 발생 시 에러 메시지 반환
//             return error;
//         }

//         return Promise.reject(error);
//     }
// );

// export default apiClient;

import axios from 'axios';

// 쿠키에서 특정 값 가져오는 함수
const getCookie = (name: string) => {
    const matches = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return matches ? decodeURIComponent(matches[2]) : null;
};

// Axios 클라이언트 생성
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, //  쿠키 자동 포함
});

// 요청 인터셉터 (Access Token & Refresh Token 자동 추가)
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = getCookie('refreshToken'); // 쿠키에서 Refresh Token 가져오기

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers['Set-Cookie'] = `refreshToken=${refreshToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 (Access Token 자동 갱신)
apiClient.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log('response::::', response);
        }

        const newAccessToken = response.headers['authorization'];
        if (newAccessToken) {
            const token = newAccessToken.startsWith('Bearer ')
                ? newAccessToken.substring(7).trim()
                : newAccessToken;
            localStorage.setItem('accessToken', token);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getCookie('refreshToken');
                if (!refreshToken) {
                    console.error('❌ Refresh Token 없음. 다시 로그인 필요!');
                    return Promise.reject(error);
                }

                const response = await axios.post(
                    import.meta.env.VITE_API_BASE_URL + '/api/auth/refresh',
                    { refreshToken },
                    { withCredentials: true }
                );

                const newAccessToken = response.headers['authorization'];
                if (newAccessToken) {
                    const token = newAccessToken.startsWith('Bearer ')
                        ? newAccessToken.substring(7).trim()
                        : newAccessToken;
                    localStorage.setItem('accessToken', token);
                    originalRequest.headers['Authorization'] =
                        `Bearer ${token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error(
                    '❌ Refresh Token 만료됨! 다시 로그인하세요.',
                    refreshError
                );
                localStorage.removeItem('accessToken');
                return Promise.reject(refreshError);
            }

            // 403 에러 처리: 접근 권한 없음
            if (error.response?.status === 403) {
                // 메인 페이지로 강제 이동
                window.location.href = '/';
                // 리다이렉트가 동작하지 않는 경우 alert 창 표시
                alert('접근 권한이 없습니다.');
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
