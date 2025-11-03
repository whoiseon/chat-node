import '@/styles/globals.css';

import type { Metadata } from 'next';
import AppLayout from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'ChatNode',
  description: '채팅 앱',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-dvh overflow-hidden relative bg-background">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
