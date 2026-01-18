/**
 * useWallets Hook
 * @description 지갑 잔액 정보 조회
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/apiClient';
import type { Wallet } from '@/shared/types';

// 지갑 정보 조회 API
const getWallets = async (): Promise<Wallet[]> => {
  const response = await api.get<Wallet[]>('/wallets');
  return response.data;
};

export const useWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: getWallets,
    staleTime: 5 * 60 * 1000, // 5분 동안 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });
};
