'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Field, FieldContent, FieldError } from '@repo/ui/components/ui/field';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import { useEffect, useMemo, useState } from 'react';

import { useCheckUsername } from '../_hooks/use-check-username';
import { useSignInMutation } from '../_hooks/use-sign-in-mutation';
import { useSignUpMutation } from '../_hooks/use-sign-up-mutation';
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
    formState: { errors, isSubmitting },
    setFocus,
    getValues,
    setError,
  } = form;

  const checkUsername = useCheckUsername();
  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();

  const { heading, description } = useMemo(() => TEXT_BY_STEP[step], [step]);

  useEffect(
    function autoFocus() {
      if (!step) return;
      const field = STEP_FIELDS[step];
      if (field[0]) setFocus(field[0]);
    },
    [step, setFocus],
  );

  const onNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields as (keyof FormValues)[], {
      shouldFocus: true,
    });
    if (!valid) return;

    // username 스텝에서 사용자 존재 여부 확인
    if (step === 'username') {
      const currentUsername = getValues('username');

      try {
        const result = await checkUsername.mutateAsync(currentUsername || '');
        const exists = result.payload?.exists ?? false;

        if (!exists && mode === 'signIn') {
          setMode('signUp');
        } else if (exists && mode === 'signUp') {
          setMode('signIn');
        }
      } catch {
        setError('username', {
          message: '사용자 확인 중 오류가 발생했습니다.',
        });
        return;
      }
    }

    setStepIndex((prev) => prev + 1);
  };

  const onFinalSubmit = handleSubmit((data) => {
    if (mode === 'signIn') {
      signInMutation.mutate({
        username: data.username,
        password: data.password,
      });
    } else {
      signUpMutation.mutate({
        username: data.username,
        password: data.password,
        displayName: data.displayName || '',
      });
    }
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!lastStep) {
      event.preventDefault();
      void onNext();
      return;
    }
    void onFinalSubmit(event);
  };

  const isPending =
    isSubmitting ||
    checkUsername.isPending ||
    signInMutation.isPending ||
    signUpMutation.isPending;

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
                disabled={isPending}
              />
              <FieldError>{errors.username?.message}</FieldError>
            </FieldContent>
          </Field>

          {stepIndex >= 1 && (
            <Field className="animate-slide-right-to-left">
              <FieldContent className="flex flex-col gap-y-2">
                <Input
                  {...register('password')}
                  type="password"
                  className="h-12.5 px-4 text-base placeholder:text-base"
                  placeholder="비밀번호"
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
                />
                <FieldError>{errors.displayName?.message}</FieldError>
              </FieldContent>
            </Field>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          className="h-12.5 font-bold"
          disabled={isPending}
        >
          {lastStep ? (mode === 'signIn' ? '로그인' : '가입완료') : '다음'}
        </Button>
      </form>
    </div>
  );
}
