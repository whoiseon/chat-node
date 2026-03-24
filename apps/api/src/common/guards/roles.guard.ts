import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { eq } from 'drizzle-orm';

import { Role } from '@/common/constants';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { AppDatabase, DB_TOKEN, userTable } from '@/database';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(DB_TOKEN) private readonly db: AppDatabase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<{ userId: string }>();

    const [user] = await this.db
      .select({ role: userTable.role })
      .from(userTable)
      .where(eq(userTable.id, request.userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException({
        message: '사용자 정보가 없습니다.',
      });
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
