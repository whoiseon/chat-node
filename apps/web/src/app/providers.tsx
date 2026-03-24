'use client';

import type { PropsWithChildren } from 'react';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import UiProvider from '@/components/providers/ui-provider';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <UiProvider>{children}</UiProvider>
    </ReactQueryProvider>
  );
}
