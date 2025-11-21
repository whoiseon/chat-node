import bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma';

import { prisma } from '@/database';
import {
  AuthBody,
  AuthTokens,
  LogInInput,
  SignUpInput,
  TokenError,
  TokenErrorCode,
} from '@/types';
import { generateToken } from '@/lib/token';

export class AuthService {
  /**
   * 회원가입
   */
  async register(input: SignUpInput): Promise<AuthBody> {
    const { username, password } = input;

    // 이메일 중복검사
    const existingUsername = await this.findUser(username, 'username', {
      id: true,
      username: true,
    });
    if (existingUsername) {
      throw new Error('이미 존재하는 아이디입니다');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원가입
    const newUser = await prisma.user.create({
      data: { username, passwordHash: hashedPassword },
    });

    const { refreshToken, accessToken } = await this.generateUserToken(
      newUser.id
    );

    return {
      userId: newUser.id,
      username: newUser.username,
      tokens: {
        refreshToken,
        accessToken,
      },
    };
  }

  /**
   * 로그인
   */
  async logIn(input: LogInInput): Promise<AuthBody> {
    const { username, password } = input;

    const user = await this.findUser(username, 'username', {
      id: true,
      passwordHash: true,
      username: true,
    });

    if (!user) {
      throw new Error('잘못된 계정정보입니다');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('잘못된 계정정보입니다');
    }

    const { refreshToken, accessToken } = await this.generateUserToken(user.id);

    return {
      userId: user.id,
      username: user.username,
      tokens: {
        refreshToken,
        accessToken,
      },
    };
  }

  /**
   * 유저 조회
   */
  async findUser(
    value: string,
    by: 'userId' | 'username',
    select?: Prisma.UserSelect
  ) {
    if (!value) return;

    switch (by) {
      case 'userId':
        return prisma.user.findUnique({
          where: { id: value },
          select,
        });
      case 'username':
        return prisma.user.findUnique({
          where: { username: value },
          select,
        });
      default:
        return null;
    }
  }

  /**
   * 유저 토큰 생성
   */
  async generateUserToken(userId: string): Promise<AuthTokens> {
    const authToken = await prisma.authToken.create({
      data: {
        userId,
      },
    });

    // refresh token is valid for 30days
    const refreshToken = await generateToken(
      {
        user_id: userId,
        token_id: authToken.id,
      },
      {
        subject: 'refresh_token',
        // expiresIn: '30d',
        expiresIn: '30s', // 30 seconds for testing
      }
    );

    const accessToken = await generateToken(
      {
        user_id: userId,
      },
      {
        subject: 'access_token',
        // expiresIn: '1h',
        expiresIn: '10s', // 10 seconds for testing
      }
    );

    return { refreshToken, accessToken };
  }

  /**
   * 레프레시 토큰
   */
  async refreshUserToken(
    userId: string,
    tokenId: string,
    refreshTokenExp: number,
    originalRefreshToken: string
  ): Promise<AuthTokens> {
    // 토큰 검증
    const authToken = await prisma.authToken.findUnique({
      where: { id: tokenId },
    });

    if (!authToken) {
      throw new TokenError(
        TokenErrorCode.REFRESH_TOKEN_NOT_FOUND,
        '유효하지 않은 리프레시 토큰입니다'
      );
    }

    // 토큰 차단 확인
    if (authToken.blocked) {
      throw new TokenError(
        TokenErrorCode.REFRESH_TOKEN_INVALID,
        '리프레시 토큰이 차단되었습니다'
      );
    }

    // 토큰 소유자 확인
    if (authToken.userId !== userId) {
      throw new TokenError(
        TokenErrorCode.REFRESH_TOKEN_INVALID,
        '토큰의 소유자가 일치하지 않습니다'
      );
    }

    // 기존 토큰 차단
    await prisma.authToken.update({
      where: { id: tokenId },
      data: { blocked: true },
    });

    // 새로운 토큰 생성
    const newAuthToken = await prisma.authToken.create({
      data: { userId },
    });

    const now = Date.now();
    const idff = refreshTokenExp * 1000 - now;

    // 리프레시 토큰도 갱신 ( 남은 기간이 7일 미만일 때 )
    const shouldRefreshToken = idff < 1000 * 60 * 60 * 24 * 7;

    const refreshToken = shouldRefreshToken
      ? await generateToken(
          {
            user_id: userId,
            token_id: newAuthToken.id,
          },
          {
            subject: 'refresh_token',
            // expiresIn: '30d',
            expiresIn: '2m', // 2 minutes for testing
          }
        )
      : originalRefreshToken;

    const accessToken = await generateToken(
      {
        user_id: userId,
      },
      {
        subject: 'access_token',
        // expiresIn: '1h',
        expiresIn: '30s', // 30 seconds for testing
      }
    );

    return { refreshToken, accessToken };
  }

  /**
   * 특정 유저의 모든 토큰 무효화 (로그아웃 등)
   */
  async revokeAllTokens(userId: string): Promise<void> {
    await prisma.authToken.updateMany({
      where: { userId, blocked: false },
      data: { blocked: true },
    });
  }

  /**
   * 만료된 토큰 정리 (크론잡 등에서 주기적 실행)
   */
  async cleanupExpiredTokens(): Promise<number> {
    // 30일 이상 된 토큰 삭제
    const result = await prisma.authToken.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        },
      },
    });

    return result.count;
  }
}
