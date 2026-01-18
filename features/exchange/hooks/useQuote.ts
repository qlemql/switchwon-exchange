/**
 * useQuote Hook
 * @description 환전 견적 조회
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/apiClient';
import type { Currency } from '@/shared/types';

interface QuoteParams {
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number;
}

interface QuoteResponse {
  krwAmount: number;
  appliedRate: number;
}

// 견적 조회 API (GET with query parameters)
const getQuote = async (params: QuoteParams): Promise<QuoteResponse> => {
  const response = await api.get<QuoteResponse>('/quote', {
    params: {
      fromCurrency: params.fromCurrency,
      toCurrency: params.toCurrency,
      forexAmount: params.forexAmount,
    },
  });
  return response.data;
};

export const useQuote = (params: QuoteParams) => {
  return useQuery({
    queryKey: ['quote', params.fromCurrency, params.toCurrency, params.forexAmount],
    queryFn: () => getQuote(params),
    enabled: params.forexAmount > 0, // 금액이 0보다 클 때만 조회
    staleTime: 30 * 1000, // 30초 동안 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
};
