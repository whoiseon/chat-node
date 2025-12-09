import Router from '@koa/router';

import { generateResponseBody } from '@/lib/utils';
import { requireAuth } from '@/lib/middlewares/auth';
import multer from '@koa/multer';

const files = new Router();
const upload = multer();

/**
 * 이미지 파일 업로드
 */
files.post('/create-url', requireAuth, async (ctx) => {});

export default files;
