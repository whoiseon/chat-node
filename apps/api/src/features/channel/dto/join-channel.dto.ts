import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiErrorDto } from '@/common/dto';

export class JoinChannelDto {
  @ApiPropertyOptional({
    description: '닉네임 (미입력 시 아이디로 설정)',
    example: '사용자',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: '채널 비밀번호 (비밀방인 경우 필수)',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

class JoinChannelPayload {
  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  channelId!: string;

  @ApiProperty({ example: 'USER' })
  role!: string;

  @ApiProperty({ example: '사용자' })
  displayName!: string;
}

export class JoinChannelResponseDto {
  @ApiPropertyOptional({
    type: () => ApiErrorDto,
    nullable: true,
    example: null,
  })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => JoinChannelPayload })
  payload!: JoinChannelPayload;
}
