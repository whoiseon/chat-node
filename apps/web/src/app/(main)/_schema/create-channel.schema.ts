import z from 'zod';

export const createChannelSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: '채널명을 2자 이상 입력해주세요' })
      .max(50, { message: '채널명은 50자 이하 입력해주세요' }),
    description: z
      .string()
      .min(2, { message: '채널 설명을 2자 이상 입력해주세요' })
      .max(200, { message: '채널 설명은 200자 이하 입력해주세요' }),
    isPrivate: z.boolean(),
    password: z.string().optional(),
    profileImageUrl: z.string().optional(),
  })
  .refine((data) => !data.isPrivate || (data.password && data.password.length > 0), {
    message: '비밀번호를 입력해주세요',
    path: ['password'],
  });

export type CreateChannelFormValues = z.infer<typeof createChannelSchema>;
