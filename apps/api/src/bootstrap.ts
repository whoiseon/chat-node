import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { Env } from '@/common/utils';
import { generateOpenApiJson, swagger } from '@/swagger';

export const bootstrap = async (app: NestFastifyApplication): Promise<void> => {
  // 애플리케이션 이벤트 로깅을 위한 로거 인스턴스 설정
  const logger = new Logger('bootstrap');

  // 환경 변수 설정
  const configService = app.get(ConfigService<Env>);

  // 전역 prefix
  app.setGlobalPrefix('api/v1');

  // 쿠키 파서 등록
  await app.register(cookie);

  // 보안 헤더 설정
  await app.register(helmet, {
    global: true,
    permittedCrossDomainPolicies: false,
  });

  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS') || '';

  // CORS 설정
  app.enableCors({
    credentials: true,
    origin: allowedOrigins.split(','),
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // 유효성 검사 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const isProduction = configService.get('NODE_ENV') === 'production';

  if (!isProduction) {
    swagger(app);
  } else {
    generateOpenApiJson(app);
  }

  await app.listen(configService.get('PORT')!, '0.0.0.0', () => {
    logger.log(`env : .env.${configService.get('NODE_ENV')}`);
    logger.log(
      `This application started at ${configService.get('HOST')}:${configService.get('PORT')}`,
    );
  });
};
