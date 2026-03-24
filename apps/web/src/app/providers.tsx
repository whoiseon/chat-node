'use client';

import ReactQueryProvider from '@/components/providers/react-query-provider';
import UiProvider from '@/components/providers/ui-provider';

import type { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <UiProvider>{children}</UiProvider>
    </ReactQueryProvider>
  );
}
