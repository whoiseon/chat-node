'use client';

import SidebarContent from './sidebar-content';
import SidebarFooter from './sidebar-footer';
import SidebarHeader from './sidebar-header';
import { SidebarScrollProvider } from './context/sidebar-scroll-context';

export default function Sidebar() {
  return (
    <SidebarScrollProvider>
      <div className="w-full h-full flex flex-col bg-sidebar">
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter />
      </div>
    </SidebarScrollProvider>
  );
}
