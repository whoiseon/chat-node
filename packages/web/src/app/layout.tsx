import '@/styles/globals.css';

import { type Metadata } from 'next';
import AppProvider from '@/shared/components/provider/app-provider';
import { queryKey } from '@/shared/hooks/query-key';
import { getMe } from '@/shared/lib/api/auth';
import { cookies } from 'next/headers';
import { getQueryClient } from '@/shared/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: '챗노드 - ChatNode',
  description: '채팅 앱',
};

async function prefetchMe() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: queryKey.auth.me(),
      queryFn: () => getMe(accessToken),
    });
  } catch (error) {
    console.log('User not authenticated');
  }

  return queryClient;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = await prefetchMe();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased h-dvh overflow-hidden relative bg-background">
        <AppProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </AppProvider>
      </body>
    </html>
  );
}
