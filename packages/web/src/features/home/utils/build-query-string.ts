import {
  DEFAULT_FILTER_TYPE,
  ServerFilterParams,
  ServerFilterType,
} from '../types/server-filter.types';

/**
 * 필터 파라미터를 query string으로 변환
 */
export function buildQueryString(params: Partial<ServerFilterParams>): string {
  const searchParams = new URLSearchParams({});

  if (params.type) {
    searchParams.set('type', params.type);
  }

  if (params.tags && params.tags.length > 0) {
    // 태그는 ','로 구분하여 전달 (예: ?tags=react,nextjs)
    const tagString = params.tags.join(',');
    searchParams.set('tags', tagString);
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  if (params.search_target) {
    searchParams.set('search_target', params.search_target);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * URLSearchParams를 ServerFilterParams로 변환
 */
export function parseQueryParams(
  searchParams: URLSearchParams
): ServerFilterParams {
  const type = (searchParams.get('type') ||
    DEFAULT_FILTER_TYPE) as ServerFilterType;
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? [];
  const search = searchParams.get('search') || '';
  const searchTarget = searchParams.get('search_target') || '';

  return {
    type,
    ...(tags.length > 0 && { tags }),
    search,
    search_target: searchTarget,
  };
}
