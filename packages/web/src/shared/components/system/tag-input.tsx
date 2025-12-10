'use client';

import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Badge } from '../ui/badge';
import { Icons } from '../ui/icon';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  tabIndex?: number;
}

export function TagInput({
  tags,
  onChange,
  maxTags = 5,
  tabIndex,
}: TagInputProps) {
  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const onCompositionStart = () => {
    setIsComposing(true);
  };

  const onCompositionEnd = () => {
    setIsComposing(false);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onOutsideClick = () => {
    if (value === '') return;
    if (tags.length >= maxTags) return;
    insertTag(value);
  };

  const insertTag = (tag: string) => {
    setValue('');

    if (tag === '') return;
    if (tags.length >= maxTags) return;

    let processed = tag.trim().slice(0, 255);

    if (processed.indexOf(' #') > 0) {
      const tempTags: string[] = [];
      const regex = /#(\S+)/g;
      let execArray: RegExpExecArray | null = null;
      while ((execArray = regex.exec(processed))) {
        if (execArray !== null) {
          tempTags.push(execArray[1]);
        }
      }
      const newTags = [...tags, ...tempTags];
      onChange(newTags);
      return;
    }

    if (processed.charAt(0) === '#') {
      processed = processed.slice(1, processed.length);
    }
    const newTags = [...tags, processed];
    onChange(newTags);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;

    if (e.key === 'Backspace' && value === '') {
      const nextTags = tags.slice(0, tags.length - 1);
      onChange(nextTags);
      return;
    }
    const keys = [',', 'Enter'];
    if (keys.includes(e.key)) {
      // 등록
      e.preventDefault();
      insertTag(value);
    }
  };

  const onRemove = (tag: string) => {
    const nextTags = tags.filter((t) => t !== tag);
    onChange(nextTags);
  };

  return (
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      <div className="w-full mx-auto min-h-8 flex items-center">
        <div className="h-full flex items-center flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge
              key={tag}
              variant="gray"
              onClick={() => onRemove(tag)}
              className="cursor-pointer text-sm"
            >
              {tag}
              <Icons.X className="size-4" onClick={() => onRemove(tag)} />
            </Badge>
          ))}
          {tags.length < maxTags && (
            <input
              className="h-8 text-sm bg-transparent dark:bg-transparent outline-none placeholder:text-muted-foreground dark:placeholder:text-muted-foreground"
              onChange={onChangeInput}
              value={value}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              onKeyDown={onKeyDown}
              placeholder="태그를 입력하세요"
              tabIndex={tabIndex}
            />
          )}
        </div>
      </div>
    </OutsideClickHandler>
  );
}
