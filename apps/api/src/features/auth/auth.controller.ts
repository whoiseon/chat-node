import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import {
  OptionalAuth,
  Public,
  Roles,
  TokenId,
  UserId,
} from '@/common/decorators';
import { ApiResponseDto, NullPayloadResponseDto } from '@/common/dto';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AuthTokens } from '@/common/interfaces';
import { Env } from '@/common/utils';

import { AuthService } from './auth.service';
import {
  CheckUsernameDto,
  CheckUsernameResponseDto,
  MeResponseDto,
  RefreshResponseDto,
  SignInDto,
  SignUpDto,
} from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @Public()
  @Get('check-username')
  @ApiOperation({
    summary: '아이디 중복 확인',
    description: '로그인/회원가입 전 해당 아이디의 가입 여부를 확인',
  })
  @ApiResponse({
    status: 200,
    description: '확인 성공',
    type: CheckUsernameResponseDto,
  })
  async checkUsername(@Query() dto: CheckUsernameDto) {
    const result = await this.authService.checkUsername(dto.username);
    return new ApiResponseDto(result);
  }

  @Public()
  @Post('sign-in')
  @ApiOperation({
    summary: '로그인',
    description:
      '아이디와 비밀번호로 로그인. 기존 활성 세션을 모두 차단 후 새 세션 생성. httpOnly 쿠키로 access_token, refresh_token 발급',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공 (쿠키에 토큰 설정)',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({ status: 401, description: '아이디 또는 비밀번호 불일치' })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const tokens = await this.authService.signIn(dto.username, dto.password);
    this.setAuthCookies(res, tokens);
    return new ApiResponseDto(null);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({
    summary: '회원가입',
    description:
      '새 계정 생성 후 자동 로그인. httpOnly 쿠키로 access_token, refresh_token 발급',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공 (쿠키에 토큰 설정)',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({ status: 409, description: '이미 사용 중인 아이디' })
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
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
  @ApiOperation({
    summary: '토큰 갱신 (Refresh Token Rotation)',
    description:
      'refresh_token으로 새 access_token과 refresh_token을 발급. 기존 세션은 차단되고 새 세션 생성. 차단된 세션의 토큰으로 요청 시 탈취로 간주하여 해당 유저의 전체 세션 차단',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공 (쿠키 + body에 토큰 반환)',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '유효하지 않거나 만료된 refresh_token / 탈취 감지',
    type: NullPayloadResponseDto,
  })
  async refresh(
    @UserId() userId: string,
    @TokenId() tokenId: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const tokens = await this.authService.refresh(userId, tokenId);
    this.setAuthCookies(res, tokens);
    return new ApiResponseDto(tokens);
  }

  @Delete('sign-out')
  @ApiOperation({
    summary: '로그아웃',
    description:
      '현재 유저의 모든 활성 세션을 차단하고 인증 쿠키 삭제. 인증 필요',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  async signOut(
    @UserId() userId: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    await this.authService.signOut(userId);
    this.clearAuthCookies(res);
    return new ApiResponseDto(null);
  }

  @OptionalAuth()
  @Get('me')
  @ApiOperation({
    summary: '현재 유저 정보 조회',
    description:
      '인증된 경우 유저 정보 반환, 비인증 시 { user: null } 반환 (401 아님)',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: MeResponseDto })
  async getMe(@UserId() userId: string) {
    if (!userId) {
      return new ApiResponseDto({ user: null });
    }
    const user = await this.authService.getMe(userId);
    return new ApiResponseDto({ user });
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete('force-logout/:targetUserId')
  @ApiOperation({
    summary: '관리자 강제 로그아웃',
    description: '대상 유저의 모든 활성 세션을 차단. ADMIN 권한 필요',
  })
  @ApiResponse({
    status: 200,
    description: '강제 로그아웃 성공',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 요청' })
  @ApiResponse({ status: 403, description: 'ADMIN 권한 필요' })
  async forceLogout(@Param('targetUserId') targetUserId: string) {
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
