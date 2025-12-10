'use client';

import { cn } from '@/shared/lib/utils';

interface SettingRowBlockProps {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  children: React.ReactNode;
}

export function SettingRowBlock({
  title,
  description,
  className,
  containerClassName,
  titleClassName,
  children,
}: SettingRowBlockProps) {
  return (
    <div className={cn('py-4', className)}>
      <div className={cn('flex', containerClassName)}>
        <div className="w-38 shrink-0">
          <h3
            className={cn(
              'leading-normal font-semibold text-foreground',
              titleClassName
            )}
          >
            {title}
          </h3>
        </div>
        <div className="flex-1 flex items-center">{children}</div>
      </div>
      {description && (
        <div className="mt-4 text-sm font-normal text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  );
}
