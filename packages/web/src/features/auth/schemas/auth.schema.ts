import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
});
export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: '아이디를 입력해주세요.' })
      .regex(/^[a-zA-Z0-9_]{5,20}$/, {
        message: '아이디는 5~20자 영문, 숫자, 특수문자(_)만 입력해주세요.',
      }),
    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
          '비밀번호는 8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력해주세요.',
      }),
    passwordConfirm: z
      .string()
      .min(1, { message: '비밀번호를 재입력해주세요.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
          '비밀번호는 8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력해주세요.',
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });
export type SignupFormSchema = z.infer<typeof signupFormSchema>;
