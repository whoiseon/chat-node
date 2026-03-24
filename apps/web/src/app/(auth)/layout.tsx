import { Button } from '@repo/ui/components/ui/button';
import { LogoText } from '@repo/ui/components/ui/logo';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { getCookieString } from '@/app/_actions/get-cookie-string';
import { TopBar } from '@/components/system/top-bar';
import { authApi } from '@/lib/api/services/auth.api';

export default async function SessionLayout({ children }: PropsWithChildren) {
  const headerStore = await headers();
  const searchParams = new URLSearchParams(
    headerStore.get('x-search-params') || '',
  );
  const redirectUrl = searchParams.get('redirect');

  const cookieString = await getCookieString();

  const response = await authApi.getMe(cookieString);
  const isAuthenticated = !!response?.payload?.user;

  if (isAuthenticated) {
    return redirect(redirectUrl || '/');
  }

  return (
    <div className="flex flex-col h-full w-full">
      <TopBar customBackButton={<LogoText />} isCard={false} hasBackButton />
      <div className="flex flex-col flex-1 min-w-100 md:mx-auto px-4">
        {children}
      </div>
      <div className="flex items-center justify-center min-h-20">
        <Button variant="link">이용약관</Button>
        <Button variant="link">개인정보처리방침</Button>
      </div>
    </div>
  );
}
