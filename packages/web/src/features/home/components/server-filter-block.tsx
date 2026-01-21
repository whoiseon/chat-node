'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { SelectWithInput } from '@/shared/components/system/select-with-input';
import { Icons } from '@/shared/components/ui/icon';

import { useGetServerTagList } from '@/features/server/hooks/use-get-server-tag-list';

import { ServerFilterType } from '../types/server-filter.types';
import { buildQueryString } from '../utils/build-query-string';
import { ServerTagFilter } from './server-tag-filter';
import { useServerFilter } from '../contexts/server-filter-context';
import { filterType, searchOptions } from '../constants/filter.constants';

export function ServerFilterBlock() {
  const toast = useToast();
  const { data: tagList, isLoading } = useGetServerTagList();

  const { type, selectedTags, search, clearSearch, updateFilters } =
    useServerFilter();

  const defaultValue = searchOptions[0].options[0].value;
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchSelect, setSearchSelect] = useState<string>(defaultValue);

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(e.target.value);
    },
    []
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchKeyword || !searchSelect) {
      toast({
        type: 'error',
        message: '검색어를 입력해주세요',
      });
      return;
    }
    updateFilters({
      search: searchKeyword,
      search_target: searchSelect,
    });
  };

  return (
    <div className="relative py-3 mx-auto my-0 w-full flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        {search ? (
          <div className="h-9 flex items-center gap-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                clearSearch();
                setSearchKeyword('');
              }}
            >
              <Icons.ChevronLeft />
            </Button>
            <span className="text-lg">
              {'"'}
              <b className="text-brand">{search}</b>
              {'"'}에 대한 검색 결과 입니다.
            </span>
          </div>
        ) : (
          <ServerFilterNav currentType={type} />
        )}
        <form className="relative flex w-[400px]" onSubmit={handleSearch}>
          <SelectWithInput
            id="server-search-input"
            selectClassName="min-w-[132px] bg-transparent! border-stone-250 dark:border-stone-750"
            inputClassName="bg-transparent! border-stone-250 dark:border-stone-750 pr-9"
            selectBoxId="server-search-select"
            name="server-search"
            options={searchOptions}
            selectValue={searchSelect}
            selectDefaultValue={defaultValue}
            onSelectChange={(value) => setSearchSelect(value)}
            value={searchKeyword}
            onChange={handleChangeSearch}
            placeholder="검색어를 입력해주세요."
          />
          <Button
            type="submit"
            size="icon"
            className="text-foreground bg-transparent hover:bg-accent size-9 border-l border-l-stone-250 dark:border-l-stone-750 rounded-r-sm rounded-l-none absolute top-0 right-0"
          >
            <Icons.LogoIcon />
          </Button>
        </form>
      </div>
      {!search && type === 'tag' ? (
        isLoading ? (
          <ServerTagFilterSkeleton />
        ) : (
          <ServerTagFilter
            tagList={tagList?.payload?.rows ?? []}
            selectedTags={selectedTags}
          />
        )
      ) : null}
    </div>
  );
}

function ServerFilterNav({ currentType }: { currentType: ServerFilterType }) {
  return (
    <nav className="relative flex items-center gap-x-0.5">
      {filterType.map((item) => {
        const isActive = currentType === item.value;
        const queryString = buildQueryString({ type: item.value });

        return (
          <Button
            key={item.value}
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              'text-muted-foreground text-base font-medium w-[80px] h-9',
              isActive && 'text-foreground font-semibold bg-accent'
            )}
          >
            <Link href={queryString} className="flex items-center gap-x-2">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

function ServerTagFilterSkeleton() {
  return (
    <div className="flex flex-col items-start gap-y-2">
      <Skeleton className="w-[200px] h-7" />
      <div className="flex items-center gap-x-1 w-full flex-wrap">
        <Skeleton className="h-[26px] w-[64px]" />
        <Skeleton className="h-[26px] w-[86px]" />
        <Skeleton className="h-[26px] w-[60px]" />
        <Skeleton className="h-[26px] w-[64px]" />
        <Skeleton className="h-[26px] w-[72px]" />
        <Skeleton className="h-[26px] w-[64px]" />
        <Skeleton className="h-[26px] w-[76px]" />
        <Skeleton className="h-[26px] w-[64px]" />
        <Skeleton className="h-[26px] w-[80px]" />
      </div>
    </div>
  );
}
