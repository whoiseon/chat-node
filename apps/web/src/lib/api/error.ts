import { AxiosError } from 'axios';

import { ApiError } from './types';

export function extractError<T = null>(error: unknown): ApiError<T> {
  if (error instanceof AxiosError) {
    return error.response?.data as ApiError<T>;
  }

  return {
    error: {
      message: '서버 에러 발생.',
      status: 500,
    },
    payload: null as T,
  };
}
