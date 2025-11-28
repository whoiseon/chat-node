'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Icons } from '@/shared/components/ui/icon';
import { cn } from '@/shared/lib/utils';

import { useLogOut } from '@/features/auth/hooks/use-log-out';

import { UserResponse } from '../types/user.types';
import NPViewer from '@/shared/components/system/np-viewer';

interface UserProfileDropdownProps {
  me: UserResponse;
}

export default function UserProfileDropdown({ me }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: logOut } = useLogOut();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-foreground hover:bg-stone-200 dark:hover:bg-stone-750 w-full h-8 justify-between"
        >
          <div className="flex items-center gap-x-2">
            <Icons.User className="size-4" />
            <span>{me.username}</span>
          </div>
          <Icons.ChevronUp
            className={cn(
              'size-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-65 bg-sidebar border-border p-0"
      >
        <DropdownMenuGroup className="p-1 gap-y-px">
          <DropdownMenuItem className="text-xs justify-between">
            <span className="text-muted-foreground">보유 NP</span>
            <NPViewer np={me.np} />
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs justify-between">
            <span className="text-muted-foreground">설정</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="px-3">
          <DropdownMenuSeparator className="my-0" />
        </DropdownMenuGroup>
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem
            className="text-xs text-muted-foreground font-medium"
            onClick={() => logOut()}
          >
            <span className="text-destructive">로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
