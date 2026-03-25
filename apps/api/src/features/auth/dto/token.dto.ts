// ── refresh ──

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ApiErrorDto } from '@/common/dto';

class AuthTokensPayload {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  refresh_token!: string;
}

export class RefreshResponseDto {
  @ApiPropertyOptional({ type: () => ApiErrorDto, nullable: true })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => AuthTokensPayload })
  payload!: AuthTokensPayload;
}
