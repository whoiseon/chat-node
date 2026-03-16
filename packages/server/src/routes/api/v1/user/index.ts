import Router from '@koa/router';

import { generateResponseBody } from '@/lib/utils';
import { requireAuth } from '@/lib/middlewares/auth';
import { BusinessError } from '@/lib/middlewares/error';

import { UserService } from './user.service';
import { UserResponse } from './user.types';

const user = new Router();
const userService = new UserService();

/**
 * 내 정보 조회
 */
user.get('/me', requireAuth, async (ctx) => {
  const userId = ctx.state.userId;

  if (!userId) {
    throw new BusinessError('로그인이 필요합니다.');
  }

  const me = await userService.findUserWithCache(userId);

  if (!me) {
    throw new BusinessError('존재하지 않는 유저입니다.');
  }

  ctx.body = generateResponseBody<UserResponse>(true, '', {
    userId: me.userId,
    username: me.username,
    mainNodeConId: me.mainNodeConId,
    role: me.role,
  });
});

export default user;
