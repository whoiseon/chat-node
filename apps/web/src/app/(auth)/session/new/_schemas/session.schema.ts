import z from 'zod';

export const authBaseSchema = z.object({
  username: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
  confirmPassword: z.string().optional(),
});

export type FormValues = z.infer<typeof authBaseSchema>;

export const signInSchema = authBaseSchema.pick({
  username: true,
  password: true,
});

// unwrap() // optional -> required
export const signUpSchema = authBaseSchema
  .extend({
    username: authBaseSchema.shape.username
      .min(5, {
        message: '아이디는 5자 이상 입력해주세요.',
      })
      .max(20, { message: '아이디는 20자 이하 입력해주세요.' }),
    password: authBaseSchema.shape.password.min(8, {
      message: '비밀번호는 8자 이상 입력해주세요.',
    }),
    confirmPassword: authBaseSchema.shape.confirmPassword
      .unwrap()
      .min(1, { message: '비밀번호를 다시 입력해주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });
