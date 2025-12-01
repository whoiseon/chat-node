import { cookies } from 'next/headers';

import AppLayout from '@/shared/components/layout/app-layout';

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 쿠키 가져오기
  const cookieStore = await cookies();

  // 리사이즈 패널 레이아웃 데이터
  const layout = cookieStore.get('react-resizable-panels:layout');

  // 기본 레이아웃 데이터
  let defaultLayout: number[] | undefined;

  // 리사이즈 패널 레이아웃 데이터가 있으면 파싱
  if (layout) {
    defaultLayout = JSON.parse(layout.value) as number[];
  }

  return <AppLayout defaultLayout={defaultLayout}>{children}</AppLayout>;
}
