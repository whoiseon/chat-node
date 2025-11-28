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
 * 로그인 응답 타입
 */
export interface AuthResponse {
  dailyLoginBonus: DailyLoginBonus;
}

/**
 * 일일 로그인 보너스 타입
 */
export interface DailyLoginBonus {
  isGiven: boolean;
  amount: number;
}
