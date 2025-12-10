'use client';

import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';

import { cn } from '@/shared/lib/utils';
import { FormErrorMessage } from './form-error-message';

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelClassName?: string;
  labelRight?: React.ReactNode;
  errorMessage?: string;
}

export function FormTextarea({
  label,
  labelClassName,
  labelRight,
  errorMessage,
  ...props
}: FormTextareaProps) {
  return (
    <div className="grid gap-2 w-full">
      {label && (
        <div className="flex items-center">
          <Label htmlFor={props.id} className={cn(labelClassName)}>
            {label}
          </Label>
          {labelRight && labelRight}
        </div>
      )}
      <Textarea
        className={cn(errorMessage && 'border-destructive')}
        {...props}
      />
      {errorMessage && <FormErrorMessage message={errorMessage} />}
    </div>
  );
}
