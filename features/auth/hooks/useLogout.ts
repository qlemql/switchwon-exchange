/**
 * useLogout Hook
 * @description 로그아웃 mutation hook
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/shared/api/apiClient';

// 로그아웃 API 호출
const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // 모든 쿼리 캐시 초기화
      queryClient.clear();
      toast.success('로그아웃 되었습니다');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || '로그아웃에 실패했습니다');
    },
  });
};
