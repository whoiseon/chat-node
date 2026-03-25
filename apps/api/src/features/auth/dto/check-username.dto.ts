import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { ApiErrorDto } from '@/common/dto';

export class CheckUsernameDto {
  @ApiProperty({ description: '확인할 아이디', example: 'chatnode' })
  @IsString({ message: '사용자 아이디의 형식이 잘못되었습니다.' })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  username!: string;
}

class CheckUsernamePayload {
  @ApiProperty({ description: '아이디 존재 여부', example: true })
  exists!: boolean;
}

export class CheckUsernameResponseDto {
  @ApiPropertyOptional({ type: () => ApiErrorDto, nullable: true })
  error!: ApiErrorDto | null;

  @ApiProperty({ type: () => CheckUsernamePayload })
  payload!: CheckUsernamePayload;
}
