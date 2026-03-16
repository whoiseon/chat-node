import { ReactNode } from "react"
import { cookies } from "next/headers";

import { ServerLayout } from "@/shared/components/layout/server-layout";
import { type Layout } from "react-resizable-panels";

interface ServerLayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: ServerLayoutProps) {
  // 쿠키 가져오기
  const cookieStore = await cookies();
  const groupId = 'server-panel-group';

  // 리사이즈 패널 레이아웃 데이터
  const defaultLayoutString = cookieStore.get(groupId)?.value;

  // 기본 레이아웃 데이터
  const defaultLayout = defaultLayoutString ? (JSON.parse(defaultLayoutString) as Layout) : undefined

  return <ServerLayout defaultLayout={defaultLayout} groupId={groupId}>{children}</ServerLayout>;
}