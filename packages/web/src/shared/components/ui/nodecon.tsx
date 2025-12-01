'use client';

import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

interface NodeconProps {
  nodeconId: string;
  size?: number;
  className?: string;
}

export default function Nodecon({
  nodeconId,
  size = 20,
  className,
}: NodeconProps) {
  const nodeconImageUrl = `${process.env.NEXT_PUBLIC_NODECON_IMAGE_BASE}/${nodeconId}.png`;
  return (
    <div className={cn('relative mr-1', className)}>
      <Image
        src={nodeconImageUrl}
        alt={nodeconId}
        width={size}
        height={size}
        className={cn(className)}
      />
    </div>
  );
}
