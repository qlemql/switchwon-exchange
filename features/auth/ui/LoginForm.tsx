/**
 * LoginForm 컴포넌트
 * @description 이메일 로그인 폼 (React Hook Form + Zod)
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, type EmailInput } from '@/shared/lib/validators';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { Button } from '@/shared/ui/ui/button';
import { Input } from '@/shared/ui/ui/input';
import { useEffect, useRef } from 'react';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
  });

  const { mutate: login, isPending } = useLogin();
  const inputRef = useRef<HTMLInputElement>(null);

  // 마운트 시 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (data: EmailInput) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          autoComplete="email"
          {...register('email')}
          ref={(e) => {
            register('email').ref(e);
            (inputRef as any).current = e;
          }}
          onChange={(e) => {
            register('email').onChange(e);
            // 입력 시 에러 메시지 제거
            if (errors.email) {
              clearErrors('email');
            }
          }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isPending}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
};
