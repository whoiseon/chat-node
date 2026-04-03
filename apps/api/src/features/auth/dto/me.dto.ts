import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ApiErrorDto } from '@/common/dto';

class MeUser {
  @ApiProperty({ example: 'e6f436e9-7f4f-4b52-95e3-ed43c07ad97b' })
  id!: string;

  @ApiProperty({ example: 'chatnode' })
  username!: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'], example: 'USER' })
  role!: string;

  @ApiProperty({ example: '2026-03-24T00:00:00.000Z' })
  createdAt!: string;

  @ApiPropertyOptional({ type: 'string', nullable: true, example: null })
  updatedAt!: string | null;

  @ApiPropertyOptional({
    type: 'string',
    nullable: true,
    example: '2026-03-24T12:00:00.000Z',
  })
  lastLoginAt!: string | null;

  @ApiPropertyOptional({ type: 'string', nullable: true, example: null })
  profileImageUrl!: string | null;
}

class MePayload {
  @ApiPropertyOptional({ type: () => MeUser, nullable: true })
  user!: MeUser | null;
}

export class MeResponseDto {
  @ApiPropertyOptional({ type: () => ApiErrorDto, nullable: true })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => MePayload })
  payload!: MePayload;
}