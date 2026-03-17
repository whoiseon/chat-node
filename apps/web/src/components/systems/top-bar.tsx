'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';
import { cn } from '@repo/ui/lib/utils';

interface TopBarProps {
  title?: string;
  customTitle?: React.ReactNode;
  className?: string;
  hasBackButton?: boolean;
  right?: React.ReactNode;
  isCard?: boolean;
}

export default function TobBar({
  title,
  customTitle,
  className,
  hasBackButton = true,
  right,
  isCard = true,
}: TopBarProps) {
  return (
    <header className="sticky top-0">
      <div
        className={cn(
          'h-14 px-4 flex items-center justify-between',
          className,
          isCard && 'bg-card rounded-b-md border-b border-x border-border',
        )}
      >
        <div className="flex items-center gap-x-2">
          {hasBackButton && (
            <Button variant="ghost" size="icon">
              <Icons.ArrowLeft className="size-5" />
            </Button>
          )}
          {customTitle ? (
            customTitle
          ) : (
            <h1 className="text-base font-semibold">{title}</h1>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}
