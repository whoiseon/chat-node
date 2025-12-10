'use client';

import { Icons } from '../ui/icon';

interface FormErrorMessageProps {
  message: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  return (
    <div className="flex items-center gap-1.5 pl-1">
      <Icons.CircleAlert
        className="size-3.5 text-destructive"
        strokeWidth={1.5}
      />
      <p className="text-xs text-destructive">{message}</p>
    </div>
  );
}
