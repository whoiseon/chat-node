'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { LogoText } from '@/shared/components/ui/logo';

import { useMe } from '@/features/user/hooks/use-me';
import UserProfileDropdown from '@/features/user/components/user-profile-dropdown';

import { useSidebarScroll } from './context/sidebar-scroll-context';

export default function SidebarFooter() {
  const { data: me } = useMe();
  const { isBottom } = useSidebarScroll();

  return (
    <div
      className={cn(
        'flex items-center w-full h-[48px] transition-all duration-100',
        !isBottom
          ? 'border-t border-t-stone-250 dark:border-t-stone-750'
          : 'border-t-0'
      )}
    >
      <div className="flex justify-between items-center p-2 h-full w-full">
        {me ? (
          <UserProfileDropdown
            nodeconId={me.mainNodeConId}
            username={me.username}
          />
        ) : (
          <Button
            asChild
            variant="ghost"
            className="text-muted-foreground hover:bg-stone-200 dark:hover:bg-stone-750 items-center justify-start px-2 h-8!"
          >
            <Link
              href="/auth/login"
              className="h-full flex items-center flex-1 text-sm text-muted-foreground gap-x-1!"
            >
              <LogoText className="text-sm font-bold" />
              <span className="text-sm font-bold">시작하기</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
