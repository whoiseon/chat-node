'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';
import Link from 'next/link';

import { CreateChannelSheet } from '@/app/(main)/_components/create-channel-sheet';
import { UserDropdownMenu } from '@/components/system/user-dropdown-menu';
import { UserDropdownSheet } from '@/components/system/user-dropdown-sheet';
import { useMe } from '@/lib/hooks/use-me';

export default function TopBarRight() {
  const { isAuthenticated } = useMe();
  return (
    <div className="flex items-center gap-x-1">
      {isAuthenticated && (
        <CreateChannelSheet>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Icons.MessagePlus className="size-5" />
          </Button>
        </CreateChannelSheet>
      )}
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Icons.Settings className="size-5" />
      </Button>

      {isAuthenticated ? (
        <UserDropdownMenu>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Icons.User className="size-5" />
          </Button>
        </UserDropdownMenu>
      ) : (
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Link href="/session/new">
            <Icons.User className="size-5" />
          </Link>
        </Button>
      )}
    </div>
  );
}
