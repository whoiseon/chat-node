import Router from '@koa/router';

import api from './api';

const routes = new Router();

routes.get('/', async (ctx) => {
  ctx.body = {
    message: 'hello world',
    ips: ctx.state.ipaddr,
  };
});

routes.use('/api', api.routes());

export default routes;
