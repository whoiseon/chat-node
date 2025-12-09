'use client';

import {
  SetStateAction,
  Dispatch,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Badge } from '../ui/badge';
import { Icons } from '../ui/icon';
import { Input } from '../ui/input';

interface TagInputProps {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  maxTags?: number;
}

export default function TagInput({
  tags,
  setTags,
  maxTags = 5,
}: TagInputProps) {
  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const ignore = useRef<boolean>(false);

  const onCompositionStart = () => {
    setIsComposing(true);
  };

  const onCompositionEnd = () => {
    setIsComposing(false);
  };

  useEffect(() => {
    if (tags.length === 0) return;
    if (tags.length >= maxTags) return;
    setTags(tags);
  }, [tags, setTags, maxTags]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onOutsideClick = () => {
    if (value === '') return;
    if (tags.length >= maxTags) return;
    insertTag(value);
  };

  const insertTag = (tag: string) => {
    ignore.current = true;
    setValue('');

    if (tag === '') return;
    if (tags.length >= maxTags) return;

    let processed = tag;
    processed = tag.trim();

    if (processed.indexOf(' #') > 0) {
      const tempTags: string[] = [];
      const regex = /#(\S+)/g;
      let execArray: RegExpExecArray | null = null;

      while ((execArray = regex.exec(processed))) {
        if (execArray !== null) {
          tempTags.push(execArray[1]);
        }
      }

      setTags((prevTags) => {
        // 중복 체크
        const newTags = tempTags.filter((t) => !prevTags.includes(t));
        return [...prevTags, ...newTags];
      });
      return;
    }

    if (processed.charAt(0) === '#') {
      processed = processed.slice(1, processed.length);
    }

    setTags((prevTags) => {
      // 중복 체크
      if (prevTags.includes(processed)) return prevTags;
      return [...prevTags, processed];
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;

    if (e.key === 'Backspace' && value === '') {
      setTags(tags.slice(0, tags.length - 1));
      return;
    }

    const keys = [',', 'Enter'];
    if (keys.includes(e.key)) {
      e.preventDefault();
      insertTag(value);
    }
  };

  const onRemove = (tag: string) => {
    const nextTags = tags.filter((t) => t !== tag);

    if (nextTags.length === 0) {
      setTags([]);
    } else {
      setTags(nextTags);
    }
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
            />
          )}
        </div>
      </div>
    </OutsideClickHandler>
  );
}
