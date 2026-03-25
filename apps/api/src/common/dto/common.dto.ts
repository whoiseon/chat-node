// ── 공통 래퍼 ──

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ example: '에러 메시지' })
  message!: string;

  @ApiProperty({ example: '401' })
  status!: number;
}

export class NullPayloadResponseDto {
  @ApiPropertyOptional({ type: () => ApiErrorDto, nullable: true })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: 'string', nullable: true, example: null })
  payload!: null;
}
