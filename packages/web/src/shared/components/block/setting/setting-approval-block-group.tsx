import { cn } from '@/shared/lib/utils';

import { Icons } from '../../ui/icon';
import { SERVER_JOIN_TYPE } from '@/features/server/types/server.types';
import { ServerJoinType } from '@/features/server/schemas/create-server.schema';

interface SettingApprovalBlockGroupProps {
  joinType: ServerJoinType;
  setJoinType: React.Dispatch<React.SetStateAction<ServerJoinType>>;
}

const blockMap = [
  {
    title: '바로 가입',
    value: SERVER_JOIN_TYPE.DIRECT,
    description: '가입 요청 없이 바로 가입할 수 있습니다.',
  },
  {
    title: '가입 승인',
    value: SERVER_JOIN_TYPE.APPROVAL,
    description: '매니저 또는 관리자의 승인이 필요합니다.',
  },
  {
    title: '비공개',
    value: SERVER_JOIN_TYPE.PRIVATE,
    description: '비공개 서버로, 초대 없이 가입할 수 없습니다.',
  },
];

export function SettingApprovalBlockGroup({
  joinType,
  setJoinType,
}: SettingApprovalBlockGroupProps) {
  return (
    <div className="flex items-center gap-x-2">
      {blockMap.map((block) => {
        const isActive = block.value === joinType;

        return (
          <button
            type="button"
            key={block.title}
            className={cn(
              'flex items-center px-4 py-3 border border-border-accent rounded-md cursor-pointer transition-colors duration-100',
              isActive
                ? 'bg-blue-500 dark:bg-blue-400 text-background border-none hover:bg-blue-400 dark:hover:bg-blue-300'
                : 'hover:bg-accent'
            )}
            onClick={() => setJoinType(block.value)}
          >
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-2">
                {block.value === joinType ? (
                  <Icons.DoubleCheck className="size-4" />
                ) : null}
                <span className="text-sm font-semibold">{block.title}</span>
              </div>
              <span
                className={cn(
                  'text-xs text-muted-foreground text-left',
                  isActive ? 'text-inherit' : ''
                )}
              >
                {block.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
