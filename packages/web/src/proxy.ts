import { NextRequest, NextResponse } from 'next/server';

import { API_ENDPOINTS } from '@/shared/lib/api/endpoints';

export async function proxy(request: NextRequest) {
  // const response = NextResponse.next(); // Removed: response is created later

  const accessToken = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isAuthenticated = !!accessToken;

  // 인증이 필요한 라우트
  const privateRoutes = ['/create-server'];

  if (privateRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 인증된 사용자가 auth 페이지 접근
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}${API_ENDPOINTS.USER.ME}`,
      {
        method: 'GET',
        headers: {
          Cookie: request.cookies.toString(),
        },
      }
    );

    const setCookieHeader = backendResponse.headers.get('set-cookie');

    if (setCookieHeader) {
      // 백엔드에서 받은 쿠키를 파싱하여 요청 헤더에 업데이트
      const newHeaders = new Headers(request.headers);
      newHeaders.set('Cookie', setCookieHeader);

      // 더 정교한 처리가 필요하다면 set-cookie-parser 등을 사용해야 함.
      // 하지만 보통 fetch의 Cookie 헤더는 하나로 합쳐져서 전송됨.
      // 여기서는 간단히 백엔드가 준 전체 Set-Cookie 값을 Cookie 헤더로 설정하여 다음 요청(Layout)에 전달.
      // 주의: Set-Cookie는 여러 개일 수 있음. fetch API에서는 getSetCookie() 사용 권장.

      const cookies = backendResponse.headers.getSetCookie
        ? backendResponse.headers.getSetCookie()
        : [setCookieHeader];
      const cookieString = cookies.map((c) => c.split(';')[0]).join('; ');

      newHeaders.set('Cookie', cookieString);

      // 갱신된 헤더로 다음 응답 생성
      const response = NextResponse.next({
        request: {
          headers: newHeaders,
        },
      });

      // 브라우저에도 새 쿠키 설정
      cookies.forEach((cookie) => {
        response.headers.append('Set-Cookie', cookie);
      });

      return response;
    }
  } catch (error) {}

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
