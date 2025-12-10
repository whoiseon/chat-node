'use client';

import Link from 'next/link';
import { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

import { TooltipHandler } from '@/shared/components/system/tooltip-handler';
import UserWithNodecon from '@/shared/components/system/user-with-nodecon';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Icons } from '@/shared/components/ui/icon';

import { ServerRow } from '../../server/types/server.types';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface ServerCardProps {
  server: ServerRow;
}

export function ServerCard({ server }: ServerCardProps) {
  const [hover, setHover] = useState(false);

  return (
    <li
      className={cn(
        'flex flex-col w-full bg-card rounded min-h-100 shadow-card hover:translate-y-[-2px] transition-all duration-300'
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <Link href={`/server/${server.slug}`}>
          <div className="relative z-0 flex aspect-video items-center justify-center rounded-t overflow-hidden">
            <Image
              src={server.imageUrl}
              alt={server.name}
              fill
              className="object-center"
            />
          </div>
        </Link>
        {hover && (
          <div className="absolute top-3 right-3 animate-in fade-in-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 bg-black/10 dark:bg-black/15 hover:bg-black/20 dark:hover:bg-black/30"
            >
              <Icons.Star className="size-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="border-b border-b-card-border px-3 py-2.5 space-y-1.5">
          <Link
            href={`/server/${server.slug}`}
            className="text-base font-semibold line-clamp-2 wrap-break-word"
          >
            {server.name}
          </Link>
        </div>
      </div>
      <div className="border-b border-b-card-border px-3 py-2.5 text-xs flex items-center gap-x-4 text-muted-foreground">
        <TooltipHandler content="회원 수">
          <div className="flex items-center gap-x-1">
            <Icons.Users className="size-3.5" />
            <span className="font-medium">{server.memberCount}</span>
          </div>
        </TooltipHandler>
        <TooltipHandler content="즐겨찾기">
          <div className="flex items-center gap-x-1">
            <Icons.Star className="size-3.5" />
            <span className="font-medium">{server.favoriteCount}</span>
          </div>
        </TooltipHandler>
        <TooltipHandler content="서버 생성 일">
          <div className="flex items-center gap-x-1">
            <Icons.Since className="size-3.5" />
            <span className="font-medium">
              {format(server.createdAt, 'yyyy-MM-dd')}
            </span>
          </div>
        </TooltipHandler>
      </div>
      <div className="px-3 pt-2.5 pb-5 text-xs text-muted-foreground">
        <p className="line-clamp-4 wrap-break-word h-16">
          {server.description}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-t-card-border rounded-b mt-auto px-3 py-2.5 text-xs">
        <UserWithNodecon
          tooltip="매니저"
          nodeconId={server.manager.mainNodeConId}
          username={server.manager.username}
          nodeconClassName="size-4"
          usernameClassName="text-xs font-medium"
        />
        {/* <TooltipHandler content="현재 접속자">
          <div className="flex items-center gap-x-1.5 text-green-500 dark:text-green-400">
            <Icons.FillCircle className="size-1.5" />
            <span className="font-medium">1,421</span>
          </div>
        </TooltipHandler> */}
      </div>
    </li>
  );
}

export function ServerCardSkeleton() {
  return (
    <li className="flex flex-col w-full bg-card rounded min-h-100 shadow-card">
      <div className="relative aspect-video">
        <Skeleton className="w-full h-full rounded-none rounded-t" />
      </div>
      <div className="flex flex-col">
        <div className="border-b border-b-card-border px-3 py-2.5 space-y-1.5">
          <Skeleton className="w-full h-6" />
        </div>
      </div>
      <div className="border-b border-b-card-border px-3 py-2.5 text-xs flex items-center gap-x-2 text-muted-foreground">
        <Skeleton className="w-14 h-4" />
        <Skeleton className="w-14 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="px-3 pt-2.5 pb-5 text-xs text-muted-foreground">
        <div className="flex flex-col gap-y-1 h-16">
          <Skeleton className="w-full h-3.5" />
          <Skeleton className="w-[70%] h-3.5" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-t-card-border rounded-b mt-auto px-3 py-2.5 text-xs">
        <Skeleton className="w-13 h-4" />
        {/* <TooltipHandler content="현재 접속자">
          <div className="flex items-center gap-x-1.5 text-green-500 dark:text-green-400">
            <Icons.FillCircle className="size-1.5" />
            <span className="font-medium">1,421</span>
          </div>
        </TooltipHandler> */}
      </div>
    </li>
  );
}
