import jwt, {
  JsonWebTokenError,
  SignOptions,
  TokenExpiredError,
} from 'jsonwebtoken';
import { Context, Middleware, Next } from 'koa';

import { AuthService } from '@/services/auth.service';
import { TokenError, TokenErrorCode } from '@/types';
import { prisma } from '@/database';

const { SECRET_KEY } = process.env;

const ACCESS_TOKEN_MAX_AGE = 1000 * 10; // 10 seconds
// const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 60; // 1 hour
const REFRESH_TOKEN_MAX_AGE = 1000 * 30; // 30 seconds
// const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

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

/**
 * 토큰 디코드
 */
export const decodeToken = async <T = any>(token: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    if (!SECRET_KEY) {
      reject(
        new TokenError(TokenErrorCode.TOKEN_INVALID, 'Secret key is missing')
      );
      return;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          reject(
            new TokenError(
              TokenErrorCode.TOKEN_EXPIRED,
              '토큰이 만료되었습니다'
            )
          );
        } else if (err instanceof JsonWebTokenError) {
          reject(
            new TokenError(
              TokenErrorCode.TOKEN_INVALID,
              '유효하지 않은 토큰입니다'
            )
          );
        } else {
          reject(err);
        }
        return;
      }
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
    maxAge: ACCESS_TOKEN_MAX_AGE, // 10 seconds
  });

  ctx.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_TOKEN_MAX_AGE, // 30 seconds
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

/**
 * Refresh 토큰으로 새 토큰 발급
 */
export const refresh = async (ctx: Context, refreshToken: string) => {
  const startTime = Date.now();
  const authService = new AuthService();

  try {
    const decoded = await decodeToken<RefreshTokenData>(refreshToken);

    console.log(
      `[Token Refresh] User: ${decoded.user_id}, Token ID: ${decoded.token_id}`
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.user_id },
    });

    if (!user) {
      throw new TokenError(
        TokenErrorCode.REFRESH_TOKEN_INVALID,
        '유저를 찾을 수 없습니다'
      );
    }

    const tokens = await authService.refreshUserToken(
      decoded.user_id,
      decoded.token_id,
      decoded.exp,
      refreshToken
    );

    setTokenCookie(ctx, tokens);

    const duration = Date.now() - startTime;
    console.log(`[Token Refresh] Success in ${duration}ms`);

    return { userId: decoded.user_id, tokens };
  } catch (e) {
    const duration = Date.now() - startTime;
    console.error(`[Token Refresh] Failed in ${duration}ms:`, e);

    if (e instanceof TokenError) {
      throw e;
    }
    throw new TokenError(
      TokenErrorCode.REFRESH_TOKEN_INVALID,
      '리프레시 토큰 갱신에 실패했습니다'
    );
  }
};

/**
 * consumeUser 미들웨어
 */
export const consumeUser: Middleware = async (ctx: Context, next: Next) => {
  // 1. 로그아웃, 리프레시 엔드포인트는 스킵
  const publicPaths = [
    '/auth/logout',
    '/auth/refresh',
    '/auth/login',
    '/auth/signup',
  ];
  if (publicPaths.some((path) => ctx.path.includes(path))) {
    return next();
  }

  let accessToken: string | undefined = ctx.cookies.get('access_token');
  const { authorization } = ctx.request.headers;

  // 2. 쿠키 또는 Authorization 헤더에서 토큰 추출
  if (!accessToken && authorization) {
    const parts = authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      accessToken = parts[1];
    }
  }

  // 3. 토큰 검증
  try {
    if (!accessToken) {
      throw new TokenError(
        TokenErrorCode.TOKEN_NOT_FOUND,
        '인증 토큰이 없습니다'
      );
    }

    const accessTokenData = await decodeToken<AccessTokenData>(accessToken);
    ctx.state.user_id = accessTokenData.user_id;

    return next();
  } catch (e) {
    if (e instanceof TokenError) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: e.message,
        code: e.code,
      };
      return;
    }

    // 예기치 않은 에러
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: '인증에 실패했습니다',
      code: TokenErrorCode.TOKEN_INVALID,
    };
  }
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
