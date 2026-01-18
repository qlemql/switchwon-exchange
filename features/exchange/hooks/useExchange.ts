/**
 * useExchange Hook
 * @description 환전 실행
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/shared/api/apiClient';
import type { Currency } from '@/shared/types';

interface ExchangeRequest {
  exchangeRateId: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number;
}

interface ExchangeResponse {
  code: string;
  message: string;
  data: null;
}

// 환전 실행 API
const createExchange = async (request: ExchangeRequest): Promise<ExchangeResponse> => {
  const response = await api.post<ExchangeResponse>('/exchange', request);
  return response.data;
};

export const useExchange = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExchange,
    onSuccess: (data) => {
      toast.success('환전이 완료되었습니다');
      // 지갑 정보 다시 조회
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      // 거래 내역 다시 조회
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // 거래 내역 페이지로 이동
      router.push('/history');
    },
    onError: (error: any) => {
      // EXCHANGE_RATE_MISMATCH 에러 처리
      if (error.code === 'EXCHANGE_RATE_MISMATCH') {
        toast.error('환율이 변경되었습니다. 다시 시도해주세요.');
        // 환율 정보 갱신
        queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
      } else {
        toast.error(error.message || '환전에 실패했습니다');
      }
    },
  });
};
