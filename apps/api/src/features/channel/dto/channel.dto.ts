import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiErrorDto } from '@/common/dto';

export class CreateChannelDto {
  @ApiProperty({
    description: '채널 이름 (2~50자)',
    example: '테스트 채널',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    description: '채널 설명 (2~200자)',
    example: '테스트를 위한 채널입니다.',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  description!: string;

  @ApiPropertyOptional({
    description: '비밀번호 (optional)',
    example: '123456',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: '채널 프로필 이미지 (optional)',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;
}

export class CreateChannelPayload {
  @ApiProperty({
    type: 'string',
  })
  channelId!: string;
}

export class CreateChannelResponseDto {
  @ApiPropertyOptional({
    type: () => ApiErrorDto,
    nullable: true,
    example: null,
  })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => CreateChannelPayload })
  payload!: CreateChannelPayload;
}
