'use client';

import { ThemeProvider } from '@repo/ui/components/providers/theme-provider';
import { Toaster } from '@repo/ui/components/ui/sonner';
import { Suspense } from 'react';

export default function UiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        {children}
        {/*<ModalContainer />*/}
        <Toaster />
      </Suspense>
    </ThemeProvider>
  );
}
