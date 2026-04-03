'use client';

import { UserProfile } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { cn } from '@repo/ui/lib/utils';
import { format } from 'date-fns';
import { PropsWithChildren } from 'react';

import {
  ChatMessage,
  ChatMessageType,
} from '@/app/(main)/channels/[channelId]/_components/chat';
import { formatMessageDate } from '@/lib/date';
import { useMe } from '@/lib/hooks/use-me';

interface MessageProps {
  className?: string;
  message: ChatMessage;
}

export function Message({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <li className={cn('flex w-full py-2 text-sm px-2', className)}>
      {children}
    </li>
  );
}

export function DefaultMessage({ message }: MessageProps) {
  const { user } = useMe();

  const isMe = message.sender.id === user?.id;

  return (
    <Message
      className={cn('justify-start gap-x-2', isMe && 'flex-row-reverse')}
    >
      {!isMe && (
        <UserProfile
          profileUrl={message?.sender.profileImage || ''}
          username={message?.sender.username || ''}
        />
      )}
      <div className="flex flex-col gap-y-1 flex-1">
        {!isMe && <span className="pl-0.5">{message.sender.displayName}</span>}
        <MessageBubble isMe={isMe} createdAt={message.createdAt}>
          {message.content}
        </MessageBubble>
      </div>
    </Message>
  );
}

export function SystemMessage({ message }: MessageProps) {
  return (
    <Message className="justify-center items-center py-4">
      <SystemBubble
        type={message.type}
        className="text-muted-foreground py-4 font-semibold "
      >
        {message.content}
      </SystemBubble>
    </Message>
  );
}

export function NoticeMessage({ message }: MessageProps) {
  return (
    <Message className="justify-center items-center py-4">
      <SystemBubble type={message.type} className="font-semibold">
        {message.content}
      </SystemBubble>
    </Message>
  );
}

interface SystemBubbleProps {
  className?: string;
  textClassName?: string;
  type?: ChatMessageType;
}

function SystemBubble({
  children,
  className,
  type = 'notice',
}: PropsWithChildren & SystemBubbleProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center w-full border border-stone-400 dark:border-border border-dashed gap-y-3 rounded-lg px-x py-6',
        className,
      )}
    >
      {type === 'notice' && (
        <Badge className="rounded-sm font-bold bg-emerald-500 dark:bg-emerald-400">
          공지사항
        </Badge>
      )}
      <span className="text-sm text-center whitespace-pre-line">
        {children}
      </span>
    </div>
  );
}

function MessageBubble({
  children,
  isMe,
  createdAt,
}: PropsWithChildren & { isMe?: boolean; createdAt: string }) {
  return (
    <div
      className={cn(
        'flex gap-x-2 items-end text-sm',
        isMe && 'flex-row-reverse',
      )}
    >
      <div
        className={cn(
          'bg-stone-200/50 dark:bg-muted px-3.5 py-2 rounded-sm font-normal max-w-[70%] wrap-break-word whitespace-pre-line',
          isMe && 'bg-primary dark:bg-primary text-white',
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          'flex flex-col justify-start text-xs',
          isMe && 'items-end',
        )}
      >
        <span className="text-yellow-500 dark:text-yellow-400">1</span>
        <span className="text-muted-foreground/60">
          {formatMessageDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
