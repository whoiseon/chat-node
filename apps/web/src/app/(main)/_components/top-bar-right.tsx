'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';

export default function TopBarRight() {
  return (
    <div className="flex items-center gap-x-1">
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Icons.MessagePlus className="size-5" />
      </Button>
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Icons.Settings className="size-5" />
      </Button>
    </div>
  );
}
