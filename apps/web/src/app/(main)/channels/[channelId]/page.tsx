import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { ChannelGate } from '@/app/(main)/channels/[channelId]/_components/channel-gate';
import { ChannelIdProvider } from '@/app/(main)/channels/[channelId]/_context/channel-id.context';
import { getCookieString } from '@/app/_actions/get-cookie-string';
import { channelApi, channelKeys } from '@/lib/api/services/channel.api';
import getQueryClient from '@/lib/get-query-client';

type Params = {
  channelId: string;
};

interface Props {
  params: Promise<Params>;
}

export default async function Page({ params }: Props) {
  const { channelId } = await params;
  const queryClient = getQueryClient();
  const cookieString = await getCookieString();

  await queryClient.prefetchQuery({
    queryKey: channelKeys.detail(channelId),
    queryFn: () => channelApi.getChannel(channelId, cookieString),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ChannelIdProvider channelId={channelId}>
        <ChannelGate />
      </ChannelIdProvider>
    </HydrationBoundary>
  );
}
