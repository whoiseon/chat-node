/**
 * 유저 정보 응답 타입
 */
export interface UserResponse {
  userId: string;
  username: string;
  np: number;
  mainNodeConId: string;
  role: UserRole;
}

export type UserRole = 'user' | 'admin';
