'use client';

import { Toaster } from '../ui/sonner';
import { ReactQueryProvider } from './react-query-provider';
import ThemeProvider from './theme-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
      <Toaster />
    </ReactQueryProvider>
  );
}
