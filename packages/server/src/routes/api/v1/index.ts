import Router from '@koa/router';

import auth from './auth';
import user from './user';
import files from './files';

const v1 = new Router();

v1.get('/check', async (ctx) => {
  ctx.body = {
    version: 'v1',
  };
});

v1.use('/auth', auth.routes());
v1.use('/user', user.routes());
v1.use('/files', files.routes());

export default v1;
