'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import { Skeleton } from '../../ui/skeleton';
import { useMemo } from 'react';

type SidebarGroupProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

function SidebarGroup({ children, title, className }: SidebarGroupProps) {
  return (
    <div className={cn('flex flex-col px-2 pb-2 gap-y-px', className)}>
      {title && (
        <span className="text-xs font-semibold px-2 text-muted-foreground h-[30px] flex items-center">
          {title}
        </span>
      )}
      {children}
    </div>
  );
}

SidebarGroup.displayName = 'SidebarGroup';

type SidebarGroupItemProps = {
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  className?: string;
};

function SidebarGroupItem({
  children,
  href,
  icon,
  className,
}: SidebarGroupItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        className,
        'h-[30px] flex items-center px-2 py-1 rounded-md text-muted-foreground hover:bg-accent gap-x-2 [&_svg]:size-4.5 transition-all duration-100',
        isActive ? 'bg-stone-200 dark:bg-stone-750' : ''
      )}
    >
      {icon}
      <span
        className={cn('text-sm font-semibold', isActive && 'text-foreground')}
      >
        {children}
      </span>
    </Link>
  );
}

function SidebarGroupItemSkeleton({ index }: { index: number }) {
  // index를 기반으로 결정론적인 값을 생성하여 서버와 클라이언트에서 동일한 값 보장
  const randomWidth = useMemo(() => {
    // 간단한 해시 함수를 사용하여 index를 기반으로 40-100 사이의 값을 생성
    const hash = (10 - index * 9301 + 49297) % 233280;
    const normalized = hash / 233280;
    const width = Math.floor(normalized * (100 - 40 + 1)) + 30;
    return `${width}%`;
  }, [index]);

  return (
    <div className="h-[30px] flex items-center px-2 py-1 rounded-md text-muted-foreground hover:bg-accent gap-x-2 [&_svg]:size-4.5 transition-all duration-100">
      <Skeleton className="size-4.5" />
      <Skeleton
        className={cn('h-[16px]')}
        style={{
          width: randomWidth,
        }}
      />
    </div>
  );
}

SidebarGroupItemSkeleton.displayName = 'SidebarGroupItemSkeleton';

SidebarGroupItem.displayName = 'SidebarGroupItem';

SidebarGroup.Item = SidebarGroupItem;
SidebarGroup.ItemSkeleton = SidebarGroupItemSkeleton;

export default SidebarGroup;
export { SidebarGroupItem, SidebarGroupItemSkeleton };
