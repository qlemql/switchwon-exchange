/**
 * useLogin Hook
 * @description 로그인 mutation hook
 */

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/shared/api/apiClient';
import type { LoginRequest, LoginResponse } from '@/shared/types';

// 로그인 API 호출
const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data.message || '로그인 성공');
      router.push('/exchange');
    },
    onError: (error: any) => {
      toast.error(error.message || '로그인에 실패했습니다');
    },
  });
};
