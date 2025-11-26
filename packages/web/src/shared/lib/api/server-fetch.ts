import { cookies } from 'next/headers';

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

export async function serverFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
    ...options.headers,
  };

  const fullUrl = url.startsWith('http')
    ? url
    : `${process.env.NEXT_PUBLIC_API_BASE}${url}`;

  return fetch(fullUrl, {
    ...options,
    headers,
  });
}
