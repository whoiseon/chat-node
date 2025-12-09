import 'dotenv/config';

import Redis, { type Redis as RedisClient } from 'ioredis';
import { UserResponse } from './types';

interface CacheService {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
  remove: (...keys: string[]) => Promise<number>;
  exists: (key: string) => Promise<boolean>;
  generateKey: CacheKeyGenerator;
}

class Cache implements CacheService {
  private client: RedisClient | null = null;
  private isConnecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  /**
   * Redis 서버 연결
   * 이미 연결 중이면 기존 Promise 반환
   */
  public async connect(): Promise<void> {
    if (this.client?.status === 'ready') {
      return Promise.resolve();
    }

    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.client = new Redis({
          maxRetriesPerRequest: 3,
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD,
          retryStrategy: (times: number) => {
            if (times > 3) {
              return null; // 재시도 중단
            }
            return Math.min(times * 50, 1000);
          },
          lazyConnect: true,
        });

        this.client.on('ready', () => {
          this.isConnecting = false;
          console.log(
            `✅ Redis server connected URL: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
          );
          resolve();
        });

        this.client.on('error', (error) => {
          this.isConnecting = false;
          console.error('❌ Redis connection error:', error);
          // 연결 실패해도 애플리케이션은 계속 실행되도록
          reject(error);
        });

        this.client.on('close', () => {
          console.warn('⚠️ Redis connection closed');
        });

        // 명시적 연결 시작
        this.client.connect().catch(reject);
      } catch (error) {
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  /**
   * 연결 상태 확인
   */
  public isConnected(): boolean {
    return this.client?.status === 'ready';
  }

  /**
   * 연결이 되어있는지 확인하고, 없으면 연결
   */
  private async ensureConnected(): Promise<RedisClient> {
    if (!this.isConnected()) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('Redis client not initialized');
    }

    return this.client;
  }

  /**
   * Redis 연결을 종료한다.
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.connectionPromise = null;
    }
  }

  /**
   * 키의 존재 여부를 확인한다.
   */
  public async exists(key: string): Promise<boolean> {
    try {
      const client = await this.ensureConnected();
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Failed to check existence of key ${key}:`, error);
      return false;
    }
  }

  /**
   * 캐시에서 값을 가져온다.
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      const client = await this.ensureConnected();
      const value = await client.get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Failed to get key ${key}:`, error);
      return null;
    }
  }

  /**
   * 캐시에 값을 저장한다.
   * @param key 캐시 키
   * @param value 저장할 값
   * @param ttl TTL (초 단위), 기본값 3600초 (1시간)
   */
  public async set<T>(
    key: string,
    value: T,
    ttl: number = 3600
  ): Promise<void> {
    try {
      const client = await this.ensureConnected();
      const serialized = JSON.stringify(value);

      if (ttl > 0) {
        await client.setex(key, ttl, serialized);
      } else {
        await client.set(key, serialized);
      }
    } catch (error) {
      console.error(`Failed to set key ${key}:`, error);
      throw error;
    }
  }

  /**
   * 하나 이상의 키를 삭제한다.
   * @param keys 삭제할 키들
   */
  public async remove(...keys: string[]): Promise<number> {
    try {
      const client = await this.ensureConnected();
      return await client.del(...keys);
    } catch (error) {
      console.error(`Failed to remove keys ${keys.join(', ')}:`, error);
      return 0;
    }
  }

  /**
   * 캐시 키 생성 헬퍼를 반환.
   */
  get generateKey(): CacheKeyGenerator {
    return {
      user: (userId: string) => `user:${userId}`,
    };
  }
}

// 싱글톤 인스턴스 생성
const cache = new Cache();

export default cache;

/**
 * 캐시 키 생성 함수 타입
 */
type CacheKeyGenerator = {
  user: (userId: string) => string;
};
