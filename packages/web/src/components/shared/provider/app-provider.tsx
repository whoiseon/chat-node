'use client';

import ThemeProvider from './theme-provider';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
