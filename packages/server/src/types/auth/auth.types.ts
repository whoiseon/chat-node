import { z } from 'zod';

import { signUpSchema, logInSchema } from './auth.schema';

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LogInInput = z.infer<typeof logInSchema>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthBody {
  userId: string;
  username: string;
  tokens: AuthTokens;
}

export type RefreshBody = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthResponse {
  dailyLoginBonus: DailyLoginBonus;
}

export interface DailyLoginBonus {
  isGiven: boolean;
  amount: number;
}
