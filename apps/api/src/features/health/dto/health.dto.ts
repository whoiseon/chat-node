import { ApiProperty } from '@nestjs/swagger';

import { ApiErrorDto } from '@/common/dto';

export class HealthData {
  @ApiProperty({ enum: ['up', 'down'], example: 'up' })
  status!: string;

  @ApiProperty({ type: 'string', example: '데이터베이스 연결 성공' })
  message!: string;
}

export class HealthPayload {
  @ApiProperty({ example: 'development' })
  environment!: string;

  @ApiProperty({ type: () => HealthData })
  database!: HealthData;

  @ApiProperty({
    type: () => HealthData,
    example: { status: 'up', message: 'Redis 연결 성공' },
  })
  redis!: HealthData;

  @ApiProperty({
    type: () => HealthData,
    example: { status: 'up', message: 'heap 메모리 사용량 정상' },
  })
  memory_heap!: HealthData;

  @ApiProperty({
    type: () => HealthData,
    example: { status: 'up', message: 'RSS 메모리 사용량 정상' },
  })
  memory_rss!: HealthData;

  @ApiProperty({
    type: () => HealthData,
    example: { status: 'up', message: '디스크 사용량 정상' },
  })
  storage!: HealthData;
}

export class HealthCheckResponseDto {
  @ApiProperty({ type: () => ApiErrorDto, nullable: true })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => HealthPayload })
  payload!: HealthPayload;
}

// Error

class HealthCheckErrorEntry {
  @ApiProperty({ enum: ['up', 'down'], example: 'down' })
  status!: string;

  @ApiProperty({ example: '연결 실패' })
  message!: string;
}

class HealthCheckErrorPayload {
  @ApiProperty({
    type: () => HealthData,
    example: { database: { status: 'down', message: '연결 실패' } },
  })
  checks!: Record<string, HealthCheckErrorEntry>;

  @ApiProperty({
    type: [String],
    example: ['database'],
  })
  failedChecks!: string[];
}

export class HealthCheckErrorResponseDto {
  @ApiProperty({ type: () => ApiErrorDto })
  error!: ApiErrorDto;

  @ApiProperty({ type: () => HealthCheckErrorPayload })
  payload!: HealthCheckErrorPayload;
}
