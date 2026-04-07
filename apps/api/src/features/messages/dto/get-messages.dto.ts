import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { ApiErrorDto } from '@/common/dto';

export class GetMessagesQueryDto {
  @ApiProperty({
    description: '채널 ID',
    example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b',
  })
  @IsNotEmpty()
  @IsUUID()
  channelId!: string;

  @ApiPropertyOptional({
    description: '마지막으로 조회한 메시지 ID (커서)',
    example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b',
  })
  @IsOptional()
  @IsUUID()
  cursor?: string;
}

class MessageSenderDto {
  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  userId!: string;

  @ApiProperty({ example: '사용자' })
  displayName!: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    nullable: true,
  })
  profileImageUrl!: string;

  @ApiProperty({ example: 'chatnode' })
  username!: string;
}

class MessageItemDto {
  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  id!: string;

  @ApiProperty({ example: 'message', enum: ['message', 'system', 'notice'] })
  type!: string;

  @ApiProperty({ example: '안녕하세요!' })
  content!: string;

  @ApiPropertyOptional({ type: () => MessageSenderDto, nullable: true })
  sender!: MessageSenderDto | null;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z', nullable: true })
  deletedAt!: string | null;

  @ApiProperty({ example: 1 })
  unreadCount!: number;
}

class MessageGroupDto {
  @ApiProperty({ example: '2026-04-02', description: '날짜 (YYYY-MM-DD)' })
  date!: string;

  @ApiProperty({ type: [MessageItemDto] })
  messages!: MessageItemDto[];
}

class GetMessagesPayload {
  @ApiProperty({ type: [MessageGroupDto] })
  rows!: MessageGroupDto[];

  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    description: '다음 페이지 커서 (null이면 마지막 페이지)',
    example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b',
  })
  nextCursor!: string | null;
}

export class GetMessagesResponseDto {
  @ApiPropertyOptional({
    type: () => ApiErrorDto,
    nullable: true,
    example: null,
  })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => GetMessagesPayload })
  payload!: GetMessagesPayload;
}
