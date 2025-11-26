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
import { createAccessToken, createRefreshToken } from '@/lib/token';

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

    const tokens = await this.issueTokens(newUser.id);

    return {
      userId: newUser.id,
      username: newUser.username,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
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

    const tokens = await this.issueTokens(user.id);

    return {
      userId: user.id,
      username: user.username,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async issueTokens(userId: string) {
    // 새 토큰 레코드 생성
    const token = await prisma.authToken.create({
      data: { userId },
    });

    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId, token.id);

    return { userId, accessToken, refreshToken };
  }

  async rotateRefreshToken(userId: string, tokenId: string) {
    console.log(
      '[AuthService.rotateRefreshToken] 시작 userId:',
      userId,
      'tokenId:',
      tokenId
    );

    const token = await prisma.authToken.findUnique({
      where: { id: tokenId },
    });

    if (!token) {
      console.log(
        '[AuthService.rotateRefreshToken] 세션 레코드 없음 → 잘못된 리프레시 토큰'
      );

      throw new TokenError(
        TokenErrorCode.REFRESH_TOKEN_NOT_FOUND,
        '리프레시 토큰이 없습니다'
      );
    }

    if (token.userId !== userId) {
      console.log(
        '[AuthService.rotateRefreshToken] 세션 userId 불일치, 세션 userId:',
        token.userId
      );
      throw new TokenError(
        TokenErrorCode.REFRESH_TOKEN_INVALID,
        '리프레시 토큰이 유효하지 않습니다'
      );
    }

    if (token.blocked) {
      console.log(
        '[AuthService.rotateRefreshToken] 이미 차단된 리프레시 토큰 재사용 시도'
      );
      throw new TokenError(
        TokenErrorCode.REFRESH_TOKEN_INVALID,
        '리프레시 토큰이 유효하지 않습니다'
      );
    }

    console.log(
      '[AuthService.rotateRefreshToken] 기존 세션 차단 및 새 세션 생성 준비'
    );

    // 기존 세션 차단(회전)
    await prisma.authToken.update({
      where: { id: tokenId },
      data: { blocked: true },
    });

    const newToken = await prisma.authToken.create({
      data: { userId },
    });

    console.log(
      '[AuthService.rotateRefreshToken] 새 세션 생성 완료, newTokenId:',
      newToken.id
    );

    const refreshToken = createRefreshToken(userId, newToken.id);
    const accessToken = createAccessToken(userId);

    console.log(
      '[AuthService.rotateRefreshToken] 새 access/refresh 토큰 생성 완료'
    );

    return { userId, accessToken, refreshToken };
  }

  async revokeAll(userId: string) {
    await prisma.authToken.updateMany({
      where: { userId, blocked: false },
      data: { blocked: true },
    });
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
}
