'use client';

import { cn } from '@repo/ui/lib/utils';

interface RequiredLabelSymbolProps {
  className?: string;
}

export function RequiredLabelSymbol({ className }: RequiredLabelSymbolProps) {
  return (
    <span className={cn('text-red-500 dark:text-red-400', className)}>*</span>
  );
}
