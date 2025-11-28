import { Context } from 'koa';
import z from 'zod';

/**
 * Validation Body with Zod
 */
export function validateBody<T>(ctx: Context, schema: z.ZodSchema<T>) {
  const validate = schema.safeParse(ctx.request.body);
  if (!validate.success) {
    ctx.status = 200;
    ctx.body = {
      success: false,
      message: getFirstZodErrorMessage(validate.error),
    };
    return false;
  }
  return true;
}

/**
 * Error formatter
 */
export function extractErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '서버 오류가 발생했습니다';
}

/**
 * Response body generator
 */
export function generateResponseBody<T>(
  success: boolean,
  message: string,
  payload?: T
) {
  return {
    success,
    message,
    payload: payload ?? null,
  };
}

/**
 * Zod Error formatter
 */
function getFirstZodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message;
}

/**
 * 객체를 URL 쿼리 파라미터 문자열로 변환
 * @param params 파라미터 객체
 * @returns 쿼리 파라미터 문자열 (? 포함)
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * URL에 쿼리 파라미터를 안전하게 추가
 * @param baseUrl 기본 URL
 * @param params 추가할 파라미터
 * @returns 완성된 URL
 */
export function appendQueryParams(
  baseUrl: string,
  params: Record<string, any>
): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * URL에서 쿼리 파라미터를 객체로 파싱
 * @param url URL 문자열
 * @returns 파라미터 객체
 */
export function parseQueryParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  } catch {
    return {};
  }
}

/**
 * Safe Array
 */
export function safeArray<T>(array: T[]): T[] {
  if (array === null || array === undefined) {
    return [];
  }

  return Array.isArray(array) ? array : [];
}

/**
 * Safe Object
 */
export function safeObject<T>(object: T): T {
  if (object === null || object === undefined) {
    return {} as T;
  }
  return object;
}

/**
 * 배열이 비어있거나 undefined인지 확인
 */
export function isEmptyArray(array: unknown[]): boolean {
  return !array || array.length === 0;
}
