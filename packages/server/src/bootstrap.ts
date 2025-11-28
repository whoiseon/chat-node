import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';
import path from 'path';

import cors from '@/lib/middlewares/cors';
import { extractUser } from '@/lib/middlewares/auth';
import { errorHandler } from '@/lib/middlewares/error';

import routes from './routes';

async function bootstrap(app: Koa, port: string) {
  // Middlewares
  app.use(cors);
  app.use(bodyParser());
  app.use(extractUser);
  app.use(logger());
  app.use(errorHandler);

  app.use(serve(path.join(__dirname, '..', 'public')));

  app.use(routes.routes()).use(routes.allowedMethods());

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

export default bootstrap;
