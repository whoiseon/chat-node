'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';
import { Textarea } from '@repo/ui/components/ui/textarea';

export function ChatMessageEditor() {
  return (
    <div className="bg-background px-2 pb-2 md:pb-4 sticky bottom-0">
      <div className="flex flex-col bg-card rounded-md min-h-25 z-10">
        <Textarea
          className="bg-transparent! border-none focus-visible:ring-0 resize-none max-h-100 p-4 flex-1"
          placeholder="오늘은 어떤 이야기를 해볼까요..."
        />
        <div className="flex justify-end h-10 px-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Icons.SendHorizontal />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
