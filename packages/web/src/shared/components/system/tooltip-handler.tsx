'use client';

import { ReactNode } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

interface TooltipHandlerProps {
  content: string;
  children: ReactNode;
  sideOffset?: number;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  customContent?: (content: string) => ReactNode;
}

export function TooltipHandler({
  content,
  children,
  sideOffset = 4,
  className,
  side = 'top',
  align = 'center',
  customContent,
}: TooltipHandlerProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        className={className}
        align={align}
      >
        {customContent ? customContent(content) : content}
      </TooltipContent>
    </Tooltip>
  );
}
