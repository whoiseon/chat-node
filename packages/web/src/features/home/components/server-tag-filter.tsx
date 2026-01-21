'use client';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Icons } from '@/shared/components/ui/icon';

import { ServerTagRow } from '@/features/server/types/server.types';

import { Input } from '@/shared/components/ui/input';
import { useEffect, useState } from 'react';
import { useDebounceState } from '@/shared/hooks/use-debounce-state';
import { useServerFilter } from '../contexts/server-filter-context';

export function ServerTagFilter({
  tagList,
  selectedTags,
}: {
  tagList: ServerTagRow[];
  selectedTags: string[];
}) {
  const { toggleTag, clearTags } = useServerFilter();

  const [filteredTagList, setFilteredTagList] = useState<ServerTagRow[]>(
    () => tagList
  );
  const [searchTag, setSearchTag] = useState<string>('');
  const debouncedSearchTag = useDebounceState<string>(searchTag, 500);

  const handleSearchTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTag(e.target.value);
  };

  const isAllSelected = selectedTags.length === 0;

  useEffect(
    function updateTagList() {
      setFilteredTagList(tagList);
    },
    [tagList]
  );

  useEffect(
    function updateFilteredTagList() {
      if (!debouncedSearchTag) {
        setFilteredTagList(tagList);
        return;
      }

      setFilteredTagList((prev) => {
        return prev.filter((tag) =>
          tag.name.toLowerCase().includes(debouncedSearchTag.toLowerCase())
        );
      });
    },
    [debouncedSearchTag, tagList]
  );

  return (
    <div className="flex flex-col items-start gap-y-2">
      <div>
        <Input
          placeholder={`태그 검색...`}
          value={searchTag}
          onChange={handleSearchTag}
          className="w-[200px] bg-stone-50 dark:bg-stone-900 border-none px-0 py-0 text-sm h-7 shadow-none"
        />
      </div>
      <div className="flex items-center gap-x-1 w-full flex-wrap">
        <Badge
          variant="gray"
          className={cn(
            'text-sm cursor-pointer',
            isAllSelected &&
              'bg-blue-500 text-stone-50 dark:bg-blue-400 dark:text-stone-900 hover:bg-blue-400 dark:hover:bg-blue-300'
          )}
          onClick={clearTags}
        >
          <div className="flex items-center gap-x-2">
            <div>전체 ({tagList.length.toLocaleString()})</div>
          </div>
        </Badge>
        {filteredTagList.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          return (
            <Badge
              key={tag.name}
              variant="gray"
              className={cn(
                'text-sm cursor-pointer',
                isSelected &&
                  'bg-blue-500 text-stone-50 dark:bg-blue-400 dark:text-stone-900 hover:bg-blue-400 dark:hover:bg-blue-300'
              )}
              onClick={() => toggleTag(tag.name)}
            >
              <div className="flex items-center gap-x-2">
                <div>
                  {tag.name} ({tag.totalCount.toLocaleString()})
                </div>
                {isSelected && (
                  <Icons.X
                    className="size-3 text-stone-50 dark:text-stone-900"
                    strokeWidth={2.5}
                  />
                )}
              </div>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
