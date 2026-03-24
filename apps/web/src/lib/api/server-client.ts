import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

/**
 * 서버사이드용 Axios 인스턴스 생성
 * 미들웨어에서 토큰 갱신이 완료되므로 별도 refresh 로직 불필요
 */
export function createServerApiClient(cookie?: string): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie && { Cookie: cookie }),
    },
  });
}

/**
 * 서버사이드용 API 요청 헬퍼 함수들
 */
export const serverApi = {
  get: async <T = unknown>(
    url: string,
    cookie?: string,
    config?: AxiosRequestConfig,
  ) => {
    const client = createServerApiClient(cookie);
    const response = await client.get<T>(url, config);
    return response.data;
  },

  post: async <T = unknown>(
    url: string,
    data?: unknown,
    cookie?: string,
    config?: AxiosRequestConfig,
  ) => {
    const client = createServerApiClient(cookie);
    const response = await client.post<T>(url, data, config);
    return response.data;
  },

  put: async <T = unknown>(
    url: string,
    data?: unknown,
    cookie?: string,
    config?: AxiosRequestConfig,
  ) => {
    const client = createServerApiClient(cookie);
    const response = await client.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T = unknown>(
    url: string,
    data?: unknown,
    cookie?: string,
    config?: AxiosRequestConfig,
  ) => {
    const client = createServerApiClient(cookie);
    const response = await client.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T = unknown>(
    url: string,
    cookie?: string,
    config?: AxiosRequestConfig,
  ) => {
    const client = createServerApiClient(cookie);
    const response = await client.delete<T>(url, config);
    return response.data;
  },
};
