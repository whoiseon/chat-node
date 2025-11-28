import { Prisma } from 'generated/prisma';

import { prisma } from '@/database';

export class UserService {
  async findAdminUser(userId: string) {
    return prisma.adminUser.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });
  }

  /**
   * 유저 조회
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
