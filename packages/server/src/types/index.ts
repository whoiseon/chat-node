export * from './auth';
export * from './user';

// API 공통 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  payload?: T;
}

export interface ApiError {
  success: false;
  message: string;
}
