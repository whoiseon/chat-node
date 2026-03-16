export interface UserResponse {
  userId: string;
  username: string;
  mainNodeConId: string | null;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
