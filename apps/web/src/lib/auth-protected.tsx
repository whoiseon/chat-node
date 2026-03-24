import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { type PropsWithChildren } from 'react';

import { getCookieString } from '@/app/_actions/get-cookie-string';
import { authApi } from '@/lib/api/services/auth.api';

export default async function AuthProtected({ children }: PropsWithChildren) {
  // 서버사이드에서 쿠키 읽기
  const cookieString = await getCookieString();

  const response = await authApi.getMe(cookieString);
  const isAuthenticated = !!response?.payload?.user;

  const headerStore = await headers();
  const pathname = headerStore.get('x-pathname');

  if (!isAuthenticated) {
    const loginUrl = pathname ? '/login?redirect=' + pathname : '/login';
    return redirect(loginUrl);
  }

  return <>{children}</>;
}
