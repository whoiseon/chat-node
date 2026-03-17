'use client';

import { cn } from '@repo/ui/lib/utils';

import { Icons } from './icons';

type TextProps = {
  className?: string;
};

export function LogoText({ className }: TextProps) {
  return (
    <h1 className={cn('text-base tracking-tight font-bold', className)}>
      ChatNode
    </h1>
  );
}

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: '[&_svg]:size-3 p-1',
    md: '[&_svg]:size-4 p-1.5',
    lg: '[&_svg]:size-6 p-2',
  };
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-violet-500 dark:bg-violet-500 rounded-sm',
        sizeMap[size],
        className,
      )}
    >
      <Icons.LogoIcon className="text-white" />
    </div>
  );
}

type LogoWithTextProps = {
  className?: string;
  logoClassName?: string;
  goHome?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function LogoWithText({
  className,
  logoClassName,
  goHome = true,
  size = 'md',
}: LogoWithTextProps) {
  if (goHome) {
    return (
      <a href="/" className={cn('flex items-center gap-x-2', className)}>
        <Logo size={size} className={logoClassName} />
        <LogoText />
      </a>
    );
  }
  return (
    <div className={cn('flex items-center gap-x-2', className)}>
      <Logo size={size} className={logoClassName} />
      <LogoText className="text-sm" />
    </div>
  );
}
