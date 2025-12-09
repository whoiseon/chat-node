'use client';

import { Icons } from '@/shared/components/ui/icon';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/lib/utils';

import { useMe } from '@/features/user/hooks/use-me';

import SidebarGroup from './sidebar-group';
import { useSidebarScroll } from './context/sidebar-scroll-context';

export default function SidebarContent() {
  const { data: me } = useMe();
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
        <SidebarGroup.Item href="/" icon={<Icons.Home strokeWidth={2} />}>
          홈
        </SidebarGroup.Item>
        <SidebarGroup.Item
          href="/market/nodecon"
          icon={<Icons.NodeconShop strokeWidth={2} />}
        >
          노드콘
        </SidebarGroup.Item>
        {me && (
          <SidebarGroup.Item
            href="/create-server"
            icon={<Icons.Plus strokeWidth={2} />}
          >
            서버 개설
          </SidebarGroup.Item>
        )}
      </SidebarGroup>
      <ScrollArea className="h-full min-h-0" onScrollCapture={handleScroll}>
        <SidebarGroup title="즐겨찾기">
          {Array.from({ length: 10 }).map((_, index) => (
            <SidebarGroup.Item
              key={index}
              href={`/server/${index + 1}`}
              icon={<Icons.LogoIcon strokeWidth={2} />}
            >
              game {index + 1}
            </SidebarGroup.Item>
          ))}
        </SidebarGroup>
        <SidebarGroup title="내 서버">
          {Array.from({ length: 20 }).map((_, index) => (
            <SidebarGroup.Item
              key={index}
              href={`/server/${index + 1}`}
              icon={<Icons.LogoIcon strokeWidth={2} />}
            >
              ChatNode 고객센터 {index + 1}
            </SidebarGroup.Item>
          ))}
        </SidebarGroup>
      </ScrollArea>
    </div>
  );
}
