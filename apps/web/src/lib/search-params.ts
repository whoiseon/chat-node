/**
 * URL searchParams 공통 유틸
 * 리스트/필터 페이지마다 parse만 정의하고, merge는 이걸 쓰면 됨
 */
import { ReadonlyURLSearchParams } from 'next/dist/client/components/readonly-url-search-params';

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/**
 * URLSearchParams → 서버 page searchParams와 같은 형태의 Record
 * parseFromRecord 한 개만 정의하면 parseFromURL = (sp) => parseFromRecord(recordFromSearchParams(sp)) 로 재사용 가능
 */
export function recordFromSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): SearchParamsRecord {
  const record: SearchParamsRecord = {};
  searchParams.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

/**
 * 현재 URLSearchParams에 partial 반영한 새 URLSearchParams
 * value가 undefined/null/''이면 해당 키 제거
 * 모든 리스트/필터 요청 타입에 공통으로 사용 가능
 */
export function mergeSearchParams<T extends object>(
  current: URLSearchParams | ReadonlyURLSearchParams,
  partial: Partial<T>,
): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  (Object.keys(partial) as (keyof T)[]).forEach((key) => {
    const value = partial[key];
    if (value === undefined || value === null || value === '') {
      next.delete(key as string);
      return;
    }
    next.set(key as string, String(value));
  });
  return next;
}

export function extractQuery<T>(value: string): T | undefined {
  return value === 'all' ? undefined : (value as T);
}

export function extractQueryValue(value?: string): string {
  return value ?? 'all';
}

export function searchParamsToNumber(
  value: string | undefined,
): number | undefined {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export function searchParamsToString(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  const s = Array.isArray(value) ? value[0] : value;
  return s === '' ? undefined : s;
}
