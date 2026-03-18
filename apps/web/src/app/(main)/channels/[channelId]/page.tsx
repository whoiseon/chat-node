import { ChannelTopBarContainer } from '@/app/(main)/channels/[channelId]/_components/channel-top-bar-container';
import { ChatListContainer } from '@/app/(main)/channels/[channelId]/_components/chat-list-container';
import { ChatMessageEditor } from '@/app/(main)/channels/[channelId]/_components/chat-message-editor';
import { ChannelSearchProvider } from '@/app/(main)/channels/[channelId]/_context/channel-search.context';

type Params = {
  channelId: string;
};

interface Props {
  params: Promise<Params>;
}

export default async function Page({ params }: Props) {
  const { channelId } = await params;

  return (
    <div className="flex flex-col flex-1">
      <ChannelSearchProvider>
        <ChannelTopBarContainer />
        <ChatListContainer />
        <ChatMessageEditor />
      </ChannelSearchProvider>
    </div>
  );
}
