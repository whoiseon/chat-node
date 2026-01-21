'use client';

import { cn } from '@/shared/lib/utils';
import { Input } from '../ui/input';
import { SelectBox, type SelectOptions } from './select-box';

interface SelectWithInputProps extends React.ComponentProps<'input'> {
  selectBoxId: string;
  onSelectChange: (value: string) => void;
  selectValue: string;
  selectDefaultValue: string;
  options: SelectOptions;
  selectClassName?: string;
  inputClassName?: string;
}

export function SelectWithInput({
  selectBoxId,
  selectDefaultValue,
  selectValue,
  onSelectChange,
  options,
  selectClassName,
  inputClassName,
  ...props
}: SelectWithInputProps) {
  return (
    <div className="flex items-center w-full">
      <SelectBox
        id={selectBoxId}
        className={cn(selectClassName, 'rounded-r-none')}
        onChange={onSelectChange}
        name={props.name + 'select'}
        defaultValue={selectDefaultValue}
        value={selectValue}
        options={options}
      />
      <Input
        className={cn('flex-1 rounded-l-none border-l-0', inputClassName)}
        {...props}
      />
    </div>
  );
}
