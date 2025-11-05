'use client';

import { Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string;
  labelRight?: React.ReactNode;
  errorMessage?: string;
}

export default function FormInput({
  label,
  labelClassName,
  labelRight,
  errorMessage,
  ...props
}: FormInputProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        {label && (
          <Label htmlFor={props.id} className={cn(labelClassName)}>
            {label}
          </Label>
        )}
        {labelRight && labelRight}
      </div>
      <Input className={cn(errorMessage && 'border-destructive')} {...props} />
      {errorMessage && (
        <div className="flex items-center gap-1.5 pl-1">
          <Icons.CircleAlert
            className="size-3.5 text-destructive"
            strokeWidth={1.5}
          />
          <p className="text-xs text-destructive">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
