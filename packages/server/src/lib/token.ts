import 'dotenv/config';
import jwt, {
  JsonWebTokenError,
  SignOptions,
  TokenExpiredError,
} from 'jsonwebtoken';
import { Context } from 'koa';

import { TokenError } from '@/lib/middlewares/error';

const { JWT_SECRET } = process.env;

type AccessPayload = {
  type: 'access';
  userId: string;
};

type RefreshPayload = {
  type: 'refresh';
  userId: string;
  tokenId: string;
};

const ACCESS_EXPIRES_IN = '1h';
// const ACCESS_EXPIRES_IN = '10s';
const REFRESH_EXPIRES_IN = '7d';
// const REFRESH_EXPIRES_IN = '30s';

const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 60; // 1 hour
// const ACCESS_TOKEN_MAX_AGE = 1000 * 10; // 10 seconds
const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
// const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

export const signToken = <T extends AccessPayload | RefreshPayload>(
  payload: T,
  options?: SignOptions
) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is missing');
  return jwt.sign(payload, JWT_SECRET, { ...options });
};

export const verifyToken = <T>(token: string): T => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is missing');

  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      console.log('[verifyToken] 토큰 만료 에러 발생');
      throw new TokenError('토큰이 만료되었습니다');
    }
    if (e instanceof JsonWebTokenError) {
      console.log('[verifyToken] 토큰 형식/서명 에러 발생');
      throw new TokenError('토큰이 유효하지 않습니다');
    }
    console.error('[verifyToken] 예상치 못한 에러:', e);
    throw e;
  }
};

export const createAccessToken = (userId: string) =>
  signToken<AccessPayload>(
    { type: 'access', userId },
    { expiresIn: ACCESS_EXPIRES_IN }
  );

export const createRefreshToken = (userId: string, tokenId: string) =>
  signToken<RefreshPayload>(
    { type: 'refresh', userId, tokenId },
    { expiresIn: REFRESH_EXPIRES_IN }
  );

export const setAuthCookies = (
  ctx: Context,
  tokens: { accessToken: string; refreshToken: string }
) => {
  ctx.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  ctx.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

export const clearAuthCookies = (ctx: Context) => {
  ctx.cookies.set('access_token', '', { maxAge: 0 });
  ctx.cookies.set('refresh_token', '', { maxAge: 0 });
};
