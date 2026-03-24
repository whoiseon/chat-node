import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

import { IS_OPTIONAL_AUTH_KEY, IS_PUBLIC_KEY } from '@/common/decorators';
import { AccessTokenPayload } from '@/common/interfaces';
import { Env } from '@/common/utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );
    if (isPublic) return true;

    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_AUTH_KEY,
      targets,
    );

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractToken(request);

    if (!token) {
      if (isOptionalAuth) return true;
      throw new UnauthorizedException({
        message: '토큰이 없습니다.',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        { secret: this.configService.get('ACCESS_TOKEN_SECRET') },
      );

      if (payload.type !== 'access_token') {
        throw new Error('invalid token type');
      }

      request.userId = payload.userId;
    } catch {
      if (isOptionalAuth) return true;
      throw new UnauthorizedException({
        message: '만료된 토큰입니다.',
        payload: { field: 'access_token' },
      });
    }

    return true;
  }

  private extractToken(request: FastifyRequest): string | undefined {
    const cookieToken = request.cookies?.access_token;
    if (cookieToken) return cookieToken;

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
