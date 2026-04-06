'use client';

import {
  DefaultMessage,
  NoticeMessage,
  SystemMessage,
} from '@/app/(main)/channels/[channelId]/_components/messages';

export type ChatMessageType = 'message' | 'system' | 'notice';

export interface ChatSender {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: ChatMessageType;
  sender: ChatSender;
  createdAt: string;
}

export interface ChatGroupProps {
  date: string;
  messages: ChatMessage[];
  sessionUserId?: string;
}

export function ChatGroup({ date, messages, sessionUserId }: ChatGroupProps) {
  return (
    <ul className="py-2">
      <li className="flex items-center justify-center w-full py-4">
        <div className="h-px w-full bg-border" />
        <span className="rounded-full border border-border bg-background px-4 py-1 text-sm text-muted-foreground whitespace-nowrap">
          {date}
        </span>
        <div className="h-px w-full bg-border" />
      </li>
      {messages.map((message) => (
        <ChatItem
          key={message.id}
          message={message}
          isMe={sessionUserId === message.sender.id}
        />
      ))}
    </ul>
  );
}

export function ChatItem({
  message,
  isMe,
}: {
  message: ChatMessage;
  isMe?: boolean;
}) {
  switch (message.type) {
    case 'system':
      return <SystemMessage message={message} />;
    case 'notice':
      return <NoticeMessage message={message} />;
    default:
      return <DefaultMessage message={message} isMe={isMe} />;
  }
}
