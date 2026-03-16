'use client';

import { Layout } from 'react-resizable-panels';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';

type ServerLayoutProps = {
  children: React.ReactNode;
  defaultLayout: Layout | undefined;
  groupId: string;
};

export function ServerLayout({
  children,
  defaultLayout,
  groupId
}: ServerLayoutProps) {
  return (
    <ResizablePanelGroup
      id={groupId}
      defaultLayout={defaultLayout}
      onLayoutChange={(layout) => {document.cookie = `${groupId}=${JSON.stringify(layout)}; path=/;`}}
    >
      <ResizablePanel
        id="server-chat-panel"
        minSize="65%"
        maxSize="80%"
        defaultSize="80%"
      >
        {children}
      </ResizablePanel>
      <ResizableHandle
        id="server-panel-resizable-handle"
        className="cursor-col-resize bg-border hover:shadow-outline hover:bg-border-accent"
      />
      <ResizablePanel id="server-member-panel" minSize="20%" maxSize="35%" defaultSize="20%" className='bg-sidebar'>
        member
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}