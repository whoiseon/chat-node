import z from 'zod';

export const joinChannelSchema = z
  .object({
    displayName: z
      .string()
      .optional()
      .refine((val) => !val || (val.length >= 2 && val.length <= 20), {
        message: '닉네임은 2자 이상 20자 이하로 입력해주세요',
      }),
    isPrivate: z.boolean(),
    password: z.string().optional(),
  })
  .refine(
    (data) => !data.isPrivate || (data.password && data.password.length > 0),
    {
      message: '비밀번호를 입력해주세요',
      path: ['password'],
    },
  );

export type JoinChannelFormValues = z.infer<typeof joinChannelSchema>;
