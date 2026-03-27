import { extractError } from '@repo/api-types';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

/**
 * Axios 인스턴스 생성
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // Request Interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          {
            params: config.params,
            data: config.data,
          },
        );
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response Interceptor — 401 시 refresh 후 재요청
  let isRefreshing = false;
  let refreshSubscribers: ((ok: boolean) => void)[] = [];

  const onRefreshDone = (ok: boolean) => {
    refreshSubscribers.forEach((cb) => cb(ok));
    refreshSubscribers = [];
  };

  client.interceptors.response.use(
    (response) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
          response.data,
        );
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      const errorResponse = extractError<{
        field: 'access_token' | 'refresh_token';
      }>(error);
      const errorField = errorResponse?.payload?.field;

      // access_token 만료로 인한 401만 refresh 시도
      // /auth/me는 refresh 후 재요청 허용 (로그인 상태 확인용)
      // /auth/refresh, /auth/sign-in 등은 제외 (무한 루프 방지)
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/') &&
        !originalRequest.url?.includes('/auth/me');

      if (
        error.response?.status !== 401 ||
        errorField !== 'access_token' ||
        originalRequest._retry ||
        isAuthEndpoint
      ) {
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          await client.post('/auth/refresh');
          isRefreshing = false;
          onRefreshDone(true);
          return client(originalRequest);
        } catch {
          isRefreshing = false;
          onRefreshDone(false);

          return Promise.reject(error);
        }
      }

      return new Promise((resolve, reject) => {
        refreshSubscribers.push((ok: boolean) => {
          if (ok) {
            originalRequest._retry = true;
            resolve(client(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    },
  );

  return client;
};

/**
 * API 클라이언트 인스턴스
 */
export const apiClient = createApiClient();

/**
 * API 요청 헬퍼 함수들
 */
export const api = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};
