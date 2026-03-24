import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function shouldRefresh(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 < Date.now();
}

function getMaxAge(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return 0;
  return Math.max(0, Math.floor(payload.exp - Date.now() / 1000));
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('x-pathname', request.nextUrl.pathname);
  response.headers.set(
    'x-search-params',
    request.nextUrl.searchParams.toString(),
  );

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken || !API_BASE_URL) {
    return response;
  }

  if (accessToken && !shouldRefresh(accessToken)) {
    return response;
  }

  try {
    const cookieParts = [`refresh_token=${refreshToken}`];
    if (accessToken) cookieParts.unshift(`access_token=${accessToken}`);

    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: cookieParts.join('; '),
      },
    });

    if (!refreshRes.ok) {
      return response;
    }

    const data = await refreshRes.json();
    const tokens = data?.payload;

    if (!tokens?.access_token || !tokens?.refresh_token) {
      return response;
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const baseCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict' as const,
      path: '/',
    };

    response.cookies.set('access_token', tokens.access_token, {
      ...baseCookieOptions,
      maxAge: getMaxAge(tokens.access_token),
    });
    response.cookies.set('refresh_token', tokens.refresh_token, {
      ...baseCookieOptions,
      maxAge: getMaxAge(tokens.refresh_token),
    });

    request.cookies.set('access_token', tokens.access_token);
    request.cookies.set('refresh_token', tokens.refresh_token);
  } catch {
    // 리프레시 실패 시 기존 쿠키 유지
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
