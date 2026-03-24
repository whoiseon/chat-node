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
import { and, eq } from 'drizzle-orm';

import {
  AccessTokenPayload,
  AuthTokens,
  RefreshTokenPayload,
} from '@/common/interfaces';
import { Env } from '@/common/utils';
import {
  AppDatabase,
  DB_TOKEN,
  sessionTable,
  userTable,
  UserDatabase,
} from '@/database';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DB_TOKEN) private readonly db: AppDatabase,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  async getMe(
    userId: string,
  ): Promise<Omit<UserDatabase, 'passwordHash'> | null> {
    const [user] = await this.db
      .select({
        id: userTable.id,
        username: userTable.username,
        displayName: userTable.displayName,
        role: userTable.role,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        lastLoginAt: userTable.lastLoginAt,
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
    await this.blockAllSessions(userId);
    this.logger.log(`[signOut] 세션 차단 완료 — userId: ${userId}`);
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

    await this.blockAllSessions(user.id);

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
    displayName: string,
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
        displayName,
      })
      .returning({ id: userTable.id });

    this.logger.log(`[signUp] 회원가입 성공 — userId: ${user!.id}`);

    return this.createSession(user!.id);
  }

  async refresh(userId: string, tokenId: string): Promise<AuthTokens> {
    this.logger.log(
      `[refresh] 시작 — userId: ${userId}, tokenId: ${tokenId}`,
    );

    const newSessionId = await this.db.transaction(async (tx) => {
      const [session] = await tx
        .select({
          id: sessionTable.id,
          blocked: sessionTable.blocked,
        })
        .from(sessionTable)
        .where(
          and(eq(sessionTable.id, tokenId), eq(sessionTable.userId, userId)),
        )
        .for('update')
        .limit(1);

      if (!session) {
        this.logger.warn(
          `[refresh] 세션 없음 — userId: ${userId}, tokenId: ${tokenId}`,
        );
        throw new UnauthorizedException({
          message: '유효하지 않은 세션입니다.',
          payload: { field: 'refresh_token' },
        });
      }

      if (session.blocked) {
        this.logger.warn(
          `[refresh] 탈취 감지: 차단된 세션 재사용 — tokenId: ${tokenId}, userId: ${userId}`,
        );

        // 탈취 의심 → 해당 유저의 모든 세션 차단
        await tx
          .update(sessionTable)
          .set({ blocked: true })
          .where(
            and(
              eq(sessionTable.userId, userId),
              eq(sessionTable.blocked, false),
            ),
          );

        throw new UnauthorizedException({
          message: '비정상적인 접근이 감지되었습니다. 다시 로그인해주세요.',
          payload: { field: 'refresh_token' },
        });
      }

      // 기존 세션 차단
      await tx
        .update(sessionTable)
        .set({ blocked: true })
        .where(eq(sessionTable.id, session.id));

      // 새 세션 생성
      const [newSession] = await tx
        .insert(sessionTable)
        .values({ userId })
        .returning({ id: sessionTable.id });

      this.logger.log(
        `[refresh] rotation 완료 — old: ${tokenId}, new: ${newSession!.id}`,
      );

      return newSession!.id;
    });

    return this.generateTokens(userId, newSessionId);
  }

  async forceLogout(targetUserId: string): Promise<void> {
    await this.blockAllSessions(targetUserId);
    this.logger.log(
      `[forceLogout] 강제 로그아웃 — targetUserId: ${targetUserId}`,
    );
  }

  private async blockAllSessions(userId: string): Promise<void> {
    await this.db
      .update(sessionTable)
      .set({ blocked: true })
      .where(
        and(eq(sessionTable.userId, userId), eq(sessionTable.blocked, false)),
      );
  }

  private async createSession(userId: string): Promise<AuthTokens> {
    const [session] = await this.db
      .insert(sessionTable)
      .values({ userId })
      .returning({ id: sessionTable.id });

    this.logger.log(
      `[createSession] 세션 생성 — userId: ${userId}, sessionId: ${session!.id}`,
    );

    return this.generateTokens(userId, session!.id);
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
}
