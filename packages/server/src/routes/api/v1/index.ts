import Router from '@koa/router';

import auth from './auth';
import user from './user';
import np from './np';
import files from './files';
import server from './server';

const v1 = new Router();

v1.get('/check', async (ctx) => {
  ctx.body = {
    version: 'v1',
  };
});

v1.use('/auth', auth.routes());
v1.use('/user', user.routes());
v1.use('/np', np.routes());
v1.use('/server', server.routes());
v1.use('/files', files.routes());

export default v1;
