import { Middleware } from 'koa';

const cors: Middleware = async (ctx, next) => {
  const allowedHosts = [/http:\/\/localhost:3060/, /http:\/\/localhost:3061/];

  if (process.env.NODE_ENV === 'development') {
    allowedHosts.push(/^http:\/\/localhost/);
  }

  const { origin } = ctx.headers;

  const valid = allowedHosts.some((regex) => regex.test(origin as any));

  // 유효한 origin인 경우 CORS 헤더 설정
  if (valid) {
    ctx.set('Access-Control-Allow-Origin', origin as any);
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cookie',
    );
    ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');
  }

  // OPTIONS 요청 (preflight) 처리
  if (ctx.method === 'OPTIONS') {
    if (valid) {
      ctx.status = 200;
      ctx.body = '';
    } else {
      ctx.status = 403;
      ctx.body = 'CORS policy violation';
    }
    return;
  }

  return next();
};

export default cors;
