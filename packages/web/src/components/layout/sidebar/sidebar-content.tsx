'use client';

import { Icons } from '@/components/ui/icon';
import SidebarGroup from './sidebar-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarScroll } from './context/sidebar-scroll-context';
import { cn } from '@/lib/utils';

export default function SidebarContent() {
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
          !isTop ? 'border-b border-b-border' : 'border-b-0'
        )}
      >
        <SidebarGroup.Item href="/" icon={<Icons.Home strokeWidth={2.2} />}>
          홈
        </SidebarGroup.Item>
        <SidebarGroup.Item
          href="/trending"
          icon={<Icons.Flame strokeWidth={2.2} />}
        >
          인기
        </SidebarGroup.Item>
        <SidebarGroup.Item
          href="/topic"
          icon={<Icons.Hash strokeWidth={2.2} />}
        >
          주제별
        </SidebarGroup.Item>
      </SidebarGroup>
      <ScrollArea className="h-full min-h-0" onScrollCapture={handleScroll}>
        <SidebarGroup title="즐겨찾기">
          {Array.from({ length: 10 }).map((_, index) => (
            <SidebarGroup.Item
              key={index}
              href={`/favorite/${index + 1}`}
              icon={<Icons.LogoIcon strokeWidth={2.2} />}
            >
              game {index + 1}
            </SidebarGroup.Item>
          ))}
        </SidebarGroup>
        <SidebarGroup title="내 채팅">
          {Array.from({ length: 20 }).map((_, index) => (
            <SidebarGroup.Item
              key={index}
              href={`/chat/${index + 1}`}
              icon={<Icons.LogoIcon strokeWidth={2.2} />}
            >
              ChatNode 고객센터 {index + 1}
            </SidebarGroup.Item>
          ))}
        </SidebarGroup>
      </ScrollArea>
    </div>
  );
}
