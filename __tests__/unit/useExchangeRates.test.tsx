import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExchangeRates } from '@/features/exchange/hooks/useExchangeRates';

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

describe('useExchangeRates', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch exchange rates on mount', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.rates).toBeDefined();
    expect(result.current.data?.baseDate).toBeDefined();
  });

  it('should return loading state initially', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper });

    expect(result.current.isPending).toBe(true);
  });

  it('should have exchange rates data structure', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveProperty('rates');
    expect(result.current.data).toHaveProperty('baseDate');
    expect(typeof result.current.data?.rates).toBe('object');
  });

  it('should transform API response correctly', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // MSW에서 USD와 JPY를 반환하므로 확인
    expect(result.current.data?.rates).toHaveProperty('USD');
    expect(result.current.data?.rates).toHaveProperty('JPY');
    expect(result.current.data?.rates.USD).toBe(1320.50);
    expect(result.current.data?.rates.JPY).toBe(9.15);
  });

  it('should refetch on manual refetch call', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    // 수동 refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle error state', async () => {
    // MSW 핸들러를 오버라이드하여 에러 시뮬레이션
    const { server } = await import('@/__tests__/mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.get('https://exchange-example.switchflow.biz/exchange-rates/latest', () => {
        return HttpResponse.error();
      })
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchangeRates(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
