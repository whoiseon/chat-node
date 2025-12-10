import { z } from 'zod';

export const signUpSchema = z.object({
  username: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_]{5,20}$/, {
      message: '아이디는 5~20자 영문, 숫자, 특수문자(_) 입력해주세요.',
    }),
  password: z
    .string()
    .min(1)
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message:
        '비밀번호는 8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력해주세요.',
    }),
});

export const logInSchema = z.object({
  username: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});
