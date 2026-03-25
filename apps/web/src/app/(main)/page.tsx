import { LogoWithText } from '@repo/ui/components/ui/logo';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ChannelList } from '@/app/(main)/_components/channel';
import TopBarRight from '@/app/(main)/_components/top-bar-right';
import { Footer } from '@/components/layout/footer';
import { TopBar } from '@/components/system/top-bar';
import { channelApi, channelKeys } from '@/lib/api/services/channel.api';
import getQueryClient from '@/lib/get-query-client';

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: channelKeys.list({}),
    queryFn: () => channelApi.getChannels({}),
    initialPageParam: undefined,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col h-full">
      <TopBar
        customTitle={<LogoWithText size="md" />}
        hasBackButton={false}
        right={<TopBarRight />}
      />
      <HydrationBoundary state={dehydratedState}>
        <ChannelList />
      </HydrationBoundary>
      <Footer />
    </div>
  );
}
