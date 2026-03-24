'use client';

import { Suspense } from 'react';
import { ThemeProvider } from '@repo/ui/components/providers/theme-provider';

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
      </Suspense>
    </ThemeProvider>
  );
}
