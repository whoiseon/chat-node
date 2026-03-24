import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_OPTIONAL_AUTH_KEY = 'isOptionalAuth';

export function Public(): MethodDecorator & ClassDecorator {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

/** 토큰이 있으면 userId 주입, 없거나 만료되어도 401을 던지지 않음 */
export function OptionalAuth(): MethodDecorator & ClassDecorator {
  return SetMetadata(IS_OPTIONAL_AUTH_KEY, true);
}
