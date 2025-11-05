'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import FormInput from '@/components/shared/system/form-input';

import { signupFormSchema, SignupFormSchema } from './schemas';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (data: SignupFormSchema) => {
    console.log(data);
  };
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          모든 필드를 입력하여 회원가입을 진행해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormInput
              id="username"
              label="아이디"
              {...register('username')}
              errorMessage={errors.username?.message}
            />
            <FormInput
              id="password"
              label="비밀번호"
              type="password"
              {...register('password')}
              errorMessage={errors.password?.message}
            />
            <FormInput
              id="password-confirm"
              label="비밀번호 확인"
              type="password"
              {...register('passwordConfirm')}
              errorMessage={errors.passwordConfirm?.message}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="signup-form"
          className="w-full font-semibold"
        >
          가입하기
        </Button>
        <Button variant="outline" className="w-full font-semibold" asChild>
          <Link href="/auth/login">로그인</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
