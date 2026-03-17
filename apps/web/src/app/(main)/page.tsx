import { LogoWithText } from '@repo/ui/components/ui/logo';

import { ChannelList } from '@/app/(main)/_components/channel';
import TopBarRight from '@/app/(main)/_components/top-bar-right';
import TopBar from '@/components/system/top-bar';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <TopBar
        customTitle={<LogoWithText size="md" />}
        hasBackButton={false}
        right={<TopBarRight />}
      />
      <ChannelList />
    </div>
  );
}
