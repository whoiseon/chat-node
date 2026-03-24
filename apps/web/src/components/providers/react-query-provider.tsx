'use client';

import {
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
// import { toast } from 'sonner';

import { extractError } from '@/lib/api';
// import { TOAST_DEFAULT_OPTIONS } from '@/lib/constants/toast.constants';

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
      onError: (error) => {
        const errorResponse = extractError(error);
        console.log('[errorResponse]', errorResponse);
        // toast.error(errorResponse!.error?.message, TOAST_DEFAULT_OPTIONS);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        const errorResponse = extractError(error);
        console.log('[errorResponse]', errorResponse);
        // toast.error(errorResponse!.error?.message, TOAST_DEFAULT_OPTIONS);
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
