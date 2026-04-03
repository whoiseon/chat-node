import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

import { AppCache, CACHE_TOKEN } from '@/common/cache';
import {
  AccessTokenPayload,
  AuthTokens,
  RefreshTokenPayload,
} from '@/common/interfaces';
import { Env } from '@/common/utils';
import { AppDatabase, DB_TOKEN, userTable, UserDatabase } from '@/database';

/** Redis key prefix */
const SESSION_PREFIX = 'session:';
/** 유저의 모든 세션 ID를 추적하는 Set */
const USER_SESSIONS_PREFIX = 'user_sessions:';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshTtl: number;

  constructor(
    @Inject(DB_TOKEN) private readonly db: AppDatabase,
    @Inject(CACHE_TOKEN) private readonly redis: AppCache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
  ) {
    this.refreshTtl = this.parseExpiration(
      this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    );
  }

  async getMe(
    userId: string,
  ): Promise<Omit<UserDatabase, 'passwordHash'> | null> {
    const [user] = await this.db
      .select({
        id: userTable.id,
        username: userTable.username,
        role: userTable.role,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        lastLoginAt: userTable.lastLoginAt,
        profileImageUrl: userTable.profileImageUrl,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    return user ?? null;
  }

  async checkUsername(username: string): Promise<{ exists: boolean }> {
    const [user] = await this.db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);

    return { exists: !!user };
  }

  async signOut(userId: string): Promise<void> {
    await this.deleteAllSessions(userId);
    this.logger.log(`[signOut] 세션 삭제 완료 — userId: ${userId}`);
  }

  async signIn(username: string, password: string): Promise<AuthTokens> {
    const [user] = await this.db
      .select({
        id: userTable.id,
        passwordHash: userTable.passwordHash,
      })
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException({
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    await this.deleteAllSessions(user.id);

    await this.db
      .update(userTable)
      .set({ lastLoginAt: new Date() })
      .where(eq(userTable.id, user.id));

    this.logger.log(`[signIn] 로그인 성공 — userId: ${user.id}`);

    return this.createSession(user.id);
  }

  async signUp(
    username: string,
    password: string,
  ): Promise<AuthTokens> {
    const [existing] = await this.db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1);

    if (existing) {
      throw new ConflictException({
        message: '이미 사용 중인 아이디입니다.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await this.db
      .insert(userTable)
      .values({
        username,
        passwordHash,
      })
      .returning({ id: userTable.id });

    this.logger.log(`[signUp] 회원가입 성공 — userId: ${user!.id}`);

    return this.createSession(user!.id);
  }

  async refresh(userId: string, tokenId: string): Promise<AuthTokens> {
    this.logger.log(
      `[refresh] 시작 — userId: ${userId}, tokenId: ${tokenId}`,
    );

    const sessionKey = `${SESSION_PREFIX}${tokenId}`;

    // 세션 조회 + 삭제를 원자적으로 수행 (1회만 사용 가능)
    const storedUserId = await this.redis.getdel(sessionKey);

    if (!storedUserId) {
      // 세션이 없음 = 이미 사용됨(탈취 의심) 또는 만료됨
      this.logger.warn(
        `[refresh] 탈취 감지 또는 만료 — tokenId: ${tokenId}, userId: ${userId}`,
      );

      // 탈취 의심 → 해당 유저의 모든 세션 삭제
      await this.deleteAllSessions(userId);

      throw new UnauthorizedException({
        message: '비정상적인 접근이 감지되었습니다. 다시 로그인해주세요.',
        payload: { field: 'refresh_token' },
      });
    }

    if (storedUserId !== userId) {
      throw new UnauthorizedException({
        message: '유효하지 않은 세션입니다.',
        payload: { field: 'refresh_token' },
      });
    }

    // 유저 세션 Set에서 이전 세션 제거
    await this.redis.srem(`${USER_SESSIONS_PREFIX}${userId}`, tokenId);

    // 새 세션 생성
    const newSessionId = await this.storeSession(userId);

    this.logger.log(
      `[refresh] rotation 완료 — old: ${tokenId}, new: ${newSessionId}`,
    );

    return this.generateTokens(userId, newSessionId);
  }

  async forceLogout(targetUserId: string): Promise<void> {
    await this.deleteAllSessions(targetUserId);
    this.logger.log(
      `[forceLogout] 강제 로그아웃 — targetUserId: ${targetUserId}`,
    );
  }

  /**
   * Redis에 세션을 저장하고 세션 ID를 반환합니다.
   * - `session:{id}` → userId (TTL = refresh token 만료 시간)
   * - `user_sessions:{userId}` → Set<sessionId> (유저의 모든 세션 추적)
   */
  private async storeSession(userId: string): Promise<string> {
    const sessionId = randomUUID();
    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    const userSessionsKey = `${USER_SESSIONS_PREFIX}${userId}`;

    await this.redis
      .multi()
      .set(sessionKey, userId, 'EX', this.refreshTtl)
      .sadd(userSessionsKey, sessionId)
      .expire(userSessionsKey, this.refreshTtl)
      .exec();

    this.logger.log(
      `[storeSession] 세션 생성 — userId: ${userId}, sessionId: ${sessionId}`,
    );

    return sessionId;
  }

  /**
   * 유저의 모든 세션을 Redis에서 삭제합니다.
   */
  private async deleteAllSessions(userId: string): Promise<void> {
    const userSessionsKey = `${USER_SESSIONS_PREFIX}${userId}`;
    const sessionIds = await this.redis.smembers(userSessionsKey);

    if (sessionIds.length > 0) {
      const sessionKeys = sessionIds.map((id) => `${SESSION_PREFIX}${id}`);
      await this.redis.del(...sessionKeys, userSessionsKey);
    }
  }

  private async createSession(userId: string): Promise<AuthTokens> {
    const sessionId = await this.storeSession(userId);
    return this.generateTokens(userId, sessionId);
  }

  private async generateTokens(
    userId: string,
    sessionId: string,
  ): Promise<AuthTokens> {
    const accessTokenPayload: AccessTokenPayload = {
      type: 'access_token',
      userId,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      type: 'refresh_token',
      userId,
      tokenId: sessionId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * '30m', '7d' 같은 만료 문자열을 초(seconds) 단위로 변환합니다.
   */
  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 604800; // 기본 7일

    const value = parseInt(match[1]!, 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 604800;
    }
  }
}
