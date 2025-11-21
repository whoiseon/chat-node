import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenErrorCode, TokenErrorResponse } from './types';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

let refreshPromise: Promise<any> | null = null;

/**
 * 토큰 갱신 함수
 */
async function handleRefreshToken(): Promise<void> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      console.log('토큰 리프레시 성공!!');
      console.log('✅ Token refreshed successfully');
      return response.data;
    })
    .catch((error) => {
      console.log('토큰 리프레시 실패!!');
      console.error('❌ Token refresh failed:', error);
      throw error;
    })
    .finally(() => {
      // 갱신 완료 후 캐시 초기화 (300ms 후)
      setTimeout(() => {
        refreshPromise = null;
      }, 300);
    });

  return refreshPromise;
}

/**
 * 로그아웃 처리
 */
async function handleLogout(): Promise<void> {
  await axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    )
    .then(() => {
      console.log('🔄 Logout successful');
    });
}

/**
 * Response Interceptor: 401 에러 시 자동 토큰 갱신
 */
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<TokenErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고, 아직 재시도하지 않은 요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorCode = error.response?.data?.code;

      // Refresh 엔드포인트 자체의 에러면 로그아웃
      if (originalRequest.url?.includes('/auth/refresh')) {
        console.error('🚨 Refresh token is invalid');
        await handleLogout();
        return Promise.reject(error);
      }

      // 토큰이 만료된 경우만 갱신 시도
      if (errorCode === TokenErrorCode.TOKEN_EXPIRED) {
        originalRequest._retry = true;

        try {
          // 토큰 갱신 시도
          await handleRefreshToken();

          // 원래 요청 재시도
          console.log('🔄 Retrying original request:', originalRequest.url);
          return client(originalRequest);
        } catch (refreshError) {
          // 갱신 실패 시 로그아웃
          console.error('🚨 Refresh failed, logging out');
          await handleLogout();
          return Promise.reject(refreshError);
        }
      }

      // 보안 위반 ( 토큰 재사용 등 ) 감지 시 즉시 로그아웃
      if (errorCode === TokenErrorCode.REFRESH_TOKEN_USED) {
        console.error('🚨 Security violation detected');
        await handleLogout();
        return Promise.reject(error);
      }

      // 기타 인증 에러는 라그아웃
      if (
        errorCode === TokenErrorCode.TOKEN_INVALID ||
        errorCode === TokenErrorCode.REFRESH_TOKEN_INVALID ||
        errorCode === TokenErrorCode.REFRESH_TOKEN_EXPIRED
      ) {
        await handleLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
