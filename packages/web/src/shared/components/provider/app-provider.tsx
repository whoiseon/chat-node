'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactQueryProvider from './react-query-provider';
import ThemeProvider from './theme-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
      <ReactQueryDevtools />
    </ReactQueryProvider>
  );
}
