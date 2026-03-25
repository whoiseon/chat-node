'use client';

import ReactQueryProvider from '@/components/provider/react-query-provider';
import UiProvider from '@/components/provider/ui-provider';

import type { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <UiProvider>{children}</UiProvider>
    </ReactQueryProvider>
  );
}
