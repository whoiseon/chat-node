'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Icons } from '@repo/ui/components/ui/icons';

import { useChannelSearch } from '@/app/(main)/channels/[channelId]/_context/channel-search.context';
import { TopBar } from '@/components/system/top-bar';
import { useOutsideClick } from '@/lib/hooks/use-outside-click';

export function ChannelTopBarContainer() {
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
      ref={topBarRef}
      title="공지사항 전달방"
      right={<ChannelTopBarTools setIsSearchMode={setIsSearchMode} />}
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
