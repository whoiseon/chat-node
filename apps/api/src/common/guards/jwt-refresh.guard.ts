import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

import { AppCache, CACHE_TOKEN } from '@/common/cache';
import { RefreshTokenPayload } from '@/common/interfaces';
import { Env } from '@/common/utils';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  private readonly logger = new Logger(JwtRefreshGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
    @Inject(CACHE_TOKEN) private readonly redis: AppCache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException({
        message: '리프레시 토큰이 없습니다.',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        token,
        { secret: this.configService.get('REFRESH_TOKEN_SECRET') },
      );

      if (payload.type !== 'refresh_token') {
        throw new Error('invalid token type');
      }

      request.userId = payload.userId;
      request.tokenId = payload.tokenId;
    } catch {
      await this.deleteExpiredSession(token);

      throw new UnauthorizedException({
        message: '만료된 리프레시 토큰입니다.',
        payload: { field: 'refresh_token' },
      });
    }

    return true;
  }

  private async deleteExpiredSession(token: string): Promise<void> {
    try {
      const decoded = this.jwtService.decode<RefreshTokenPayload>(token);

      if (!decoded?.tokenId) return;

      await this.redis.del(`session:${decoded.tokenId}`);

      this.logger.log(
        `[deleteExpiredSession] 만료된 세션 삭제 — tokenId: ${decoded.tokenId}`,
      );
    } catch {
      // decode 실패 시 무시
    }
  }

  private extractToken(request: FastifyRequest): string | undefined {
    const cookieToken = request.cookies?.refresh_token;
    if (cookieToken) return cookieToken;

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
