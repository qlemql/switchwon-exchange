/**
 * useOrders Hook
 * @description 거래 내역 조회 (페이지네이션)
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/apiClient';
import type { Order, OrdersParams, OrdersResponse } from '@/features/history/types';

// 거래 내역 조회 API
const getOrders = async (params: OrdersParams): Promise<OrdersResponse> => {
  const response = await api.get<OrdersResponse>('/orders', {
    params: {
      page: params.page,
      limit: params.limit,
    },
  });

  return response.data;
};

export const useOrders = (params: OrdersParams) => {
  return useQuery({
    queryKey: ['orders', params.page, params.limit],
    queryFn: () => getOrders(params),
    staleTime: 60 * 1000, // 60초 동안 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });
};
