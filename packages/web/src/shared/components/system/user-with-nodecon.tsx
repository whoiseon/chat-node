'use client';

import Nodecon from '../ui/nodecon';
import { TooltipHandler } from './tooltip-handler';

interface UserWithNodeconProps {
  nodeconId: string;
  username: string;
  nodeconClassName?: string;
  usernameClassName?: string;
  tooltip?: string;
}

export default function UserWithNodecon({
  nodeconId,
  username,
  nodeconClassName,
  usernameClassName,
  tooltip,
}: UserWithNodeconProps) {
  if (tooltip) {
    return (
      <TooltipHandler content={tooltip}>
        <div className="flex items-center">
          <Nodecon nodeconId={nodeconId} className={nodeconClassName} />
          <span className={usernameClassName}>{username}</span>
        </div>
      </TooltipHandler>
    );
  }

  return (
    <div className="flex items-center">
      <Nodecon nodeconId={nodeconId} className={nodeconClassName} />
      <span className={usernameClassName}>{username}</span>
    </div>
  );
}
