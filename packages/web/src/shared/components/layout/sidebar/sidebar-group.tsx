'use client';

import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';

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

SidebarGroupItem.displayName = 'SidebarGroupItem';

SidebarGroup.Item = SidebarGroupItem;

export default SidebarGroup;
