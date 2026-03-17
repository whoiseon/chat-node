import ChannelTopBarTools from '@/app/(main)/channels/[channelId]/_components/channel-top-bar-tools';
import TopBar from '@/components/system/top-bar';

type Params = {
  channelId: string;
};

interface Props {
  params: Promise<Params>;
}

export default async function Page({ params }: Props) {
  const { channelId } = await params;

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="공지사항 전달방"
        right={<ChannelTopBarTools />}
        hasBackButton
      />
    </div>
  );
}
