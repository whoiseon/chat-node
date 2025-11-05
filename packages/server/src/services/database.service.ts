import { Database } from '@/database';
import { Prisma, PrismaClient } from 'generated/prisma';

export class DatabaseService {
  private connectionManager: Database;

  constructor() {
    this.connectionManager = Database.getInstance();
  }

  /**
   * Prisma 클라이언트 반환
   */
  public async getClient(): Promise<PrismaClient> {
    return this.connectionManager.getPrismaClient();
  }

  /**
   * 헬스 체크
   */
  public async healthCheck() {
    return this.connectionManager.healthCheck();
  }

  /**
   * 트랜잭션 실행
   */
  public async transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.connectionManager.transaction(fn);
  }

  /**
   * 연결 상태 확인
   */
  public isConnected(): boolean {
    return this.connectionManager.isConnectionActive();
  }
}

// 전역 서비스 인스턴스
export const databaseService = new DatabaseService();
