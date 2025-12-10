import { z } from 'zod';
import { ServerJoinType } from 'generated/prisma';

export const serverCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: '서버 이름을 입력해주세요.' })
    .max(20, { message: '서버 이름은 최대 20자까지 입력할 수 있습니다.' }),
  description: z
    .string()
    .max(100, { message: '서버 설명은 최대 100자까지 입력할 수 있습니다.' }),
  slug: z
    .string()
    .min(4, { message: '서버 주소는 최소 4자 이상 입력해주세요.' })
    .max(20, { message: '서버 주소는 최대 20자까지 입력할 수 있습니다.' })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: '영문, 숫자, 하이픈(-)만 사용할 수 있습니다.',
    })
    .transform((val) => val.toLowerCase()),
  tags: z
    .array(
      z
        .string()
        .regex(/^[가-힣a-zA-Z0-9]+$/)
        .min(1, {
          message: '태그를 입력해주세요.',
        })
        .max(10, {
          message: '태그는 최대 10자까지 입력할 수 있습니다.',
        })
        .transform((val) => val.trim().toLowerCase())
    )
    .min(1, {
      message: '최소 1개의 태그를 등록해주세요.',
    })
    .max(5, {
      message: '최대 5개의 태그를 등록할 수 있습니다.',
    }),
  joinType: z.enum(ServerJoinType).default(ServerJoinType.DIRECT),
});
