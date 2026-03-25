import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserId } from '@/common/decorators';
import { ApiResponseDto, NullPayloadResponseDto } from '@/common/dto';
import { ChannelService } from '@/features/channel/channel.service';
import {
  CreateChannelDto,
  CreateChannelResponseDto,
  CreateDmDto,
  CreateDmResponseDto,
} from '@/features/channel/dto';

@Controller('channel')
@ApiTags('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

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
  async createDm(
    @Body() body: CreateDmDto,
    @UserId() userId: string,
  ) {
    const result = await this.channelService.createDm(body, userId);
    return new ApiResponseDto(result);
  }
}
