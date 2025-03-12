// fileUploadApiClient.ts
import axios from 'axios';

/**
 * 쿠키에서 특정 이름의 값을 가져오는 헬퍼 함수
 * @param name - 쿠키 이름
 * @returns 쿠키 값 또는 undefined
 */
const getCookie = (name: string): string | undefined => {
    const matches = document.cookie.match(
        new RegExp(
            '(?:^|; )' +
                name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
                '=([^;]*)'
        )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * 파일 업로드 전용 axios 인스턴스
 * - 기본 baseURL은 환경변수를 통해 설정 (백엔드 API 엔드포인트)
 * - withCredentials 옵션을 true로 설정하여 쿠키를 포함시킴
 * - 기본 Content-Type 헤더는 지정하지 않음(요청마다 필요에 따라 설정)
 */
const fileUploadApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

/**
 * 요청 인터셉터: JWT 토큰을 헤더에 포함하여 인증/인가 처리
 */
fileUploadApiClient.interceptors.request.use(
    (config) => {
        // 로컬스토리지에서 accessToken 가져오기
        const accessToken = localStorage.getItem('accessToken');
        // 쿠키에서 refreshToken 가져오기
        const refreshToken = getCookie('refreshToken');

        // accessToken이 존재하면 Authorization 헤더에 추가
        if (accessToken) {
            config.headers['authorization'] = `${accessToken}`;
        }
        // refreshToken이 존재하면 필요에 따라 헤더에 추가 (서버 정책에 따라 다름)
        if (refreshToken) {
            config.headers['Set-Cookie'] = `${refreshToken}`;
        }
        // 디버그용 로그 출력
        console.log('파일 업로드 요청 헤더:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 응답 인터셉터: 새로 발급된 토큰이 있다면 로컬스토리지 갱신 및 재시도 로직 처리
 */
fileUploadApiClient.interceptors.response.use(
    (response) => {
        // 응답 헤더에 새로운 accessToken이 포함되어 있다면 갱신
        const newAccessToken = response.headers['authorization'];
        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // 401 에러 발생 시 토큰 재발급 시도 (한 번만 재시도하도록 _retry 플래그 사용)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const presentAccessToken = localStorage.getItem('accessToken');
                // 토큰 재발급 엔드포인트 호출 (필요 시 경로 및 요청 데이터 수정)
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/member/refresh`,
                    { presentAccessToken },
                    { withCredentials: true }
                );
                const newAccessToken = response.headers['authorization'];
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                }
                // 재요청 시 헤더에 새로운 토큰 적용
                originalRequest.headers['authorization'] = `${newAccessToken}`;
                return fileUploadApiClient(originalRequest);
            } catch (refreshError) {
                // 토큰 재발급 실패 시 accessToken 삭제 및 로그인 페이지로 리다이렉트(필요 시)
                localStorage.removeItem('accessToken');
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        // 403 (권한 없음) 에러 처리: 메인 페이지로 이동 후 경고 메시지 출력
        if (error.response?.status === 403) {
            window.location.href = '/';
            alert('접근 권한이 없습니다.');
        }
        return Promise.reject(error);
    }
);

export default fileUploadApiClient;
