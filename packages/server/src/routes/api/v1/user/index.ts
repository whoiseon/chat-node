import Router from '@koa/router';

import { generateResponseBody } from '@/lib/utils';
import { requireAuth } from '@/lib/middlewares/auth';
import { BusinessError } from '@/lib/middlewares/error';

import { UserService } from '@/services/user.service';

import { UserResponse, UserRole } from '@/types';

const user = new Router();
const userService = new UserService();

/**
 * 내 정보 조회
 */
user.get('/me', requireAuth, async (ctx) => {
  const userId = ctx.state.userId!;

  const user = await userService.findUser(userId, 'userId', {
    id: true,
    username: true,
    np: true,
    mainNodeConId: true,
  });

  if (!user) {
    throw new BusinessError('존재하지 않는 유저입니다.');
  }

  const adminUser = await userService.findAdminUser(userId);

  let role = UserRole.USER;

  if (adminUser) {
    role = UserRole.ADMIN;
  }

  ctx.body = generateResponseBody<UserResponse>(true, '', {
    userId: user.id,
    username: user.username,
    np: user.np,
    mainNodeConId: user.mainNodeConId,
    role,
  });
});

export default user;
