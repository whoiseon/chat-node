import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';

import { Public } from '@/common/decorators';
import { ApiResponseDto } from '@/common/dto';
import { Env } from '@/common/utils';
import {
  HealthCheckErrorResponseDto,
  HealthCheckResponseDto,
} from '@/features/health/dto';
import { DatabaseHealthIndicator } from '@/features/health/indicators/database.indicator';

type HealthEntry = { status: 'up' | 'down'; message: string };

/** Terminus 실패 시 `ApiResponseDto`의 `payload`와 동일한 계열 */
type HealthCheckErrorPayload = {
  checks: Record<string, HealthEntry>;
  failedChecks: string[];
};

@Public()
@Controller('health')
@ApiTags('health')
@SkipThrottle()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Get()
  @HealthCheck({ swaggerDocumentation: false })
  @ApiOperation({
    summary: '전체 상태 확인',
    description:
      '모니터링을 위해 데이터베이스, 메모리 그리고 디스크의 상태를 확인',
  })
  @ApiResponse({
    status: 200,
    description: '모든 요소 정상',
    type: HealthCheckResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: '하나 이상의 구성 요소의 상태가 비정상',
    type: HealthCheckErrorResponseDto,
  })
  async check() {
    try {
      const result = await this.health.check([
        // 데이터베이스 상태 확인
        () => this.database.isHealthy('database'),

        // TODO: REDIS 상태 확인

        // 메모리 상태 확인 (heap 150MB 제한)
        () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

        // 메모리 상태 확인 (RSS 300MB 제한)
        () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),

        // 디스크 상태 확인 (디스크 사용량 90% 제한)
        () =>
          this.disk.checkStorage('storage', {
            path: '/',
            thresholdPercent: 0.9,
          }),
      ]);

      const defaultMessages: Record<string, string> = {
        memory_heap: 'heap 메모리 사용량 정상',
        memory_rss: 'RSS 메모리 사용량 정상',
        storage: '디스크 사용량 정상',
      };

      const details: Record<string, HealthEntry> = {};
      for (const [key, value] of Object.entries(result.details)) {
        const status = value.status as 'up' | 'down';
        const message =
          typeof value.message === 'string'
            ? value.message
            : (defaultMessages[key] ?? 'OK');
        details[key] = { status, message };
      }

      const environment: Env['NODE_ENV'] = this.config.get('NODE_ENV');
      return new ApiResponseDto({
        ...details,
        environment,
      });
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        const response = error.getResponse() as Record<string, unknown>;
        const { message, payload } = this.formatHealthCheckErrors(
          response.error,
        );
        throw new ServiceUnavailableException({ message, payload });
      }
      throw error;
    }
  }

  /**
   * Terminus `error` 객체 → API 공통 에러 형태(`message` + 구조화된 `payload`)
   */
  private formatHealthCheckErrors(errors: unknown): {
    message: string;
    payload: HealthCheckErrorPayload;
  } {
    const empty: HealthCheckErrorPayload = { checks: {}, failedChecks: [] };

    if (typeof errors !== 'object' || errors === null) {
      return { message: '상태 확인 실패', payload: empty };
    }

    const checks: Record<string, HealthEntry> = {};
    for (const [key, value] of Object.entries(errors)) {
      if (typeof value !== 'object' || value === null) {
        continue;
      }
      const info = value as Record<string, unknown>;
      const rawStatus = info.status;
      const status: HealthEntry['status'] =
        rawStatus === 'up' || rawStatus === 'down' ? rawStatus : 'down';
      const rawMessage = info.message ?? info.error ?? '확인 실패';
      const message =
        typeof rawMessage === 'string'
          ? rawMessage
          : JSON.stringify(rawMessage);
      checks[key] = { status, message };
    }

    const failedChecks = Object.keys(checks);
    const message =
      failedChecks.length > 0
        ? failedChecks
            .map((key) => {
              const entry = checks[key];
              return `${key}: ${entry?.message ?? '확인 실패'}`;
            })
            .join('; ')
        : '상태 확인 실패';

    return {
      message,
      payload: { checks, failedChecks },
    };
  }
}
