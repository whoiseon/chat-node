import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { OptionalAuth, Public, Roles, TokenId, UserId } from '@/common/decorators';
import { ApiResponseDto } from '@/common/dto';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AuthTokens } from '@/common/interfaces';
import { Env } from '@/common/utils';
import { UserDatabase } from '@/database';

import { AuthService } from './auth.service';
import { CheckUsernameDto, SignInDto, SignUpDto } from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @Public()
  @Post('check-username')
  async checkUsername(
    @Body() dto: CheckUsernameDto,
  ): Promise<ApiResponseDto<{ exists: boolean }>> {
    const result = await this.authService.checkUsername(dto.username);
    return new ApiResponseDto(result);
  }

  @Public()
  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ApiResponseDto<null>> {
    const tokens = await this.authService.signIn(dto.username, dto.password);
    this.setAuthCookies(res, tokens);
    return new ApiResponseDto(null);
  }

  @Public()
  @Post('sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ApiResponseDto<null>> {
    const tokens = await this.authService.signUp(
      dto.username,
      dto.password,
      dto.displayName,
    );
    this.setAuthCookies(res, tokens);
    return new ApiResponseDto(null);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @UserId() userId: string,
    @TokenId() tokenId: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ApiResponseDto<AuthTokens>> {
    const tokens = await this.authService.refresh(userId, tokenId);
    this.setAuthCookies(res, tokens);
    return new ApiResponseDto(tokens);
  }

  @Post('sign-out')
  async signOut(
    @UserId() userId: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ApiResponseDto<null>> {
    await this.authService.signOut(userId);
    this.clearAuthCookies(res);
    return new ApiResponseDto(null);
  }

  @OptionalAuth()
  @Get('me')
  async getMe(
    @UserId() userId: string,
  ): Promise<
    ApiResponseDto<{ user: Omit<UserDatabase, 'passwordHash'> | null }>
  > {
    if (!userId) {
      return new ApiResponseDto({ user: null });
    }
    const user = await this.authService.getMe(userId);
    return new ApiResponseDto({ user });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post('force-logout/:targetUserId')
  async forceLogout(
    @Param('targetUserId') targetUserId: string,
  ): Promise<ApiResponseDto<null>> {
    await this.authService.forceLogout(targetUserId);
    return new ApiResponseDto(null);
  }

  private setAuthCookies(res: FastifyReply, tokens: AuthTokens): void {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    res.setCookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: this.parseExpiration(
        this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      ),
    });

    res.setCookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: this.parseExpiration(
        this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      ),
    });
  }

  private clearAuthCookies(res: FastifyReply): void {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
  }

  private parseExpiration(value: string): number {
    const match = value.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return 0;

    const num = parseInt(match[1]!, 10);
    const unit = match[2]!;

    switch (unit) {
      case 's':
        return num;
      case 'm':
        return num * 60;
      case 'h':
        return num * 3600;
      case 'd':
        return num * 86400;
      default:
        return 0;
    }
  }
}
