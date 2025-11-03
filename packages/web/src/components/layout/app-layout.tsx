'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';
import Sidebar from './sidebar/sidebar';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="min-w-[240px] max-w-[480px]" defaultSize={15}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle className="cursor-col-resize bg-border hover:bg-border-accent" />
      <ResizablePanel defaultSize={85}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
}
