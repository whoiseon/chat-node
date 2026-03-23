import { Inject, Injectable } from '@nestjs/common';
import { AppDatabase, DB_TOKEN } from '@/database';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { sql } from 'drizzle-orm';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(@Inject(DB_TOKEN) private readonly db: AppDatabase) {}

  /**
   * 데이터베이스 연결 체크
   *
   * @param key - 헬스 체크 타겟
   * @returns 헬스 체크 결과
   */
  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.db.execute(sql`SELECT 1`);

      return {
        [key]: {
          status: 'up' as const,
          message: '데이터베이스 연결 성공',
        },
      };
    } catch (error) {
      return {
        [key]: {
          status: 'down' as const,
          message:
            error instanceof Error ? error.message : '데이터베이스 연결 실패',
        },
      };
    }
  }
}
