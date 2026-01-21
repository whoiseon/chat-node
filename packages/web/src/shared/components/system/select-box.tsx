'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from '../ui/select';
import { cn } from '@/shared/lib/utils';

interface SelectOption {
  label: string;
  options: { label: string; value: string }[];
}

export type SelectOptions = SelectOption[];

export interface SelectBoxProps {
  id: string;
  className?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  defaultValue: string;
  value: string;
  name: string;
}

export function SelectBox({
  id,
  className,
  placeholder,
  options,
  onChange,
  defaultValue,
  value,
  name,
}: SelectBoxProps) {
  return (
    <Select
      onValueChange={onChange}
      value={value}
      defaultValue={defaultValue}
      name={name}
    >
      <SelectTrigger id={id} className={cn(className)} value={value}>
        <SelectValue placeholder={placeholder ? placeholder : undefined} />
      </SelectTrigger>
      <SelectContent>
        {options.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((option) => (
              <SelectItem key={option.label} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
