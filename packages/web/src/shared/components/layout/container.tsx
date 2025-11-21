'use client';

import { cn } from '@/shared/lib/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full min-w-[1280px] max-w-[1280px] px-4',
        className
      )}
    >
      {children}
    </div>
  );
}
