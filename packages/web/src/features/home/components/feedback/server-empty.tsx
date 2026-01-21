'use client';

import { Icons } from '@/shared/components/ui/icon';
import { cn } from '@/shared/lib/utils';

export function ServerEmpty() {
  return (
    <div className="flex items-center justify-center py-20">
      <div>
        <li
          className={cn(
            'flex flex-col w-full bg-card rounded min-h-50 shadow-card hover:translate-y-[-2px] transition-all duration-300'
          )}
        >
          <div className="relative">
            <div className="relative z-0 flex aspect-video items-center justify-center rounded-t overflow-hidden">
              123
            </div>
          </div>
          <div className="flex flex-col">
            <div className="border-b border-b-card-border px-3 py-2.5 space-y-1.5">
              123
            </div>
          </div>
          <div className="border-b border-b-card-border px-3 py-2.5 text-xs flex items-center gap-x-4 text-muted-foreground">
            <div className="flex items-center gap-x-1">
              <Icons.Users className="size-3.5" />
              <span className="font-medium">123</span>
            </div>
            <div className="flex items-center gap-x-1">
              <Icons.Star className="size-3.5" />
              <span className="font-medium">123</span>
            </div>
            <div className="flex items-center gap-x-1">
              <Icons.Since className="size-3.5" />
              <span className="font-medium">123</span>
            </div>
          </div>
        </li>
      </div>
    </div>
  );
}
