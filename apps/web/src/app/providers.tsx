import { getCookieString } from '@/app/_actions/get-cookie-string';
import ReactQueryProvider from '@/components/provider/react-query-provider';
import SocketProvider from '@/components/provider/socket-provider';
import UiProvider from '@/components/provider/ui-provider';

import type { PropsWithChildren } from 'react';

export default async function Providers({ children }: PropsWithChildren) {
  const cookie = await getCookieString();

  return (
    <ReactQueryProvider>
      <SocketProvider cookie={cookie}>
        <UiProvider>{children}</UiProvider>
      </SocketProvider>
    </ReactQueryProvider>
  );
}
