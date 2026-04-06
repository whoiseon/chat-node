'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelItemDto } from '@repo/api-types';
import { Thumbnail } from '@repo/ui/components/system/thumbnail';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@repo/ui/components/ui/field';
import { Icons } from '@repo/ui/components/ui/icons';
import { Input } from '@repo/ui/components/ui/input';
import { RequiredLabelSymbol } from '@repo/ui/components/ui/required-label-symbol';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import { cn } from '@repo/ui/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

import { useChannels } from '@/app/(main)/_hooks/use-channels';
import { useJoinChannelMutation } from '@/app/(main)/_hooks/use-join-channel-mutation';
import {
  JoinChannelFormValues,
  joinChannelSchema,
} from '@/app/(main)/_schema/join-channel.schema';
import { ManagerViewer } from '@/components/system/manager-viewer';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useMe } from '@/lib/hooks/use-me';

export function ChannelTabs() {
  const { isAuthenticated } = useMe();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') ?? 'all';

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex-1 flex flex-col pt-6">
      <div className="relative px-4 mb-6">
        <Icons.Search className="absolute size-4 text-muted-foreground -translate-y-1/2 top-1/2 left-7" />
        <Input
          className="bg-background! h-10 pl-9"
          placeholder="채널 이름"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="bg-transparent p-0 gap-2 px-4">
          <TabsTrigger value="all">전체</TabsTrigger>
          {isAuthenticated && <TabsTrigger value="my">내 채팅</TabsTrigger>}
        </TabsList>
        <TabsContent value="all">
          <ChannelList search={debouncedSearch} />
        </TabsContent>
        {isAuthenticated && (
          <TabsContent value="my">
            <ChannelList isMyTab={true} search={debouncedSearch} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

interface ChannelListProps {
  isMyTab?: boolean;
  search?: string;
}

export function ChannelList({ isMyTab, search }: ChannelListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChannels({
      joined: isMyTab,
      search: search || undefined,
    });

  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleObserver]);

  const channels = data?.pages.flatMap((page) => page.payload.channels) ?? [];

  if (isLoading) return <ChannelCardSkeleton />;

  return (
    <div className="flex flex-col">
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} isMyTab={isMyTab} />
      ))}
      <div ref={observerRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Icons.Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

interface ChannelCardProps {
  channel: ChannelItemDto;
  isMyTab?: boolean;
}

function ChannelCard({ channel, isMyTab }: ChannelCardProps) {
  const time = channel.lastMessage
    ? channel.lastMessage.createdAt
    : channel.createdAt;
  const timeAgo = formatDistanceToNow(new Date(time), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <ChannelJoinButton channel={channel}>
      <div className="cursor-pointer px-4 py-3 flex items-center gap-4 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
        <div
          className={cn(
            'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-14',
          )}
        >
          <Thumbnail src={channel.profileImageUrl ?? ''} alt={channel.name} />
        </div>
        <div className="flex-1 min-w-0 flex justify-between">
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 gap-4">
              <h3 className="font-semibold truncate flex items-center min-w-0">
                {channel.isPrivate && (
                  <Icons.Lock className="inline size-3.5 mr-2 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate">{channel.name}</span>
              </h3>
              <div className="inline-flex">
                <div className="text-xs whitespace-nowrap flex items-center mr-0.5 text-muted-foreground">
                  {isMyTab ? (
                    timeAgo
                  ) : (
                    <div className="text-xs flex items-center gap-x-1">
                      <Icons.Users className="size-3" />
                      {channel.memberCount.toLocaleString()}
                    </div>
                  )}
                </div>
                {isMyTab && <ChannelMoreDropdown />}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1 wrap-break-word">
                {isMyTab
                  ? channel.lastMessage
                    ? channel.lastMessage.content
                    : '-'
                  : channel.description}
              </p>
              {isMyTab && channel.unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="text-xs mr-2 bg-red-500 dark:bg-red-400 text-white font-semibold"
                >
                  {channel.unreadCount.toLocaleString()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </ChannelJoinButton>
  );
}

function ChannelCardSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex items-center gap-4 rounded-xl">
          <div
            className={cn(
              'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-14',
            )}
          >
            <Skeleton className="size-full" />
          </div>
          <div className="flex-1 min-w-0 flex justify-between">
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-4">
                <h3 className="font-semibold truncate flex items-center min-w-0">
                  <Skeleton className="h-5 w-30" />
                </h3>
                <div className="inline-flex">
                  <div className="text-xs whitespace-nowrap flex items-center mr-0.5 text-muted-foreground">
                    <Skeleton className="h-4 w-9" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChannelJoinButton({
  children,
  channel,
}: PropsWithChildren & { channel: ChannelItemDto }) {
  const { isAuthenticated } = useMe();

  if (!isAuthenticated)
    return (
      <Link href="/session/new" className="cursor-pointer">
        {children}
      </Link>
    );

  if (channel.joinedAt)
    return (
      <Link href={`/channels/${channel.id}`} className="cursor-pointer">
        {children}
      </Link>
    );

  return <ChannelJoinDialog channel={channel}>{children}</ChannelJoinDialog>;
}

function ChannelJoinDialog({
  channel,
  children,
}: PropsWithChildren & { channel: ChannelItemDto }) {
  const { mutate } = useJoinChannelMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinChannelFormValues>({
    resolver: zodResolver(joinChannelSchema),
    defaultValues: {
      displayName: '',
      password: '',
      isPrivate: channel.isPrivate,
    },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate({
      channelId: channel.id,
      displayName: data.displayName,
      password: data.password,
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent containerId="app-container" className="p-0 bg-card gap-0">
        <DialogHeader className="p-4 gap-4">
          <div className="flex items-center gap-x-4">
            <div
              className={cn(
                'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-14 border border-border',
              )}
            >
              <Thumbnail
                src={channel.profileImageUrl ?? ''}
                alt={channel.name}
              />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-base font-semibold">
                {channel.name}
              </DialogTitle>
              <ManagerViewer
                displayName={channel.manager.displayName}
                username={channel.manager.username}
              />
            </div>
          </div>
          <DialogDescription className="px-3 py-2.5 bg-background/30 border border-border rounded-lg text-foreground whitespace-pre-line">
            {channel.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="bg-background/60 border-y border-y-border px-4 py-5 flex flex-col gap-y-4">
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
          </div>
          <div className="p-4 flex items-center justify-end gap-x-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                취소
              </Button>
            </DialogClose>
            <Button
              variant="default"
              className="font-semibold"
              disabled={isSubmitting}
            >
              입장하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ChannelMoreDropdown() {
  return (
    <div
      onClick={(e) => e.preventDefault()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground focus:ring-0 focus:outline-none hover:bg-transparent"
          >
            <Icons.More />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="left" className="bg-card">
          <DropdownMenuGroup>
            <ChannelMoreItem>읽음</ChannelMoreItem>
            <ChannelMoreItem>나가기</ChannelMoreItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ChannelMoreItem({ children }: PropsWithChildren) {
  return (
    <DropdownMenuItem className="cursor-pointer">{children}</DropdownMenuItem>
  );
}
