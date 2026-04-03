import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { ApiErrorDto } from '@/common/dto';

export class CreateDmDto {
  @ApiProperty({
    description: '대화 상대 유저 ID',
    example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  targetUserId!: string;
}

export class CreateDmPayload {
  @ApiProperty({ type: 'string' })
  channelId!: string;
}

export class CreateDmResponseDto {
  @ApiPropertyOptional({
    type: () => ApiErrorDto,
    nullable: true,
    example: null,
  })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => CreateDmPayload })
  payload!: CreateDmPayload;
}
