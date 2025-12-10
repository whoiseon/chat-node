'use client';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Icons } from '@/shared/components/ui/icon';

export function ServerFilterBlock() {
  return (
    <div className="relative py-3 mx-auto my-0 w-full">
      <div className="flex items-center justify-between">
        <ServerFilterNav />
        <div>2</div>
      </div>
      {/* <div>1</div> */}
    </div>
  );
}

const filterType = [
  {
    label: '최신',
    value: 'latest',
    icon: <Icons.Clock strokeWidth={2} />,
  },
  {
    label: '태그',
    value: 'tag',
    icon: <Icons.Tag strokeWidth={2} />,
  },
  {
    label: '인기',
    value: 'popular',
    icon: <Icons.Flame strokeWidth={2} />,
  },
];

function ServerFilterNav() {
  const query = useSearchParams();
  const type = query.get('type') || 'latest';

  return (
    <ul className="flex items-center gap-x-2">
      {filterType.map((item) => {
        const isActive = type === item.value;
        return (
          <li key={item.value}>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                'text-muted-foreground text-lg font-medium px-4 h-9',
                isActive && 'text-foreground font-bold'
              )}
            >
              <Link
                href={`?type=${item.value}`}
                className="flex items-center gap-x-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
