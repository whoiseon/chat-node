'use client';

import { ExternalToast, toast } from 'sonner';

import { Icons } from '../components/ui/icon';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'np';

interface ToastProps {
  type?: ToastType;
  message: string;
  description?: string;
  options?: ExternalToast;
}

const defaultOptions: ExternalToast = {
  duration: 3000,
  position: 'top-center',
  descriptionClassName: 'text-muted-foreground!',
};

export function useToast() {
  return ({ message, type = 'success', options }: ToastProps) => {
    switch (type) {
      case 'error':
        toast.error(message, {
          ...defaultOptions,
          className:
            'border border-destructive/30! text-red-500! dark:text-red-300!',
          ...options,
        });
        break;
      case 'warning':
        toast.warning(message, {
          ...defaultOptions,
          className:
            'border border-yellow-600/20! dark:border-yellow-400/20! text-yellow-600! dark:text-yellow-300!',
          ...options,
        });
        break;
      case 'info':
        toast.info(message, {
          ...defaultOptions,
          className: 'text-blue-600! dark:text-blue-300!',
          ...options,
        });
        break;
      case 'np':
        toast.success(message, {
          ...defaultOptions,
          position: 'bottom-right',
          duration: 5000,
          icon: <Icons.NP className="size-4" />,
          ...options,
        });
        break;
      default:
        toast.success(message, { ...defaultOptions, ...options });
        break;
    }
  };
}
