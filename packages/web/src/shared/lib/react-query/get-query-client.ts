import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import { cache } from 'react';

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // SSR에서는 staleTime을 설정해야 불필요한 refetch 방지
          staleTime: 60 * 1000, // 1분
          refetchOnWindowFocus: false,
          retry: false,
        },
        dehydrate: {
          // 성공한 쿼리만 dehydrate
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === 'pending',
        },
      },
    })
);
