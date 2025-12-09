'use client';

import { TooltipHandler } from '@/shared/components/system/tooltip-handler';
import UserWithNodecon from '@/shared/components/system/user-with-nodecon';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Icons } from '@/shared/components/ui/icon';
import Link from 'next/link';
import { useState } from 'react';

export default function ServerCard() {
  const [hover, setHover] = useState(false);

  return (
    <li
      className="flex flex-col w-full bg-card rounded min-h-100 shadow-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <Link href="/">
          <div className="relative z-0 flex aspect-video items-center justify-center rounded-t overflow-hidden">
            <div className="bg-accent absolute max-h-full w-full h-full" />
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
            href="/"
            className="text-base font-semibold line-clamp-2 wrap-break-word"
          >
            Server Name
          </Link>
        </div>
      </div>
      <div className="border-b border-b-card-border px-3 py-2.5 text-xs flex items-center gap-x-4 text-muted-foreground">
        <TooltipHandler content="회원 수">
          <div className="flex items-center gap-x-1">
            <Icons.Users className="size-3.5" />
            <span className="font-medium">2,531</span>
          </div>
        </TooltipHandler>
        <TooltipHandler content="즐겨찾기">
          <div className="flex items-center gap-x-1">
            <Icons.Star className="size-3.5" />
            <span className="font-medium">1,421</span>
          </div>
        </TooltipHandler>
        <TooltipHandler content="서버 생성 일">
          <div className="flex items-center gap-x-1">
            <Icons.Since className="size-3.5" />
            <span className="font-medium">2025-12-01</span>
          </div>
        </TooltipHandler>
      </div>
      <div className="px-3 pt-2.5 pb-5 text-xs text-muted-foreground">
        <span className="line-clamp-4 wrap-break-word">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </span>
      </div>
      <div className="border-t border-t-card-border px-3 py-2.5 flex items-center gap-2 flex-wrap">
        <Badge variant="gray">친목</Badge>
        <Badge variant="gray">게임</Badge>
      </div>
      <div className="flex items-center justify-between border-t border-t-card-border rounded-b mt-auto px-3 py-2.5 text-xs">
        <UserWithNodecon
          tooltip="매니저"
          nodeconId="cmiidkmgt00053b6s1a51jd2q"
          username="admin"
          nodeconClassName="size-4"
          usernameClassName="text-xs font-medium"
        />
        <TooltipHandler content="현재 접속자">
          <div className="flex items-center gap-x-1.5 text-green-500 dark:text-green-400">
            <Icons.FillCircle className="size-1.5" />
            <span className="font-medium">1,421</span>
          </div>
        </TooltipHandler>
      </div>
    </li>
  );
}
