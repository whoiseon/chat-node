'use client';

import { Thumbnail } from '@repo/ui/components/system/thumbnail';
import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';
import { cn } from '@repo/ui/lib/utils';

import { ChannelTopBarInfo } from '@/app/(main)/channels/[channelId]/_components/channel-top-bar-info';
import { useChannelId } from '@/app/(main)/channels/[channelId]/_context/channel-id.context';
import { useChannelSearch } from '@/app/(main)/channels/[channelId]/_context/channel-search.context';
import { useChannel } from '@/app/(main)/channels/[channelId]/_hooks/use-channel';
import { TopBar } from '@/components/system/top-bar';
import { useOutsideClick } from '@/lib/hooks/use-outside-click';

export function ChannelTopBarContainer() {
  const { channelId } = useChannelId();
  const { channel } = useChannel(channelId);

  const {
    isSearchMode,
    setIsSearchMode,
    searchValue,
    onSearchChange,
    onExitSearch,
  } = useChannelSearch();

  const topBarRef = useOutsideClick(onExitSearch);

  return (
    <TopBar
      className="h-20"
      ref={topBarRef}
      title="공지사항 전달방"
      customTitle={
        <div className="flex items-center gap-x-2">
          <div
            className={cn(
              'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-sm w-7 border-border border',
            )}
          >
            <Thumbnail
              src={channel?.profileImageUrl ?? ''}
              alt={channel?.name || ''}
              fallback={<Icons.LogoIcon className="size-4" />}
            />
          </div>
          <h1 className="text-base font-semibold">{channel?.name}</h1>
        </div>
      }
      right={<ChannelTopBarTools setIsSearchMode={setIsSearchMode} />}
      bottom={<ChannelTopBarInfo />}
      searchMode={isSearchMode}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onExitSearch={onExitSearch}
      hasBackButton
    />
  );
}

interface ChannelTopBarToolsProps {
  setIsSearchMode: (value: boolean) => void;
}

function ChannelTopBarTools({ setIsSearchMode }: ChannelTopBarToolsProps) {
  return (
    <div className="flex items-center gap-x-1">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setIsSearchMode(true)}
      >
        <Icons.Search className="size-5" />
      </Button>
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Icons.Menu className="size-5" />
      </Button>
    </div>
  );
}
