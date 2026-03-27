'use client';

import { Icons } from '@repo/ui/components/ui/icons';
import { cn } from '@repo/ui/lib/utils';

interface Props {
  displayName: string;
  username: string;
  hideUsername?: boolean;
  className?: string;
}

export function ManagerViewer({
  displayName,
  username,
  hideUsername = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-x-1 text-muted-foreground text-sm',
        className,
      )}
    >
      <Icons.Crown className="size-3.5" />
      <span>
        {displayName}
        {!hideUsername && `(${username})`}
      </span>
    </div>
  );
}
