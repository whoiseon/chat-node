import { Prisma, PrismaClient } from 'generated/prisma';

export interface DatabaseConfig {
  maxConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  logLevel?: Prisma.LogLevel[];
  enableMetrics?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export class Database {
  private static instance: Database;
  private prisma: PrismaClient;
  private config: DatabaseConfig;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor(config: DatabaseConfig = {}) {
    this.config = {
      maxConnections: 10,
      connectionTimeout: 10000, // 10초
      queryTimeout: 30000, // 30초
      logLevel: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      enableMetrics: process.env.NODE_ENV === 'development',
      retryAttempts: 3,
      retryDelay: 1000, // 1초
      ...config,
    };

    this.initializePrismaClient();
  }

  /**
   * Singleton 인스턴스 반환
   */
  public static getInstance(config?: DatabaseConfig): Database {
    if (!Database.instance) {
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  /**
   * Prisma 클라이언트 초기화
   */
  private initializePrismaClient(): void {
    this.prisma = new PrismaClient({
      log: this.config.logLevel,
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  /**
   * 데이터베이스 연결
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.performConnect();

    try {
      await this.connectionPromise;
      this.isConnected = true;
      console.log('✅ Database connected successfully');
    } catch (error) {
      this.connectionPromise = null;
      throw error;
    }
  }

  /**
   * 실제 연결 수행 (재시도 로직 포함)
   */
  private async performConnect(): Promise<void> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.retryAttempts!; attempt++) {
      try {
        await Promise.race([
          this.prisma.$connect(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Connection timeout')),
              this.config.connectionTimeout,
            ),
          ),
        ]);

        // 연결 테스트
        await this.prisma.$queryRaw`SELECT 1`;
        return;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Database connection attempt ${attempt} failed:`, error);

        if (attempt < this.config.retryAttempts!) {
          await this.delay(this.config.retryDelay! * attempt); // 지수 백오프
        }
      }
    }

    throw new Error(
      `Failed to connect to database after ${this.config.retryAttempts} attempts. Last error: ${lastError!.message}`,
    );
  }

  /**
   * 데이터베이스 연결 해제
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.prisma.$disconnect();
      this.isConnected = false;
      this.connectionPromise = null;
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  /**
   * Prisma 클라이언트 반환
   */
  public getPrisma(): PrismaClient {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.prisma;
  }

  /**
   * 안전한 Prisma 클라이언트 반환 (자동 연결)
   */
  public async getPrismaClient(): Promise<PrismaClient> {
    await this.connect();
    return this.prisma;
  }

  /**
   * 데이터베이스 상태 확인
   */
  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency?: number;
    error?: string;
  }> {
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        latency,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: (error as Error).message,
      };
    }
  }

  /**
   * 트랜잭션 실행 헬퍼
   */
  public async transaction<T>(
    fn: (prisma: Prisma.TransactionClient) => Promise<T>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): Promise<T> {
    const client = await this.getPrismaClient();
    return client.$transaction(fn, {
      maxWait: options?.maxWait || 5000, // 5초
      timeout: options?.timeout || 30000, // 30초
      isolationLevel: options?.isolationLevel,
    });
  }

  /**
   * 연결 상태 반환
   */
  public isConnectionActive(): boolean {
    return this.isConnected;
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 정리 작업 (프로세스 종료 시)
   */
  public async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up database connections...');
    await this.disconnect();
  }
}

// 전역 인스턴스 (편의용)
export const db = Database.getInstance();
