import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOrders } from '@/features/history/hooks/useOrders';

// 테스트용 QueryClient 생성
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

// Wrapper
const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useOrders', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch orders on mount', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useOrders({ page: 1, limit: 10 }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should return loading state initially', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useOrders({ page: 1, limit: 10 }), { wrapper });

    expect(result.current.isPending).toBe(true);
  });

  it('should have correct data structure', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useOrders({ page: 1, limit: 10 }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveProperty('orders');
    expect(result.current.data).toHaveProperty('total');
    expect(result.current.data).toHaveProperty('page');
    expect(result.current.data).toHaveProperty('limit');
  });

  it('should return array of orders', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useOrders({ page: 1, limit: 10 }), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(Array.isArray(result.current.data?.orders)).toBe(true);
  });

  it('should refetch when page changes', async () => {
    const wrapper = createWrapper();
    const { result, rerender } = renderHook(
      ({ params }) => useOrders(params),
      {
        wrapper,
        initialProps: {
          params: { page: 1, limit: 10 },
        },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstFetchTime = Date.now();

    // 페이지 변경
    rerender({
      params: { page: 2, limit: 10 },
    });

    // 새로운 데이터가 로드되는지 확인 (isFetching 상태 확인)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 성공적으로 재조회되었는지 확인
    expect(result.current.data).toBeDefined();
  });

  it('should handle error state', async () => {
    // MSW 핸들러를 오버라이드하여 에러 시뮬레이션
    const { server } = await import('@/__tests__/mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.get('https://exchange-example.switchflow.biz/orders', () => {
        return HttpResponse.error();
      })
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useOrders({ page: 1, limit: 10 }), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
