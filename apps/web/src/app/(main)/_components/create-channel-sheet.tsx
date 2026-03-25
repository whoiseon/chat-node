'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Thumbnail } from '@repo/ui/components/system/thumbnail';
import { Button } from '@repo/ui/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@repo/ui/components/ui/field';
import { Input } from '@repo/ui/components/ui/input';
import { RequiredLabelSymbol } from '@repo/ui/components/ui/required-label-symbol';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/ui/sheet';
import { Switch } from '@repo/ui/components/ui/switch';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { PropsWithChildren } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useCreateChannelMutation } from '@/app/(main)/_hooks/use-create-channel-mutation';
import {
  CreateChannelFormValues,
  createChannelSchema,
} from '@/app/(main)/_schema/create-channel.schema';

export function CreateChannelSheet({ children }: PropsWithChildren) {
  const { mutate } = useCreateChannelMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CreateChannelFormValues>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: '',
      description: '',
      isPrivate: false,
      password: '',
      profileImageUrl: '',
    },
    mode: 'onChange',
  });

  const watched = useWatch({ control });
  const isPrivate = watched.isPrivate;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    // const { isPrivate: _, ...payload } = data;
    // mutate(payload);
  });

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        containerId="app-container"
        className="border-none gap-0 rounded-t-2xl bg-card"
        side="bottom"
      >
        <SheetHeader className="p-6">
          <SheetTitle>채널 생성</SheetTitle>
          <SheetDescription>다양한 주제로 대화해보세요!</SheetDescription>
        </SheetHeader>
        <form className="px-6 pb-10" onSubmit={onSubmit}>
          <div className="flex flex-col gap-y-4">
            <Field>
              <FieldLabel className="text-muted-foreground">
                채널 프로필
              </FieldLabel>
              <FieldContent className="flex-row items-center justify-between">
                <div className="relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-16 border border-border">
                  <Thumbnail src="" alt="channel thumbnail" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Button type="button" variant="outline">
                    이미지 업로드
                  </Button>
                  <FieldDescription>5MB 이하 JPG, PNG, GIF</FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                채널명 <RequiredLabelSymbol />
              </FieldLabel>
              <FieldContent>
                <Input
                  {...register('name')}
                  type="text"
                  className="h-11"
                  placeholder="2자 이상 50자 이하"
                  disabled={isSubmitting}
                  maxLength={50}
                />
                <FieldError className="mt-1">{errors.name?.message}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                채널 설명 <RequiredLabelSymbol />
              </FieldLabel>
              <FieldContent>
                <Textarea
                  {...register('description')}
                  className="resize-none h-40"
                  placeholder="2자 이상 200자 이하"
                  disabled={isSubmitting}
                  maxLength={200}
                />
                <FieldError className="mt-1">
                  {errors.description?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field orientation="horizontal">
              <FieldContent className="justify-between">
                <FieldLabel htmlFor="switch-focus-mode">
                  비밀번호 사용
                </FieldLabel>
                <FieldDescription>
                  사용자가 비밀번호 입력 후 접속할 수 있습니다.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="switch-focus-mode"
                checked={isPrivate}
                onCheckedChange={(checked) => {
                  setValue('isPrivate', checked);
                  if (!checked) setValue('password', '');
                }}
              />
            </Field>

            {isPrivate && (
              <Field className="animate-slide-right-to-left">
                <FieldLabel>
                  비밀번호 <RequiredLabelSymbol />
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...register('password')}
                    type="password"
                    className="h-11"
                    disabled={isSubmitting}
                  />
                  <FieldError className="mt-1">
                    {errors.password?.message}
                  </FieldError>
                </FieldContent>
              </Field>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="mt-6 w-full h-12.5 font-bold"
          >
            생성하기
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
