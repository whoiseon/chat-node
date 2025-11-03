'use client';

import { cn } from '@/lib/utils';
import { Icons } from './icon';

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function Logo({ className, size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: '[&_svg]:size-3 p-1',
    md: '[&_svg]:size-5 p-1.5',
    lg: '[&_svg]:size-6 p-2',
  };
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-blue-500 dark:bg-blue-400 rounded-sm',
        sizeMap[size],
        className
      )}
    >
      <Icons.LogoIcon className="text-white" />
    </div>
  );
}
