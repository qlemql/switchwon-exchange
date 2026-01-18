/**
 * React Query 클라이언트 설정
 * @description 전역 Query Client 설정 및 기본 옵션
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 stale 상태로 전환되는 시간 (5분)
      staleTime: 5 * 60 * 1000,

      // 캐시에서 데이터가 제거되는 시간 (10분)
      gcTime: 10 * 60 * 1000,

      // 에러 발생 시 재시도 설정
      retry: (failureCount, error: any) => {
        // 401, 403 에러는 재시도하지 않음
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // 최대 2번까지 재시도
        return failureCount < 2;
      },

      // 재시도 지연 시간 (지수 백오프)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // 윈도우 포커스 시 자동 재조회 비활성화
      refetchOnWindowFocus: false,

      // 마운트 시 자동 재조회 활성화
      refetchOnMount: true,

      // 네트워크 재연결 시 자동 재조회 활성화
      refetchOnReconnect: true,
    },
    mutations: {
      // mutation 에러 시 재시도 안 함
      retry: false,
    },
  },
});
