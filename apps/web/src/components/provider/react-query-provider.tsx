'use client';

import { extractError } from '@repo/api-types';
import { getToast } from '@repo/ui/lib/toast';
import {
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.skipGlobalErrorHandler) return;

        const toast = getToast();
        const errorResponse = extractError(error);

        toast({
          type: 'error',
          message: errorResponse!.error?.message,
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, query) => {
        const toast = getToast();
        const errorResponse = extractError(error);
        toast({
          type: 'error',
          message: errorResponse!.error?.message,
        });
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
type Props = {
  children: ReactNode;
};

export default function ReactQueryProvider({ children }: Props) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
