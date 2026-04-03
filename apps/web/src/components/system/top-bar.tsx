'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface TopBarProps {
  ref?: React.RefObject<HTMLDivElement | null>;
  title?: string;
  customTitle?: React.ReactNode;
  className?: string;
  hasBackArrow?: boolean;
  hasBackButton?: boolean;
  customBackButton?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  isCard?: boolean;
  searchMode?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onExitSearch?: () => void;
}

export function TopBar({
  ref,
  title,
  customTitle,
  className,
  hasBackArrow = true,
  hasBackButton = false,
  customBackButton,
  right,
  isCard = true,
  searchMode = false,
  searchValue,
  onSearchChange,
  onExitSearch,
  bottom,
}: TopBarProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    router.replace('/');
  };

  useEffect(() => {
    if (!searchMode) return;
    searchInputRef.current?.focus();
  }, [searchMode]);

  const hasTitle = title || customTitle;

  return (
    <header className="sticky top-0 z-10" ref={ref}>
      <div
        className={cn(
          'h-15 px-4 shadow-[0_2px_20px_rgba(0,0,0,0.05)] dark:shadow-none',
          className,
          isCard && 'bg-card rounded-b-xl',
        )}
      >
        <div className="flex flex-col justify-center h-full">
          <div className="flex items-center justify-between">
            {searchMode ? (
              <div className="flex gap-x-2 flex-1 items-center">
                <form
                  className="relative flex-1"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Icons.Search className="absolute size-4 text-muted-foreground -translate-y-1/2 top-1/2 left-3" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    className="pl-9 h-8 bg-input ring-0!"
                    placeholder="대화 내용"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                  />
                </form>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onExitSearch}
                  className="text-muted-foreground"
                >
                  <Icons.X className="size-5" />
                </Button>
                <div
                  className={cn(
                    'absolute -bottom-8 right-0 h-6 px-2 transition-all duration-300',
                    '-translate-y-2 opacity-0 pointer-events-none',
                    searchValue &&
                      'opacity-100 pointer-events-auto translate-y-0',
                  )}
                >
                  <div className="h-10 flex items-center justify-end gap-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground bg-card size-10 hover:bg-stone-200 dark:hover:bg-stone-700/50"
                    >
                      <Icons.ChevronUp className="size-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground bg-card size-10 hover:bg-stone-200 dark:hover:bg-stone-700/50"
                    >
                      <Icons.ChevronDown className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-x-2">
                  {hasBackButton && (
                    <Button
                      variant="ghost"
                      size={!hasTitle ? 'default' : 'icon'}
                      onClick={handleBack}
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
              </>
            )}
          </div>
          {bottom}
        </div>
      </div>
    </header>
  );
}
