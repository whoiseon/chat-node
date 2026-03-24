import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
    tokenId: string;
  }
}
