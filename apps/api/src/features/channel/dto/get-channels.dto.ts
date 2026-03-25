import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

import { ApiErrorDto } from '@/common/dto';

export class GetChannelsQueryDto {
  @ApiPropertyOptional({
    description: '마지막으로 조회한 채널 ID (커서)',
    example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b',
  })
  @IsOptional()
  @IsUUID()
  cursor?: string;

  @ApiPropertyOptional({
    description: '조회할 항목 수',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

class LastMessageDto {
  @ApiProperty({ example: '안녕하세요!' })
  content!: string;

  @ApiProperty({ example: '사용자' })
  senderName!: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt!: string;
}

export class ChannelItemDto {
  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  id!: string;

  @ApiProperty({ example: '테스트 채널' })
  name!: string;

  @ApiProperty({ example: '테스트를 위한 채널입니다.' })
  description!: string;

  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    example: null,
  })
  profileImageUrl!: string | null;

  @ApiProperty({ example: false })
  isPrivate!: boolean;

  @ApiPropertyOptional({
    type: () => LastMessageDto,
    nullable: true,
  })
  lastMessage!: LastMessageDto | null;

  @ApiProperty({ example: 3 })
  unreadCount!: number;

  @ApiProperty({ example: '2026-03-25T00:00:00.000Z' })
  createdAt!: string;
}

class GetChannelsPayload {
  @ApiProperty({ type: [ChannelItemDto] })
  channels!: ChannelItemDto[];

  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    description: '다음 페이지 커서 (null이면 마지막 페이지)',
    example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b',
  })
  nextCursor!: string | null;
}

export class GetChannelsResponseDto {
  @ApiPropertyOptional({
    type: () => ApiErrorDto,
    nullable: true,
    example: null,
  })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => GetChannelsPayload })
  payload!: GetChannelsPayload;
}
