'use client';

import { cn } from '@/lib/utils';
import { useSidebarScroll } from './context/sidebar-scroll-context';

export default function SidebarFooter() {
  const { isBottom } = useSidebarScroll();
  return (
    <div
      className={cn(
        'w-full h-[48px] transition-all duration-100',
        !isBottom ? 'border-t border-t-border' : 'border-t-0'
      )}
    >
      123
    </div>
  );
}
