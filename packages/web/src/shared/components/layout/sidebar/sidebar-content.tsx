'use client';

import { Icons } from '@/shared/components/ui/icon';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/lib/utils';

import { useMe } from '@/features/user/hooks/use-me';
import { useGetMyServerList } from '@/features/server/hooks/use-get-my-server-list';

import SidebarGroup from './sidebar-group';
import { useSidebarScroll } from './context/sidebar-scroll-context';

export default function SidebarContent() {
  const { data: me } = useMe();
  const { data: myServers, isLoading: isMyServersLoading } =
    useGetMyServerList();

  const { setIsBottom, setIsTop, isTop } = useSidebarScroll();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    // 스크롤이 맨 아래에 도달했을 때
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }

    if (scrollTop === 0) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SidebarGroup
        className={cn(
          'transition-all duration-100',
          !isTop
            ? 'border-b border-b-stone-250 dark:border-b-stone-750'
            : 'border-b-0'
        )}
      >
        <SidebarGroup.Item href="/" icon={<Icons.Home strokeWidth={1.5} />}>
          홈
        </SidebarGroup.Item>
        <SidebarGroup.Item
          href="/market/nodecon"
          icon={<Icons.NodeconShop strokeWidth={1.5} />}
        >
          노드콘
        </SidebarGroup.Item>
        {me && (
          <SidebarGroup.Item
            href="/create-server"
            icon={<Icons.Plus strokeWidth={1.5} />}
          >
            서버 개설
          </SidebarGroup.Item>
        )}
      </SidebarGroup>
      <ScrollArea className="h-full min-h-0" onScrollCapture={handleScroll}>
        {/* <SidebarGroup title="즐겨찾기">
          {Array.from({ length: 10 }).map((_, index) => (
            <SidebarGroup.Item
              key={index}
              href={`/server/${index + 1}`}
              icon={<Icons.Hash strokeWidth={1.5} />}
            >
              game {index + 1}
            </SidebarGroup.Item>
          ))}
        </SidebarGroup> */}
        {me && <SidebarGroup title="내 서버">
          {isMyServersLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <SidebarGroup.ItemSkeleton key={index} index={index} />
              ))
            : myServers?.payload?.rows.map((server) => (
                <SidebarGroup.Item
                  key={server.id}
                  href={`/server/${server.id}`}
                  icon={<Icons.Hash strokeWidth={1.5} />}
                >
                  {server.name}
                </SidebarGroup.Item>
              ))}
        </SidebarGroup>}
      </ScrollArea>
    </div>
  );
}
