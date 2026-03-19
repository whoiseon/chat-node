import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger API 문서 설정
 * @param app - NestJS Fastify 애플리케이션 인스턴스
 * @returns 문서 설정 완료 시 프로미스 반환
 */
export const swagger = (app: NestFastifyApplication): void => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('chat-node api docs')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
};
