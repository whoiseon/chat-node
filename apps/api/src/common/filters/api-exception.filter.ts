import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import type { ApiResponseDto } from '@/common/dto';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const { status, message, payload } = this.normalizeError(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiResponseDto<unknown> = {
      error: { message, status },
      payload,
    };

    httpAdapter.reply(ctx.getResponse(), body, status);
  }

  private normalizeError(exception: unknown): {
    status: number;
    message: string;
    payload: unknown | null;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      return {
        status,
        message: this.extractMessage(response),
        payload: this.extractPayload(response),
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '서버 에러 발생',
        payload: null,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '서버 에러 발생',
      payload: null,
    };
  }

  private extractPayload(response: string | object): unknown | null {
    if (typeof response !== 'object' || response === null) {
      return null;
    }
    if (!('payload' in response)) {
      return null;
    }
    const value = (response as Record<string, unknown>).payload;
    return value === undefined ? null : value;
  }

  private extractMessage(response: string | object): string {
    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const record = response as Record<string, unknown>;
      const raw = record.message ?? record.error;

      if (Array.isArray(raw)) {
        return raw.map((item) => String(item)).join(', ');
      }
      if (typeof raw === 'string') {
        return raw;
      }
    }

    return 'Error';
  }
}
