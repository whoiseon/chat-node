/**
 * API 응답 타입 정의
 */
export interface ApiResponse<T> {
  error: {
    message: string;
    status: number;
  } | null;
  payload: T;
}

export type ApiError<T = null> = ApiResponse<T>;

/**
 * 페이지네이션 공통 타입
 */
export interface Pagination {
  total: number;
  page: number;
  has_more: boolean;
}

/**
 * 공통 Order 타입
 */
export type Order = 'asc' | 'desc';

/**
 * Axios Request Config 확장
 */
export interface RequestConfig {
  skipAuth?: boolean; // 인증 토큰을 건너뛸지 여부
  skipErrorHandler?: boolean; // 전역 에러 핸들러를 건너뛸지 여부
}
