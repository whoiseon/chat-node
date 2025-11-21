import Router from '@koa/router';

import { refresh, resetTokenCookie, setTokenCookie } from '@/lib/token';
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
} from '@/types';

import { AuthService } from '@/services/auth.service';

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

    const result: AuthBody = await authService.logIn({ username, password });

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
 * 리프레시
 */
auth.post('/refresh', async (ctx) => {
  try {
    const refreshToken = ctx.cookies.get('refresh_token');

    if (!refreshToken) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: '리프레시 토큰이 없습니다',
        code: TokenErrorCode.REFRESH_TOKEN_NOT_FOUND,
      };
      return;
    }

    const result = await refresh(ctx, refreshToken);

    setTokenCookie(ctx, {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });

    ctx.body = {
      success: true,
      message: '',
      payload: null,
    };
  } catch (error) {
    if (error instanceof TokenError) {
      // Token Rotation 위반 감지 시 모든 토큰 무효화
      if (error.code === TokenErrorCode.REFRESH_TOKEN_USED) {
        resetTokenCookie(ctx);

        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '보안 위반이 감지되었습니다. 다시 로그인해주세요.',
          code: error.code,
        };
        return;
      }

      ctx.status = 401;
      ctx.body = {
        success: false,
        message: error.message,
        code: error.code,
      };
      return;
    }

    ctx.status = 400;
    ctx.body = {
      success: false,
      message: extractErrorMessage(error),
    };
  }
});

/**
 * 로그아웃
 */
auth.post('/logout', async (ctx) => {
  try {
    const userId = ctx.state.user_id;

    if (userId) {
      // 모든 토큰 무효화
      await authService.revokeAllTokens(userId);
    }

    resetTokenCookie(ctx);

    ctx.body = {
      success: true,
      message: '',
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: extractErrorMessage(error),
    };
  }
});

/**
 * 테스트
 */
auth.get('/me', async (ctx) => {
  try {
    const user = await authService.findUser(ctx.state.user_id, 'userId', {
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
