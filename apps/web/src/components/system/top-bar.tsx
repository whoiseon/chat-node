'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';
import { cn } from '@repo/ui/lib/utils';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  title?: string;
  customTitle?: React.ReactNode;
  className?: string;
  hasBackArrow?: boolean;
  hasBackButton?: boolean;
  customBackButton?: React.ReactNode;
  right?: React.ReactNode;
  isCard?: boolean;
}

export default function TopBar({
  title,
  customTitle,
  className,
  hasBackArrow = true,
  hasBackButton = false,
  customBackButton,
  right,
  isCard = true,
}: TopBarProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10">
      <div
        className={cn(
          'h-14 px-4 flex items-center justify-between',
          className,
          isCard && 'bg-card rounded-b-lg',
        )}
      >
        <div className="flex items-center gap-x-2">
          {hasBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="-ml-2"
            >
              <div className="flex items-center gap-x-2">
                {hasBackArrow && <Icons.ArrowLeft className="size-5" />}
                {customBackButton}
              </div>
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
