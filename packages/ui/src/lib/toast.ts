'use client';

import { ExternalToast, toast } from 'sonner';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type?: ToastType;
  message?: string;
  description?: string;
  options?: ExternalToast;
}

const defaultOptions: ExternalToast = {
  duration: 3000,
  position: 'top-center',
  descriptionClassName: 'text-muted-foreground!',
};

export function getToast() {
  return ({
    message = '알 수 없느 오류',
    type = 'success',
    options,
  }: ToastProps) => {
    switch (type) {
      case 'error':
        toast.error(message, {
          ...defaultOptions,
          className: 'text-red-500! dark:text-red-300!',
          ...options,
        });
        break;
      case 'warning':
        toast.warning(message, {
          ...defaultOptions,
          className: 'text-yellow-600! dark:text-yellow-300!',
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
      default:
        toast.success(message, { ...defaultOptions, ...options });
        break;
    }
  };
}
