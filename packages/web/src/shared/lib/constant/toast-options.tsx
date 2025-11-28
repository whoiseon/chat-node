import { ExternalToast } from 'sonner';

import { Icons } from '@/shared/components/ui/icon';

type ToastOptionKey = 'error' | 'dailyLoginBonus';

export const toastOptions: Record<ToastOptionKey, ExternalToast> = {
  error: {
    position: 'top-center',
    duration: 3000,
  },
  dailyLoginBonus: {
    description: '일일 로그인 보너스',
    position: 'bottom-right',
    duration: 5000,
    icon: <Icons.NP className="size-4" />,
  },
};
