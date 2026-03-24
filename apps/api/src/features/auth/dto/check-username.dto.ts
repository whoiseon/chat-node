import { IsNotEmpty, IsString } from 'class-validator';

export class CheckUsernameDto {
  @IsString({ message: '사용자 아이디의 형식이 잘못되었습니다.' })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  username!: string;
}
