import Router from '@koa/router';

import { clearAuthCookies, setAuthCookies } from '@/lib/token';
import { extractErrorMessage, validateBody } from '@/lib/utils';

import {
  AuthBody,
  SignUpInput,
  LogInInput,
  signUpSchema,
  logInSchema,
  ApiError,
  ApiResponse,
  TokenErrorCode,
  TokenError,
  AuthResponse,
} from '@/types';

import { AuthService } from '@/services/auth.service';

import { requireAuth } from '@/lib/middlewares/auth';

const auth = new Router();
const authService = new AuthService();

/**
 * 회원가입
 */
auth.post('/signup', async (ctx) => {
  try {
    if (!validateBody(ctx, signUpSchema)) return;

    const { username, password } = ctx.request.body as SignUpInput;

    const authBody = await authService.register({ username, password });

    setAuthCookies(ctx, {
      accessToken: authBody.tokens.accessToken,
      refreshToken: authBody.tokens.refreshToken,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: '',
      payload: {
        userId: authBody.userId,
        username: authBody.username,
      },
    };

    ctx.body = response;
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      message: extractErrorMessage(error),
    };

    ctx.status = 400;
    ctx.body = errorResponse;
  }
});

/**
 * 로그인
 */
auth.post('/login', async (ctx) => {
  try {
    if (!validateBody(ctx, logInSchema)) return;

    const { username, password } = ctx.request.body as LogInInput;

    const authBody: AuthBody = await authService.logIn({ username, password });

    setAuthCookies(ctx, {
      accessToken: authBody.tokens.accessToken,
      refreshToken: authBody.tokens.refreshToken,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      message: '',
      payload: {
        userId: authBody.userId,
        username: authBody.username,
      },
    };

    ctx.body = response;
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      message: extractErrorMessage(error),
    };

    ctx.status = 400;
    ctx.body = errorResponse;
  }
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

  ctx.body = {
    success: true,
    message: '',
  };
});

/**
 * 테스트
 */
/**
 * 테스트
 */
auth.get('/me', requireAuth, async (ctx) => {
  try {
    const userId = ctx.state.userId!;

    const user = await authService.findUser(userId, 'userId', {
      id: true,
      username: true,
    });

    if (!user) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: '찾을 수 없는 유저입니다.',
      };
      return;
    }

    ctx.body = {
      success: true,
      message: '',
      payload: {
        userId: user.id,
        username: user.username,
      },
    };
  } catch (error: unknown) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: extractErrorMessage(error),
    };
  }
});

export default auth;
