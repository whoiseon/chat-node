import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const UserId: () => ParameterDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    return ctx.switchToHttp().getRequest<FastifyRequest>().userId;
  },
);

export const TokenId: () => ParameterDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    return ctx.switchToHttp().getRequest<FastifyRequest>().tokenId;
  },
);
