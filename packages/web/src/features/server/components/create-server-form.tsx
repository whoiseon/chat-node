'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SettingRowBlock } from '@/shared/components/block/setting/setting-row-block';
import { TagInput } from '@/shared/components/system/tag-input';
import { Button } from '@/shared/components/ui/button';
import { SettingApprovalBlockGroup } from '@/shared/components/block/setting/setting-approval-block-group';
import { FormInput } from '@/shared/components/system/form-input';
import { FormTextarea } from '@/shared/components/system/form-textarea';
import { FormErrorMessage } from '@/shared/components/system/form-error-message';

import {
  ServerCreateSchema,
  serverCreateSchema,
} from '../schemas/create-server.schema';
import { useCreateServer } from '../hooks/use-create-server';
import { SERVER_JOIN_TYPE } from '../types/server.types';

export function CreateServerForm() {
  const { mutate: createServer } = useCreateServer();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(serverCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      tags: [],
      joinType: SERVER_JOIN_TYPE.DIRECT,
    },
  });

  const onSubmit = (data: ServerCreateSchema) => {
    createServer(data);
  };

  return (
    <form id="create-server-form" onSubmit={handleSubmit(onSubmit)}>
      <SettingRowBlock
        title="서버 이름"
        description="서버의 이름을 입력해주세요. 특수문자는 사용할 수 없습니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <FormInput
          errorMessage={errors.name?.message}
          tabIndex={1}
          maxLength={20}
          {...register('name')}
        />
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 주소"
        description="서버의 주소를 입력해주세요. 최대 20자까지 입력할 수 있습니다. * 서버 주소는 추후 변경이 불가능합니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <div className="grid gap-2 w-full">
          <FormInput
            id="slug"
            tabIndex={2}
            maxLength={20}
            className="pl-[185px]"
            inputLeft={
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                https://chatnode.gg/server/
              </span>
            }
            {...register('slug')}
            errorMessage={errors.slug?.message}
          />
        </div>
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 공개 설정"
        className="border-b border-b-border"
      >
        <Controller
          control={control}
          name="joinType"
          render={({ field }) => (
            <SettingApprovalBlockGroup
              joinType={field.value ?? SERVER_JOIN_TYPE.DIRECT}
              setJoinType={(value) =>
                field.onChange(value ?? SERVER_JOIN_TYPE.DIRECT)
              }
            />
          )}
        />
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 설명"
        description="서버의 설명을 입력해주세요. 최대 100자까지 입력할 수 있습니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <FormTextarea
          id="description"
          maxLength={100}
          className="resize-none min-h-30"
          errorMessage={errors.description?.message}
          tabIndex={3}
          {...register('description')}
        />
      </SettingRowBlock>
      <SettingRowBlock
        title="서버 태그"
        description="쉼표 혹은 엔터를 입력하여 태그를 등록할 수 있으며, 최대 5개까지 설정할 수 있습니다. 등록된 태그를 클릭하면 삭제됩니다."
        className="border-b border-b-border"
        titleClassName="pt-1"
      >
        <div className="grid gap-2 w-full">
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagInput
                tags={field.value}
                onChange={field.onChange}
                tabIndex={4}
                maxTags={5}
              />
            )}
          />
          {errors.tags?.message && (
            <FormErrorMessage message={errors.tags?.message} />
          )}
        </div>
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
