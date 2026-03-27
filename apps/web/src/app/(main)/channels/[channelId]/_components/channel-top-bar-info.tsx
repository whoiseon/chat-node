'use client';

import { Icons } from '@repo/ui/components/ui/icons';
import { format } from 'date-fns';
import { PropsWithChildren } from 'react';

import { useChannelId } from '@/app/(main)/channels/[channelId]/_context/channel-id.context';
import { useChannel } from '@/app/(main)/channels/[channelId]/_hooks/use-channel';
import { ManagerViewer } from '@/components/system/manager-viewer';

export function ChannelTopBarInfo() {
  const { channelId } = useChannelId();
  const { channel } = useChannel(channelId);

  if (!channel) return null;

  return (
    <div className="flex items-center justify-between mt-0.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <TextWithIcon>
          <Icons.Users />
          {channel.memberCount.toLocaleString()}
        </TextWithIcon>
        <span className="text-muted-foreground/50">·</span>
        <TextWithIcon>
          <Icons.Calendar />
          {format(new Date(channel.createdAt), 'yyyy-MM-dd')}
        </TextWithIcon>
      </div>
      <ManagerViewer
        displayName={channel.manager.displayName}
        username={channel.manager.username}
      />
    </div>
  );
}

function TextWithIcon({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center gap-1 text-sm [&_svg]:size-3.5">
      {children}
    </div>
  );
}
