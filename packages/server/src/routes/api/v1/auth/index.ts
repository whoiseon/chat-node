import Router from '@koa/router';

import { clearAuthCookies, setAuthCookies } from '@/lib/token';
import { generateResponseBody, validateBody } from '@/lib/utils';
import { requireAuth } from '@/lib/middlewares/auth';

import { AuthService } from '@/services/auth.service';
import { NpService } from '@/services/np.service';

import { AuthBody, SignUpInput, LogInInput, AuthResponse } from './auth.types';
import { signUpSchema, logInSchema } from './auth.schema';

const auth = new Router();

const authService = new AuthService();
const npService = new NpService();

/**
 * 회원가입
 */
auth.post('/signup', async (ctx) => {
  if (!validateBody(ctx, signUpSchema)) return;

  const { username, password } = ctx.request.body as SignUpInput;

  // 회원가입
  const authBody = await authService.register({ username, password });

  // 회원가입 가입 보너스 지급
  await npService.signUpNpBonus(authBody.userId).catch((error) => {
    console.error('[Auth.signup] 회원가입 보너스 지급 중 오류 발생:', error);
  });

  // 토큰 쿠키 설정
  setAuthCookies(ctx, {
    accessToken: authBody.tokens.accessToken,
    refreshToken: authBody.tokens.refreshToken,
  });

  const dailyLoginBonus = await npService
    .checkAndGiveDailyLoginBonus(authBody.userId)
    .catch((error) => {
      console.error(
        '[Auth.signup] 일일 로그인 보너스 지급 중 오류 발생:',
        error
      );
    });

  // 마지막 로그인 시간 업데이트
  await authService.updateLastLoginAt(authBody.userId);

  ctx.body = generateResponseBody<AuthResponse>(true, '', {
    dailyLoginBonus: {
      isGiven: dailyLoginBonus?.isGiven ?? false,
      amount: dailyLoginBonus?.amount ?? 0,
    },
  });
});

/**
 * 로그인
 */
auth.post('/login', async (ctx) => {
  if (!validateBody(ctx, logInSchema)) return;

  const { username, password } = ctx.request.body as LogInInput;

  // 로그인
  const authBody: AuthBody = await authService.logIn({ username, password });

  // 토큰 쿠키 설정
  setAuthCookies(ctx, {
    accessToken: authBody.tokens.accessToken,
    refreshToken: authBody.tokens.refreshToken,
  });

  // 일일 로그인 보너스 지급
  const dailyLoginBonus = await npService
    .checkAndGiveDailyLoginBonus(authBody.userId)
    .catch((error) => {
      console.error(
        '[Auth.login] 일일 로그인 보너스 지급 중 오류 발생:',
        error
      );
    });

  // 마지막 로그인 시간 업데이트
  await authService.updateLastLoginAt(authBody.userId);

  ctx.body = generateResponseBody<AuthResponse>(true, '', {
    dailyLoginBonus: {
      isGiven: dailyLoginBonus?.isGiven ?? false,
      amount: dailyLoginBonus?.amount ?? 0,
    },
  });
});

/**
 * 로그아웃
 */
auth.post('/logout', requireAuth, async (ctx) => {
  const userId = ctx.state.userId;

  if (userId) {
    await authService.revokeAll(userId);
  }

  clearAuthCookies(ctx);

  ctx.body = generateResponseBody(true, '');
});

export default auth;
