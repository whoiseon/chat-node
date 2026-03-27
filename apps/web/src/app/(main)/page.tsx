import { LogoWithText } from '@repo/ui/components/ui/logo';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ChannelTabs } from '@/app/(main)/_components/channel';
import TopBarRight from '@/app/(main)/_components/top-bar-right';
import { getCookieString } from '@/app/_actions/get-cookie-string';
import { Footer } from '@/components/layout/footer';
import { TopBar } from '@/components/system/top-bar';
import { channelApi, channelKeys } from '@/lib/api/services/channel.api';
import getQueryClient from '@/lib/get-query-client';

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { tab } = await searchParams;

  const queryClient = getQueryClient();
  const cookieString = await getCookieString();

  const query = tab && tab === 'my' ? { joined: true } : {};

  await queryClient.prefetchInfiniteQuery({
    queryKey: channelKeys.list(query),
    queryFn: () => channelApi.getChannels(query, cookieString),
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
        <ChannelTabs />
      </HydrationBoundary>
      <Footer />
    </div>
  );
}
