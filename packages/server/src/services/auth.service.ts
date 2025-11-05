import bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma';

import { AuthBody, AuthTokens, LogInInput, SignUpInput } from '@/types';

import { db } from '@/database';
import { generateToken } from '@/lib/token';

export class AuthService {
  /**
   * 회원가입
   */
  async register(input: SignUpInput): Promise<AuthBody> {
    const prisma = db.getPrisma();
    const { username, password } = input;

    // 이메일 중복검사
    const existingUsername = await this.findUser(username, 'username', {
      id: true,
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
  async signIn(input: LogInInput): Promise<AuthBody> {
    const { username, password } = input;

    const user = await this.findUser(username, 'username', {
      id: true,
      passwordHash: true,
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
  async findUser(value: string, by: 'username', select?: Prisma.UserSelect) {
    const prisma = db.getPrisma();

    switch (by) {
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
    const prisma = db.getPrisma();

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
        expiresIn: '30d',
      }
    );

    const accessToken = await generateToken(
      {
        user_id: userId,
      },
      {
        subject: 'access_token',
        expiresIn: '1h',
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
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    let refreshToken = originalRefreshToken;
    // 리프레시 토큰 만료 시간이 23일 이하일 때 리프레시 토큰 갱신
    if (diff < 1000 * 60 * 60 * 24 * 23) {
      console.log('refreshing refreshToken');
      refreshToken = await generateToken(
        {
          user_id: userId,
          token_id: tokenId,
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d',
        }
      );
    }
    const accessToken = await generateToken(
      {
        user_id: userId,
      },
      {
        subject: 'access_token',
        expiresIn: '1h',
      }
    );

    return { refreshToken, accessToken };
  }
}
