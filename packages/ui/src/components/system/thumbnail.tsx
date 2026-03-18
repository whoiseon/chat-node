'use client';

import { cn } from '@repo/ui/lib/utils';
import Image from 'next/image';

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
      <Image
        src="/images/no-image.svg"
        alt={alt || 'no-image'}
        fill
        className="object-cover"
        loading="eager"
      />
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
