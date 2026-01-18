/**
 * useExchangeRates Hook
 * @description 환율 정보 조회 (60초 자동 폴링)
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/apiClient';
import type { ExchangeRate } from '@/shared/types';

// 환율 정보 조회 API
const getExchangeRates = async (): Promise<ExchangeRate[]> => {
  const response = await api.get<ExchangeRate[]>('/exchange-rates');
  return response.data;
};

export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: getExchangeRates,
    refetchInterval: 60000, // 60초마다 자동 재조회
    staleTime: 55000, // 55초 동안 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });
};
