'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  buildQueryString,
  parseQueryParams,
} from '../utils/build-query-string';
import {
  DEFAULT_FILTER_TYPE,
  ServerFilterParams,
  ServerFilterType,
} from '../types/server-filter.types';
import { searchOptions } from '../constants/filter.constants';

interface ServerFilterContextProps {
  filters: ServerFilterParams;
  type: ServerFilterType;
  selectedTags: string[];
  setType: (type: ServerFilterType) => void;
  updateFilters: (newFilters: Partial<ServerFilterParams>) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  searchTarget: string;
  search: string;
  clearSearch: () => void;
}

export const ServerFilterContext = createContext<
  ServerFilterContextProps | undefined
>(undefined);

export function ServerFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 필터 조회
  const filters = parseQueryParams(searchParams);

  // 필터 업데이트
  const updateFilters = useCallback(
    (newFilters: Partial<ServerFilterParams>) => {
      const updatedFilters = {
        ...filters,
        ...newFilters,
      };

      // 태그가 비어있으면 제거
      if (updatedFilters.tags?.length === 0) {
        delete updatedFilters.tags;
      }

      const queryString = buildQueryString(updatedFilters);
      router.push(`${pathname}${queryString}`);
    },
    [filters, router, pathname]
  );

  // 홈 피드 타입 변경
  const setType = useCallback(
    (type: ServerFilterType) => {
      updateFilters({ type });
    },
    [updateFilters]
  );

  // 태그 추가 및 제거
  const toggleTag = useCallback(
    (tag: string) => {
      const currentTags = filters.tags ?? [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];

      updateFilters({ tags: newTags });
    },
    [filters.tags, updateFilters]
  );

  // 태그 초기화
  const clearTags = useCallback(() => {
    updateFilters({ tags: [] });
  }, [updateFilters]);

  // 검색 초기화
  const clearSearch = useCallback(() => {
    updateFilters({ search: '', search_target: '' });
  }, [updateFilters]);

  return (
    <ServerFilterContext.Provider
      value={{
        filters,
        type: filters.type || DEFAULT_FILTER_TYPE,
        selectedTags: filters.tags || [],
        setType,
        updateFilters,
        toggleTag,
        clearTags,
        searchTarget: filters.search_target || '',
        search: filters.search || '',
        clearSearch,
      }}
    >
      {children}
    </ServerFilterContext.Provider>
  );
}

export function useServerFilter() {
  const context = useContext(ServerFilterContext);

  if (context === undefined) {
    throw new Error(
      'useServerFilter must be used within a ServerFilterProvider'
    );
  }

  return context;
}
