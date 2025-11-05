import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { koaMiddleware } from '@as-integrations/koa';
import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';

import cors from '@/lib/middlewares/cors';
import { db } from './database';
import { consumeUser, resetTokenCookie } from './lib/token';
import routes from './routes';

async function bootstrap(app: Koa, port: string) {
  // Middlewares
  app.use(cors);
  app.use(bodyParser());
  app.use(consumeUser);
  app.use(logger());

  app.use(routes.routes()).use(routes.allowedMethods());

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
}

export default bootstrap;
