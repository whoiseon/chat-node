/**
 * 유저 정보 응답 타입
 */
export interface UserResponse {
  userId: string;
  username: string;
  mainNodeConId: string;
  role: UserRole;
}

export type UserRole = 'user' | 'admin';

export interface UserNpResponse {
  userId: string;
  np: number;
}