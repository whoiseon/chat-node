'use client';

import { cn } from '@/lib/utils';
import { useSidebarScroll } from './context/sidebar-scroll-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';
import { LogoText, Logo } from '@/components/ui/logo';

export default function SidebarFooter() {
  const { isBottom } = useSidebarScroll();
  return (
    <div
      className={cn(
        'flex items-center w-full h-[48px] transition-all duration-100',
        !isBottom ? 'border-t border-t-border' : 'border-t-0'
      )}
    >
      <div className="flex justify-between items-center p-2 h-full w-full">
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground hover:bg-stone-200 dark:hover:bg-stone-750 items-center justify-start px-2"
        >
          <Link
            href="/auth/login"
            className="h-full flex items-center flex-1 text-sm text-muted-foreground gap-x-1!"
          >
            <LogoText className="text-sm font-bold" />
            <span className="text-sm font-bold">시작하기</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-stone-200 dark:hover:bg-stone-750"
        >
          <Icons.Settings />
        </Button>
      </div>
    </div>
  );
}
