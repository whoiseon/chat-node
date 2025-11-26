import '@/styles/globals.css';

import { type Metadata } from 'next';

import AppProvider from '@/shared/components/provider/app-provider';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { queryKey } from '@/shared/hooks/query-key';
import { serverFetch } from '@/shared/lib/api/server-fetch';

export const metadata: Metadata = {
  title: '챗노드 - ChatNode',
  description: '채팅 앱',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKey.auth.me(),
    queryFn: async () => {
      try {
        const response = await serverFetch('/auth/me', {
          cache: 'no-store',
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return data.payload ?? null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased h-dvh overflow-hidden relative bg-background">
        <AppProvider>
          <HydrationBoundary state={dehydratedState}>
            {children}
          </HydrationBoundary>
        </AppProvider>
      </body>
    </html>
  );
}
