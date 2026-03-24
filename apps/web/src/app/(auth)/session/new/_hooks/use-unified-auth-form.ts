'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  type FormValues,
  signInSchema,
  signUpSchema,
} from '@/app/(auth)/session/new/_schemas/session.schema';

/**
 * 로그인/회원가입 통합 폼.
 * - signIn: username → password (각 스텝에서 해당 필드만 검증)
 * - signUp: username → password → confirmPassword → displayName
 */
export function useUnifiedAuthForm(mode: 'signIn' | 'signUp') {
  const schema = mode === 'signIn' ? signInSchema : signUpSchema;

  return useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
    mode: 'onChange',
  });
}
