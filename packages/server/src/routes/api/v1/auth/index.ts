import Router from '@koa/router';

import { setTokenCookie } from '@/lib/token';
import { extractErrorMessage, validateBody } from '@/lib/utils';
import { AuthService } from '@/services/auth.service';
import {
  AuthBody,
  SignUpInput,
  LogInInput,
  signUpSchema,
  logInSchema,
  ApiError,
  ApiResponse,
} from '@/types';

const auth = new Router();
const authService = new AuthService();

/**
 * 회원가입
 */
auth.post('/signup', async (ctx) => {
  try {
    if (!validateBody(ctx, signUpSchema)) return;

    const { username, password } = ctx.request.body as SignUpInput;

    const result = await authService.register({ username, password });

    setTokenCookie(ctx, {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });

    const response: ApiResponse<AuthBody> = {
      success: true,
      message: '',
      payload: {
        userId: result.userId,
        username: result.username,
        tokens: result.tokens,
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

    const result: AuthBody = await authService.signIn({ username, password });

    setTokenCookie(ctx, {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });

    const response: ApiResponse<AuthBody> = {
      success: true,
      message: '',
      payload: {
        userId: result.userId,
        username: result.username,
        tokens: result.tokens,
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
 * 테스트
 */
auth.get('/me', async (ctx) => {
  try {
    ctx.body = {
      success: true,
      message: '',
      payload: {
        userId: ctx.state.user_id,
      },
    };
  } catch (error: unknown) {
    console.error(error);
  }
});

export default auth;
