import { Context, Middleware, Next } from 'koa';
import { verifyToken, setAuthCookies, clearAuthCookies } from '@/lib/token';
import { AuthService } from '@/routes/api/v1/auth/auth.service';
import { generateResponseBody } from '../utils';

type AccessPayload = { type: 'access'; userId: string };
type RefreshPayload = { type: 'refresh'; userId: string; tokenId: string };

const authService = new AuthService();

/**
 * 토큰에서 유저 정보를 추출하여 ctx.state.user에 저장하는 미들웨어
 * 토큰이 없거나 유효하지 않아도 에러를 발생시키지 않고 통과시킴 (로그인 선택적 허용)
 * Access Token 만료 시 Refresh Token으로 자동 갱신 시도
 */
export const extractUser: Middleware = async (ctx: Context, next: Next) => {
  let accessToken = ctx.cookies.get('access_token');
  const refreshToken = ctx.cookies.get('refresh_token');

  // Authorization 헤더 지원
  if (!accessToken && ctx.request.headers.authorization) {
    const [scheme, token] = ctx.request.headers.authorization.split(' ');
    if (scheme === 'Bearer' && token) {
      accessToken = token;
    }
  }

  // 1. Access Token 검증
  if (accessToken) {
    try {
      const payload = verifyToken<AccessPayload>(accessToken);
      if (payload.type === 'access') {
        ctx.state.userId = payload.userId;
        return next();
      }
    } catch (e) {
      // Access Token 만료/오류 시 Refresh Token 시도로 넘어감
    }
  }

  // 2. Refresh Token으로 갱신 시도
  if (refreshToken) {
    try {
      const payload = verifyToken<RefreshPayload>(refreshToken);
      if (payload.type === 'refresh') {
        const tokens = await authService.rotateRefreshToken(
          payload.userId,
          payload.tokenId
        );

        setAuthCookies(ctx, {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });

        ctx.state.userId = tokens.userId;
        return next();
      }
    } catch (e) {
      // Refresh Token 실패 시 쿠키 정리 (로그아웃 처리)
      clearAuthCookies(ctx);
    }
  }

  return next();
};

/**
 * 로그인이 필요한 라우트에 사용하는 미들웨어
 * ctx.state.userId가 없으면 401 에러 발생
 */
export const requireAuth: Middleware = async (ctx: Context, next: Next) => {
  if (!ctx.state.userId) {
    ctx.status = 401;
    ctx.body = generateResponseBody(false, '인증 정보가 없습니다.');
    return;
  }
  return next();
};
