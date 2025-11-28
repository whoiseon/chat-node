'use client';

import { Icons } from '../ui/icon';
import { cn } from '@/shared/lib/utils';

interface NPViewerProps {
  np: number;
  className?: string;
  pointClassName?: string;
  iconClassName?: string;
}

export default function NPViewer({
  np,
  className,
  pointClassName,
  iconClassName,
}: NPViewerProps) {
  return (
    <div className={cn('flex items-center gap-x-1', className)}>
      <span className={cn('font-bold text-sm', pointClassName)}>
        {np.toLocaleString()}
      </span>
      <Icons.NP className={cn('size-5', iconClassName)} />
    </div>
  );
}
