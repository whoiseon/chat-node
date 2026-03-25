'use client';

import { Icons } from '@repo/ui/components/ui/icons';
import { cn } from '@repo/ui/lib/utils';
import Image from 'next/image';
import * as React from 'react';

interface ThumbnailProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function Thumbnail({
  src,
  alt,
  fill = true,
  className,
  loading = 'eager',
}: ThumbnailProps) {
  if (!src) {
    return (
      <div className="flex size-full items-center justify-center rounded-sm bg-stone-200 dark:bg-stone-800 text-sm text-muted-foreground">
        <Icons.LogoIcon className="size-6" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || 'no-image'}
      fill={fill}
      className={cn('object-cover', className)}
      loading={loading}
    />
  );
}
