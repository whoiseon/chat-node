import Router from "@koa/router";
import { NpService } from "./np.service";
import { requireAuth } from "@/lib/middlewares/auth";
import { BusinessError } from "@/lib/middlewares/error";
import { generateResponseBody } from "@/lib/utils";
import { UserNpResponse } from "./np.types";

const np = new Router();
const npService = new NpService();

/**
 * 유저 np 조회
 */
np.get('/', requireAuth, async (ctx) => {
  const userId = ctx.state.userId;

  if (!userId) {
    throw new BusinessError('로그인이 필요합니다.');
  }

  const np = await npService.getNpByUser(userId);

  ctx.body = generateResponseBody<UserNpResponse>(true, '', {
    userId,
    np: np ?? 0
  })
})

export default np;