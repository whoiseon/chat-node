'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { RefObject, useRef } from 'react';

import { NewMessageToast } from '@/app/(main)/channels/[channelId]/_components/new-message-toast';
import { useChannelId } from '@/app/(main)/channels/[channelId]/_context/channel-id.context';
import { useChannelSocket } from '@/app/(main)/channels/[channelId]/_hooks/use-channel-socket';
import { useScroll } from '@/app/(main)/channels/[channelId]/_hooks/use-scroll';
import { useChannelNewMessage } from '@/store/channel';

interface ChatMessageEditorProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

export function ChatMessageEditor({
  scrollContainerRef,
}: ChatMessageEditorProps) {
  const { scrollToBottom } = useScroll(scrollContainerRef);
  const newMessage = useChannelNewMessage();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { channelId } = useChannelId();
  const { emitSendMessage } = useChannelSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = textareaRef.current?.value.trim();
    if (!content) return;

    emitSendMessage({ channelId, content });

    textareaRef.current!.value = '';

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="bg-background px-2 pb-2 md:pb-4 sticky bottom-0">
      <NewMessageToast
        message={newMessage}
        onPress={() => scrollToBottom()}
      />
      <form
        className="flex flex-col bg-card rounded-md min-h-25 z-10 shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-none"
        onSubmit={handleSubmit}
      >
        <Textarea
          ref={textareaRef}
          className="bg-transparent! border-none focus-visible:ring-0 resize-none max-h-100 p-4 flex-1"
          placeholder="오늘은 어떤 이야기를 해볼까요..."
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex justify-end h-10 px-2">
          <div className="flex items-center">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Icons.SendHorizontal />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
