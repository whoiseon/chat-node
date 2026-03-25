import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { writeFileSync } from 'node:fs';

/**
 * Swagger API 문서 설정
 * @param app - NestJS Fastify 애플리케이션 인스턴스
 */
export const swagger = (app: NestFastifyApplication): void => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('chat node api docs')
    .addBearerAuth()
    .setVersion('1.0')
    .setExternalDoc('Open API', 'http://localhost:4003/swagger-json')
    .addTag('chat node')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  writeFileSync(
    '../../packages/api-types/src/openapi.json',
    JSON.stringify(documentFactory(), null, 2),
  );

  SwaggerModule.setup('swagger', app, documentFactory(), {
    jsonDocumentUrl: '/swagger-json',
  });
};

/**
 * OpenAPI JSON 파일 생성 (프로덕션 빌드용)
 * @param app - NestJS Fastify 애플리케이션 인스턴스
 */
export const generateOpenApiJson = (app: NestFastifyApplication): void => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('chat node api docs')
    .addBearerAuth()
    .setVersion('1.0')
    .addTag('chat node')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  writeFileSync(
    '../../packages/api-types/src/openapi.json',
    JSON.stringify(document, null, 2),
  );
};
