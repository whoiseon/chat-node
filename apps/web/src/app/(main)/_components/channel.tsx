'use client';

import { ChannelThumbnail } from '@repo/ui/components/system/channel-thumbnail';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Icons } from '@repo/ui/components/ui/icons';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export function ChannelList() {
  return (
    <div className="flex-1 flex flex-col pt-6">
      <div className="relative px-4 mb-4">
        <Icons.Search className="absolute size-4 text-muted-foreground -translate-y-1/2 top-1/2 left-7" />
        <Input className="bg-background! h-10 pl-9" placeholder="채널 이름" />
      </div>
      <div className="flex flex-col gap-1">
        <ChannelCard />
      </div>
    </div>
  );
}

function ChannelCard() {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-stone-200 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
      <Link
        href="/channels/1"
        className={cn(
          'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-18',
        )}
      >
        <ChannelThumbnail src="" alt="thumbnail" />
      </Link>
      <div className="flex-1 flex justify-between">
        <Link
          href="/channels/cmj6wozcv0000ris4z2t4xen0"
          className="flex flex-col max-w-sm"
        >
          <h3 className="font-semibold mb-1 line-clamp-2">공지사항 전달방</h3>
          <p className="text-sm text-muted-foreground line-clamp-1 max-h-10">
            ㅋㅋㅋ 이게 맞음?
          </p>
        </Link>
        <div className="pl-4">
          <div className="inline-flex">
            <div className="text-xs whitespace-nowrap flex items-center mr-0.5 text-muted-foreground">
              18시간 전
            </div>
            <ChannelMoreDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelMoreDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground focus:ring-0 focus:outline-none"
        >
          <Icons.More />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="left">
        <DropdownMenuGroup>
          <ChannelMoreItem>읽음</ChannelMoreItem>
          <ChannelMoreItem>나가기</ChannelMoreItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChannelMoreItem({ children }: PropsWithChildren) {
  return (
    <DropdownMenuItem className="cursor-pointer">{children}</DropdownMenuItem>
  );
}
