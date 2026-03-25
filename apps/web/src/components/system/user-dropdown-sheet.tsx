'use client';

import { UserProfile } from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/ui/sheet';
import { PropsWithChildren } from 'react';

import { useMe } from '@/lib/hooks/use-me';
import { useSignOutMutation } from '@/lib/hooks/use-sign-out-mutation';

export function UserDropdownSheet({ children }: PropsWithChildren) {
  const { user } = useMe();
  const { mutateAsync } = useSignOutMutation();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent containerId="app-container" className="border-none gap-0">
        <SheetHeader className="border-b border-b-border/70">
          <div className="flex items-center gap-x-4">
            <UserProfile
              profileUrl=""
              username={user?.username || 'username'}
              size="lg"
            />
            <div className="flex flex-col">
              <SheetTitle>{user?.displayName}</SheetTitle>
              <SheetDescription>{user?.username}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex flex-col flex-1 p-4 gap-y-2">
          <Button
            variant="ghost"
            className="w-full hover:bg-stone-100 hover:dark:bg-stone-800 justify-start font-semibold text-muted-foreground"
          >
            다크
          </Button>
          <Button
            variant="ghost"
            className="w-full hover:bg-stone-100 hover:dark:bg-stone-800 justify-start font-semibold text-muted-foreground"
          >
            라이트
          </Button>
          <Button
            variant="ghost"
            className="w-full hover:bg-stone-100 hover:dark:bg-stone-800 justify-start font-semibold text-muted-foreground"
          >
            시스템
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
