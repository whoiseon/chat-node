'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';
import Sidebar from './sidebar/sidebar';

type AppLayoutProps = {
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
};

export function AppLayout({
  children,
  defaultLayout = [13, 87],
}: AppLayoutProps) {
  const onLayout = (sizes: number[]) => {
    // 리사이즈 패널 레이아웃 데이터 저장
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={onLayout}
      id="main-panel-group"
    >
      <ResizablePanel
        id="sidebar-panel"
        className="min-w-[240px] max-w-[480px]"
        defaultSize={defaultLayout[0]}
      >
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle
        id="main-panel-resizable-handle"
        className="cursor-col-resize bg-border hover:shadow-outline hover:bg-border-accent"
      />
      <ResizablePanel id="content-panel" defaultSize={defaultLayout[1]}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
