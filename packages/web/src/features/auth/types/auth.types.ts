/**
 * 토큰 타입
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 로그인 요청 타입
 */
export interface AuthRequest {
  username: string;
  password: string;
}

/**
 * 인증 응답 타입
 */
export interface AuthResponse {
  userId: string;
  username: string;
  tokens: AuthTokens;
}

/**
 * 유저 정보 응답 타입
 */
export interface UserInfoResponse {
  userId: string;
  username: string;
}
