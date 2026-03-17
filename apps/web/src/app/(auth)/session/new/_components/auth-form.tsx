'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Field, FieldContent, FieldError } from '@repo/ui/components/ui/field';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import { useEffect, useMemo, useState } from 'react';

import { useUnifiedAuthForm } from '../_hooks/use-unified-auth-form';

import type { FormValues } from '../_schemas/session.schema';
import type { FormEvent } from 'react';

type Mode = 'signIn' | 'signUp';
type Step = 'username' | 'password' | 'confirmPassword' | 'displayName';

const SIGN_IN_STEPS: Step[] = ['username', 'password'];
const SIGN_UP_STEPS: Step[] = [
  'username',
  'password',
  'confirmPassword',
  'displayName',
];

const TEXT_BY_STEP: Record<Step, { heading: string; description: string }> = {
  username: {
    heading: '아이디로 시작하기',
    description: '프리미엄 채팅 서비스 ChatNode에 오신것을 환영합니다.',
  },
  password: {
    heading: '비밀번호 입력',
    description: '비밀번호를 입력해주세요.',
  },
  confirmPassword: {
    heading: '비밀번호 확인',
    description: '비밀번호를 다시 입력해주세요.',
  },
  displayName: {
    heading: '닉네임 입력',
    description: '사용하실 닉네임을 입력해주세요.',
  },
};

const STEP_FIELDS: Record<Step, (keyof FormValues)[]> = {
  username: ['username'],
  password: ['password'],
  confirmPassword: ['confirmPassword'],
  displayName: ['displayName'],
};

const mockUsers = [
  {
    username: 'admin',
    password: 'password',
  },
];

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [stepIndex, setStepIndex] = useState<number>(0);

  const steps = mode === 'signIn' ? SIGN_IN_STEPS : SIGN_UP_STEPS;
  const step = steps[stepIndex] || 'username';
  const lastStep = stepIndex === steps.length - 1;

  const form = useUnifiedAuthForm(mode);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isValid },
    setFocus,
    getValues,
  } = form;

  const { heading, description } = useMemo(() => TEXT_BY_STEP[step], [step]);

  useEffect(
    function autoFocus() {
      if (!step) return;
      const field = STEP_FIELDS[step];
      if (field[0]) setFocus(field[0]);
    },
    [step, setFocus],
  );

  const findUser = (username: string) =>
    mockUsers.find((user) => user.username === username);

  const onNext = async () => {
    // 현재 스텝 필드만 검증
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields as (keyof FormValues)[], {
      shouldFocus: true,
    });
    if (!valid) return;

    // 사용자 조회
    const currentUsername = getValues('username');
    const user = findUser(currentUsername || '');
    if (!user && mode === 'signIn') {
      setMode('signUp');

      // 아이디 재검증
      const confirmValid = await trigger(['confirmPassword'], {
        shouldFocus: true,
      });
      if (!confirmValid) return;

      // 회원가입 플로우로 전환 시 스텝 인덱스를 유지해 계속 이어감
    }

    // 다음 스텝
    setStepIndex((prev) => prev + 1);
  };

  const onFinalSubmit = handleSubmit(async (data) => {
    // TODO: 실제 로그인/회원가입 API 호출
    console.log(
      mode === 'signIn' ? 'sign in payload' : 'sign up payload',
      data,
    );
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!lastStep) {
      event.preventDefault();
      void onNext();
      return;
    }
    void onFinalSubmit(event);
  };

  return (
    <div className="flex flex-col gap-y-6 w-full pt-6 md:pt-20">
      <div className="flex flex-col gap-y-2 text-muted-foreground">
        <h2 className="text-3xl font-medium">{heading}</h2>
        <span className="text-sm">{description}</span>
      </div>

      <form className="flex flex-col gap-y-6" onSubmit={handleFormSubmit}>
        <div className="flex flex-col gap-y-4">
          <Field>
            <FieldContent className="flex flex-col gap-y-2">
              <Input
                {...register('username')}
                type="text"
                className="h-12.5 px-4 text-base placeholder:text-base"
                placeholder="아이디"
                autoComplete="username"
              />
              <FieldError>{errors.username?.message}</FieldError>
            </FieldContent>
          </Field>

          {stepIndex >= 1 && (
            <Field
              className={cn(
                mode === 'signIn'
                  ? 'animate-slide-up'
                  : 'animate-slide-right-to-left',
              )}
            >
              <FieldContent className="flex flex-col gap-y-2">
                <Input
                  {...register('password')}
                  type="password"
                  className="h-12.5 px-4 text-base placeholder:text-base"
                  placeholder="비밀번호"
                  autoComplete={
                    lastStep && mode === 'signIn'
                      ? 'current-password'
                      : 'new-password'
                  }
                />
                <FieldError>{errors.password?.message}</FieldError>
              </FieldContent>
            </Field>
          )}

          {mode === 'signUp' && stepIndex >= 2 && (
            <Field className="animate-slide-right-to-left">
              <FieldContent className="flex flex-col gap-y-2">
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  className="h-12.5 px-4 text-base placeholder:text-base"
                  placeholder="비밀번호 확인"
                  autoComplete="new-password"
                />
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </FieldContent>
            </Field>
          )}

          {mode === 'signUp' && stepIndex >= 3 && (
            <Field className="animate-slide-right-to-left">
              <FieldContent className="flex flex-col gap-y-2">
                <Input
                  {...register('displayName')}
                  type="text"
                  className="h-12.5 px-4 text-base placeholder:text-base"
                  placeholder="닉네임"
                  autoComplete="nickname"
                />
                <FieldError>{errors.displayName?.message}</FieldError>
              </FieldContent>
            </Field>
          )}
        </div>

        <Button
          type="submit"
          className="h-12.5 font-bold"
          disabled={isSubmitting}
        >
          {lastStep ? (mode === 'signIn' ? '로그인' : '가입완료') : '다음'}
        </Button>
      </form>
    </div>
  );
}
