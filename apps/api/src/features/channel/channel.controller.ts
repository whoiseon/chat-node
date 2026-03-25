import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OptionalAuth, UserId } from '@/common/decorators';
import { ApiResponseDto, NullPayloadResponseDto } from '@/common/dto';
import { ChannelService } from '@/features/channel/channel.service';
import {
  CreateChannelDto,
  CreateChannelResponseDto,
  CreateDmDto,
  CreateDmResponseDto,
  GetChannelsQueryDto,
  GetChannelsResponseDto,
  JoinChannelDto,
  JoinChannelResponseDto,
} from '@/features/channel/dto';

@Controller('channel')
@ApiTags('channel')
@ApiExtraModels(GetChannelsQueryDto)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @OptionalAuth()
  @Get('')
  @ApiOperation({
    summary: '채널 목록 조회',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: GetChannelsResponseDto,
  })
  async getChannels(
    @Query() query: GetChannelsQueryDto,
    @UserId() userId: string | undefined,
  ) {
    const result = await this.channelService.getChannels(query, userId);
    return new ApiResponseDto(result);
  }

  @Post(':channelId/join')
  @ApiOperation({
    summary: '채널 입장',
    description:
      '채널에 입장합니다. 닉네임 미입력 시 아이디가 닉네임으로 설정됩니다. 비밀방인 경우 비밀번호 필수',
  })
  @ApiResponse({
    status: 200,
    description: '입장 성공',
    type: JoinChannelResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 미입력',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '비밀번호 불일치',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '채널을 찾을 수 없음',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '이미 사용 중인 닉네임',
    type: NullPayloadResponseDto,
  })
  async joinChannel(
    @Param('channelId') channelId: string,
    @Body() body: JoinChannelDto,
    @UserId() userId: string,
  ) {
    const result = await this.channelService.joinChannel(
      channelId,
      userId,
      body,
    );
    return new ApiResponseDto(result);
  }

  @Post('')
  @ApiOperation({
    summary: '채널 생성',
  })
  @ApiResponse({
    status: 200,
    description: '채널 생성 성공',
    type: CreateChannelResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 채널 정보',
    type: NullPayloadResponseDto,
  })
  async createChannel(
    @Body() body: CreateChannelDto,
    @UserId() userId: string,
  ) {
    const result = await this.channelService.createChannel(body, userId);
    return new ApiResponseDto(result);
  }

  @Post('dm')
  @ApiOperation({
    summary: 'DM 생성',
    description: '대상 유저와 1:1 DM 채널을 생성합니다',
  })
  @ApiResponse({
    status: 200,
    description: 'DM 생성 성공',
    type: CreateDmResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '자기 자신과 DM 생성 불가',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '대상 유저를 찾을 수 없음',
    type: NullPayloadResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '이미 해당 유저와의 DM이 존재',
    type: NullPayloadResponseDto,
  })
  async createDm(@Body() body: CreateDmDto, @UserId() userId: string) {
    const result = await this.channelService.createDm(body, userId);
    return new ApiResponseDto(result);
  }
}
