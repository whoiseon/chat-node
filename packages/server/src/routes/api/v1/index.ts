import Router from '@koa/router';

import auth from './auth';

const v1 = new Router();

v1.get('/check', async (ctx) => {
  ctx.body = {
    version: 'v1',
  };
});

v1.get('/test', async (ctx) => {
  ctx.body = {
    user_id: ctx.state.user_id,
  };
});

v1.use('/auth', auth.routes());

export default v1;
