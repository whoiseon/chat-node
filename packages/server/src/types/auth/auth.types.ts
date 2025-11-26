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

export interface AuthResponse {
  userId: string;
  username: string;
}

export type RefreshBody = {
  accessToken: string;
  refreshToken: string;
};

export enum TokenErrorCode {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  REFRESH_TOKEN_NOT_FOUND = 'REFRESH_TOKEN_NOT_FOUND',
  REFRESH_TOKEN_USED = 'REFRESH_TOKEN_USED',
}

export class TokenError extends Error {
  constructor(public code: TokenErrorCode, message: string) {
    super(message);
    this.name = 'TokenError';
  }
}
