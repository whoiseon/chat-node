import '@/styles/globals.css';

import { type Metadata } from 'next';
import AppProvider from '@/components/shared/provider/app-provider';

export const metadata: Metadata = {
  title: '챗노드 - ChatNode',
  description: '채팅 앱',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased h-dvh overflow-hidden relative bg-background">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
