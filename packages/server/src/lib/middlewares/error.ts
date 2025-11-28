import { Middleware } from 'koa';
import { generateResponseBody } from '../utils';

export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessError';
  }
}

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // Token Error -> 401
    if (error instanceof TokenError) {
      ctx.status = 401;
      ctx.body = generateResponseBody(false, error.message);
      return;
    }

    // Business Error -> 200
    if (error instanceof BusinessError) {
      ctx.status = 200;
      ctx.body = generateResponseBody(false, error.message);
      return;
    }

    // Default Error -> 500
    ctx.status = 500;
    ctx.body = generateResponseBody(false, '서버 오류가 발생했습니다');
    return;
  }
};
