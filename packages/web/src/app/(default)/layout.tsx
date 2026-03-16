import { cookies } from 'next/headers';
import { Layout } from 'react-resizable-panels';

import { AppLayout } from '@/shared/components/layout/app-layout';

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 쿠키 가져오기
  const cookieStore = await cookies();
  const groupId = 'main-panel-group';

  // 리사이즈 패널 레이아웃 데이터
  const defaultLayoutString = cookieStore.get(groupId)?.value;

  // 기본 레이아웃 데이터
  const defaultLayout = defaultLayoutString ? (JSON.parse(defaultLayoutString) as Layout) : undefined

  return <AppLayout defaultLayout={defaultLayout} groupId={groupId}>{children}</AppLayout>;
}
