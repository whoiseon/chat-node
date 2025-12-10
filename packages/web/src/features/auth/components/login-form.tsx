'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogIn } from '@/features/auth/hooks/use-log-in';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/components/ui/card';
import { FormInput } from '@/shared/components/system/form-input';

import { loginFormSchema, LoginFormSchema } from '../schemas/auth.schema';

export function LoginForm() {
  const { mutate: logIn } = useLogIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormSchema) => {
    logIn({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>
          아이디와 비밀번호를 입력하여 로그인해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
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
              labelRight={
                <a
                  href="#"
                  className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </a>
              }
              {...register('password')}
              errorMessage={errors.password?.message}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="login-form"
          className="w-full font-semibold"
        >
          로그인
        </Button>
        <Button variant="outline" className="w-full font-semibold" asChild>
          <Link href="/auth/signup">회원가입</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
