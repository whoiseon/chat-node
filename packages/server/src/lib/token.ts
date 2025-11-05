import jwt, { SignOptions } from 'jsonwebtoken';
import { Context, Middleware, Next } from 'koa';

import { db } from '@/database';
import { AuthService } from '@/services/auth.service';

const { SECRET_KEY } = process.env;

// 시크릿 키가 없고 개발 환경인 경우 에러 발생
if (!SECRET_KEY && process.env.NODE_ENV === 'development') {
  // prisma:generate 명령어가 아닌 경우 에러 발생
  const error = new Error('InvalidSecretKeyError');
  error.message = 'Secret key for JWT is missing.';

  // prisma:generate 명령어가 아닌 경우 에러 발생
  if (process.env.npm_lifecycle_event !== 'prisma:generate') throw error;
}

export const generateToken = async (
  payload: any,
  options?: SignOptions
): Promise<string> => {
  // 기본 jwt 옵션
  const jwtOptions: SignOptions = {
    expiresIn: '7d',
    ...options,
  };

  if (!jwtOptions.expiresIn) {
    // expiresIn이 주어지지 않은 경우 제거
    delete jwtOptions.expiresIn;
  }

  return new Promise<string>((resolve, reject) => {
    if (!SECRET_KEY) return;

    jwt.sign(payload, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(token as string);
    });
  });
};

export const decodeToken = async <T = any>(token: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    if (!SECRET_KEY) return;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as T);
    });
  });
};

export function setTokenCookie(
  ctx: Context,
  tokens: { accessToken: string; refreshToken: string }
) {
  // set cookie
  ctx.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
  });

  ctx.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}

export function resetTokenCookie(ctx: Context) {
  ctx.cookies.set('access_token', '', {
    maxAge: 0,
  });
  ctx.cookies.set('refresh_token', '', {
    maxAge: 0,
  });
}

export const refresh = async (ctx: Context, refreshToken: string) => {
  const authService = new AuthService();
  const prisma = db.getPrisma();
  try {
    const decoded = await decodeToken<RefreshTokenData>(refreshToken);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.user_id,
      },
    });

    if (!user) {
      const error = new Error('유저를 찾을 수 없습니다');
      throw error;
    }
    const tokens = await authService.refreshUserToken(
      decoded.user_id,
      decoded.token_id,
      decoded.exp,
      refreshToken
    );
    setTokenCookie(ctx, tokens);
    return decoded.user_id;
  } catch (e) {
    throw e;
  }
};

export const consumeUser: Middleware = async (ctx: Context, next: Next) => {
  if (ctx.path.includes('/auth/logout')) return next(); // ignore when logging out

  let accessToken: string | undefined = ctx.cookies.get('access_token');

  const refreshToken: string | undefined = ctx.cookies.get('refresh_token');

  const { authorization } = ctx.request.headers;

  if (!accessToken && authorization) {
    accessToken = authorization.split(' ')[1];
  }

  try {
    if (!accessToken) {
      throw new Error('토큰이 없습니다');
    }
    const accessTokenData = await decodeToken<AccessTokenData>(accessToken);

    ctx.state.user_id = accessTokenData.user_id;
    // 액세스 토큰 만료 시간이 30분 이하일 때 리프레시 토큰 갱신
    const diff = accessTokenData.exp * 1000 - new Date().getTime();
    if (diff < 1000 * 60 * 30 && refreshToken) {
      await refresh(ctx, refreshToken);
    }
  } catch (e) {
    // 토큰이 유효하지 않습니다! 리프레시 토큰 갱신...
    if (!refreshToken) return next();
    try {
      const userId = await refresh(ctx, refreshToken);
      // 성공하면 user_id 설정
      ctx.state.user_id = userId;
    } catch (e) {}
  }

  return next();
};

type TokenData = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
};

type AccessTokenData = {
  user_id: string;
} & TokenData;

type RefreshTokenData = {
  user_id: string;
  token_id: string;
} & TokenData;
