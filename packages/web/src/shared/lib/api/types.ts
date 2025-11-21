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

export enum TokenErrorCode {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
  REFRESH_TOKEN_USED = 'REFRESH_TOKEN_USED',
}

export type TokenErrorResponse = ApiResponse<null> & {
  code: TokenErrorCode;
};
