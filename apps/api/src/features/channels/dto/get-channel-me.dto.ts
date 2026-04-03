import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ApiErrorDto } from '@/common/dto';

export class ChannelMe {
  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  channelId!: string;

  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  userId!: string;

  @ApiProperty({ example: 'chatnode' })
  username!: string;

  @ApiProperty({ example: '매니저' })
  displayName!: string;

  @ApiProperty({ enum: ['USER', 'STAFF', 'MANAGER'], example: 'USER' })
  role!: string;

  @ApiProperty({ example: '2026-03-24T00:00:00.000Z' })
  joinedAt!: string;

  @ApiPropertyOptional({ type: 'string', nullable: true, example: null })
  profileImageUrl!: string | null;
}

export class GetChannelMePayload {
  @ApiProperty({ type: () => ChannelMe, nullable: true })
  user!: ChannelMe | null;
}

export class GetChannelMeResponseDto {
  @ApiProperty({
    type: () => ApiErrorDto,
    nullable: true,
    example: null,
  })
  error!: ApiErrorDto | null;

  @ApiProperty()
  payload!: GetChannelMePayload;
}
