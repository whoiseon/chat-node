import { Icons } from '@/shared/components/ui/icon';
import { ServerFilterType } from '../types/server-filter.types';
import { SelectOptions } from '@/shared/components/system/select-box';

export const filterType: Array<{
  value: ServerFilterType;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'latest',
    label: '최신',
    icon: <Icons.Clock strokeWidth={2.5} />,
  },
  {
    value: 'popular',
    label: '인기',
    icon: <Icons.Flame strokeWidth={2.5} />,
  },
  {
    value: 'tag',
    label: '태그',
    icon: <Icons.Tag strokeWidth={2.5} />,
  },
];

export const searchOptions: SelectOptions = [
  {
    label: '서버 검색',
    options: [
      { label: '서버 이름', value: 'name' },
      { label: '서버 매니저 ID', value: 'manager' },
    ],
  },
];
