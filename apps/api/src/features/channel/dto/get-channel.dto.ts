import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ApiErrorDto } from '@/common/dto';

class ChannelManagerDto {
  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  managerId!: string;

  @ApiProperty({ example: 'admin' })
  username!: string;

  @ApiProperty({ example: '매니저' })
  displayName!: string;
}

class GetChannelPayload {
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

  @ApiProperty({ example: '2026-03-25T00:00:00.000Z' })
  createdAt!: string;

  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    description: '가입 일시 (미가입 시 null)',
    example: '2026-03-25T00:00:00.000Z',
  })
  joinedAt!: string | null;

  @ApiProperty({ example: 5, description: '채널 멤버 수' })
  memberCount!: number;

  @ApiProperty({ type: () => ChannelManagerDto })
  manager!: ChannelManagerDto;
}

export class GetChannelResponseDto {
  @ApiPropertyOptional({
    type: () => ApiErrorDto,
    nullable: true,
    example: null,
  })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => GetChannelPayload })
  payload!: GetChannelPayload;
}
