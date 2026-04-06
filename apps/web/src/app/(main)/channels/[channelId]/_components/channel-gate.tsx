'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Thumbnail } from '@repo/ui/components/system/thumbnail';
import { Button } from '@repo/ui/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@repo/ui/components/ui/field';
import { Input } from '@repo/ui/components/ui/input';
import { RequiredLabelSymbol } from '@repo/ui/components/ui/required-label-symbol';
import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useJoinChannelMutation } from '@/app/(main)/_hooks/use-join-channel-mutation';
import {
  JoinChannelFormValues,
  joinChannelSchema,
} from '@/app/(main)/_schema/join-channel.schema';
import { ChannelTopBarContainer } from '@/app/(main)/channels/[channelId]/_components/channel-top-bar-container';
import { ChatListContainer } from '@/app/(main)/channels/[channelId]/_components/chat-list-container';
import { ChatMessageEditor } from '@/app/(main)/channels/[channelId]/_components/chat-message-editor';
import { useChannelId } from '@/app/(main)/channels/[channelId]/_context/channel-id.context';
import { ChannelSearchProvider } from '@/app/(main)/channels/[channelId]/_context/channel-search.context';
import { useChannel } from '@/app/(main)/channels/[channelId]/_hooks/use-channel';
import { useChannelSocketEffect } from '@/app/(main)/channels/[channelId]/_hooks/use-channel-socket-effect';
import { ManagerViewer } from '@/components/system/manager-viewer';
import { TopBar } from '@/components/system/top-bar';
import { useMe } from '@/lib/hooks/use-me';

export function ChannelGate() {
  const { channelId } = useChannelId();
  const { channel, isLoading } = useChannel(channelId);
  const { isAuthenticated } = useMe();
  if (isLoading) return null;

  if (!channel) {
    return <ChannelNotFound />;
  }

  if (!isAuthenticated) {
    return <ChannelLoginRequired channelId={channelId} />;
  }

  if (!channel.joinedAt) {
    return <ChannelJoinForm channelId={channelId} />;
  }

  return <ChannelRoom />;
}

function ChannelRoom() {
  const { channelId } = useChannelId();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useChannelSocketEffect(channelId, scrollContainerRef);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChannelSearchProvider>
        <ChannelTopBarContainer />
        <ChatListContainer scrollContainerRef={scrollContainerRef} />
        <ChatMessageEditor scrollContainerRef={scrollContainerRef} />
      </ChannelSearchProvider>
    </div>
  );
}

function ChannelNotFound() {
  return (
    <div className="flex flex-col flex-1">
      <TopBar title="채널" hasBackButton />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">채널을 찾을 수 없습니다</p>
        <Button variant="outline" asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}

function ChannelLoginRequired({ channelId }: { channelId: string }) {
  return (
    <div className="flex flex-col flex-1">
      <TopBar title="채널" hasBackButton />
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">로그인이 필요합니다</p>
        <Button variant="outline" asChild>
          <Link href={`/session/new?redirect=/channels/${channelId}`}>
            로그인하기
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ChannelJoinForm({ channelId }: { channelId: string }) {
  const { channel } = useChannel(channelId);
  const { mutate } = useJoinChannelMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinChannelFormValues>({
    resolver: zodResolver(joinChannelSchema),
    defaultValues: {
      displayName: '',
      password: '',
      isPrivate: channel?.isPrivate ?? false,
    },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate(
      {
        channelId,
        displayName: data.displayName,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  });

  if (!channel) return null;

  return (
    <div className="flex flex-col flex-1">
      <TopBar title={channel.name} hasBackButton />
      <div className="flex-1 flex flex-col items-center px-4 pt-20">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              className={cn(
                'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-20 border border-border',
              )}
            >
              <Thumbnail
                src={channel.profileImageUrl ?? ''}
                alt={channel.name}
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{channel.name}</h2>
              {channel.manager && (
                <ManagerViewer
                  displayName={channel.manager.displayName}
                  username={channel.manager.username}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center whitespace-pre-line">
              {channel.description}
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
            <Field>
              <FieldLabel className="text-muted-foreground">닉네임</FieldLabel>
              <FieldContent>
                <Input
                  type="text"
                  className="h-10 px-3 text-sm"
                  placeholder="미입력 시 아이디 사용 (2자 이상 20자 이하)"
                  disabled={isSubmitting}
                  {...register('displayName')}
                />
                <FieldError className="mt-1">
                  {errors.displayName?.message}
                </FieldError>
              </FieldContent>
            </Field>
            {channel.isPrivate && (
              <Field>
                <FieldLabel>
                  비밀번호
                  <RequiredLabelSymbol />
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="password"
                    className="h-10 px-3 text-sm"
                    placeholder="채널 비밀번호"
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <FieldError className="mt-1">
                    {errors.password?.message}
                  </FieldError>
                </FieldContent>
              </Field>
            )}
            <Button
              variant="default"
              className="w-full font-semibold h-12"
              disabled={isSubmitting}
            >
              입장하기
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
