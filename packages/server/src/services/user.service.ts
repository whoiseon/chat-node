import { Prisma } from 'generated/prisma';

import { prisma } from '@/database';
import { UserResponse, UserRole } from '@/types';
import cache from '@/cache';
import { BusinessError } from '@/lib/middlewares/error';

export class UserService {
  /**
   * 유저 정보 조회 (캐시 및 DB 조회)
   * @param userId
   */
  async findUserWithCache(userId: string): Promise<UserResponse | null> {
    const userKey = cache.generateKey.user(userId);
    let cachedUser = await cache.get<UserResponse>(userKey);

    if (cachedUser) {
      // 캐시 히트 시 캐시에서 가져온 정보를 반환
      return {
        userId: cachedUser.userId,
        username: cachedUser.username,
        np: cachedUser.np,
        mainNodeConId: cachedUser.mainNodeConId,
        role: cachedUser.role,
      };
    }

    // 캐시 미스 시 DB에서 조회
    const user = await this.findUser(userId, 'userId', {
      id: true,
      username: true,
      np: true,
      mainNodeConId: true,
    });

    if (!user) {
      throw new BusinessError('존재하지 않는 유저입니다.');
    }

    const adminUser = await this.findAdminUser(userId);
    const role = adminUser ? UserRole.ADMIN : UserRole.USER;

    const userResponse: UserResponse = {
      userId: user.id,
      username: user.username,
      np: user.np,
      mainNodeConId: user.mainNodeConId,
      role,
    };

    // 캐시 저장
    await cache.set<UserResponse>(userKey, userResponse);

    return userResponse;
  }

  async findAdminUser(userId: string) {
    return prisma.adminUser.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });
  }

  /**
   * 유저 정보 DB 조회
   */
  async findUser(
    value: string,
    by: 'userId' | 'username',
    select?: Prisma.UserSelect
  ) {
    if (!value) return;

    switch (by) {
      case 'userId':
        return prisma.user.findUnique({
          where: { id: value },
          select,
        });
      case 'username':
        return prisma.user.findUnique({
          where: { username: value },
          select,
        });
      default:
        return null;
    }
  }
}
