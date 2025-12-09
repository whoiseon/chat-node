'use client';

import { useState } from 'react';

import SettingRowBlock from '@/shared/components/block/setting-row-block';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import TagInput from '@/shared/components/system/tag-input';
import { Button } from '@/shared/components/ui/button';
import { Icons } from '@/shared/components/ui/icon';

export default function CreateServerForm() {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <form>
      <SettingRowBlock
        title="서버 이름"
        description="서버의 이름을 입력해주세요. 특수문자는 사용할 수 없습니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <Input />
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 주소"
        description="서버의 주소를 입력해주세요. 최대 20자까지 입력할 수 있습니다. * 서버 주소는 추후 변경이 불가능합니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <div className="w-full relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            https://chatnode.gg/server/
          </span>
          <Input className="pl-[185px]" />
        </div>
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 대표 이미지"
        description="* 서버 대표 이미지는 서버 생성 후 설정을 통해 변경이 가능합니다."
        className="border-b border-b-border"
        titleClassName="pt-1 text-muted-foreground "
      >
        <div className="aspect-video bg-muted rounded-md h-40 flex items-center justify-center border border-input">
          <div className="flex flex-col items-center gap-y-2">
            <Icons.LogoIcon className="size-10 text-muted-foreground/50" />
            <span className="text-muted-foreground/50 text-sm font-bold">
              기본 이미지
            </span>
          </div>
        </div>
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 설명"
        description="서버의 설명을 입력해주세요. 최대 100자까지 입력할 수 있습니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <Textarea className="resize-none h-24" />
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 태그"
        description="쉼표 혹은 엔터를 입력하여 태그를 등록할 수 있으며, 최대 5개까지 설정할 수 있습니다. 등록된 태그를 클릭하면 삭제됩니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <TagInput tags={tags} setTags={setTags} />
      </SettingRowBlock>
      <div className="mt-6 flex justify-end">
        <div>
          <Button variant="default" className="w-full font-semibold">
            서버 생성
          </Button>
        </div>
      </div>
    </form>
  );
}
