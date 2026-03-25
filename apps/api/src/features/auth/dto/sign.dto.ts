import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: '아이디', example: 'chatnode' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class SignUpDto {
  @ApiProperty({
    description: '아이디 (5~20자)',
    example: 'chatnode',
    minLength: 5,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  username!: string;

  @ApiProperty({
    description: '비밀번호 (8자 이상)',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    description: '닉네임 (2자 이상)',
    example: '사용자',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  displayName!: string;
}
