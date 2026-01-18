import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuote } from '@/features/exchange/hooks/useQuote';

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

describe('useQuote', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not fetch quote when amount is zero', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useQuote({ fromCurrency: 'KRW', toCurrency: 'USD', forexAmount: 0 }),
      { wrapper }
    );

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch quote when amount is greater than zero', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useQuote({ fromCurrency: 'KRW', toCurrency: 'USD', forexAmount: 132050 }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should have correct quote data structure', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useQuote({ fromCurrency: 'KRW', toCurrency: 'USD', forexAmount: 132050 }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveProperty('exchangeRateId');
    expect(result.current.data).toHaveProperty('fromCurrency');
    expect(result.current.data).toHaveProperty('toCurrency');
    expect(result.current.data).toHaveProperty('forexAmount');
    expect(result.current.data).toHaveProperty('receivedAmount');
    expect(result.current.data).toHaveProperty('appliedRate');
  });

  it('should calculate correct received amount', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useQuote({ fromCurrency: 'KRW', toCurrency: 'USD', forexAmount: 132050 }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.fromCurrency).toBe('KRW');
    expect(result.current.data?.toCurrency).toBe('USD');
    expect(result.current.data?.forexAmount).toBe(132050);
    expect(result.current.data?.receivedAmount).toBeGreaterThan(0);
  });

  it('should refetch when parameters change', async () => {
    const wrapper = createWrapper();
    const { result, rerender } = renderHook(
      ({ params }) => useQuote(params),
      {
        wrapper,
        initialProps: {
          params: { fromCurrency: 'KRW', toCurrency: 'USD', forexAmount: 132050 },
        },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    // 파라미터 변경
    rerender({
      params: { fromCurrency: 'KRW', toCurrency: 'JPY', forexAmount: 132050 },
    });

    await waitFor(() => {
      expect(result.current.data?.toCurrency).toBe('JPY');
    });
  });

  it('should handle error state', async () => {
    // MSW 핸들러를 오버라이드하여 에러 시뮬레이션
    const { server } = await import('@/__tests__/mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.get('https://exchange-example.switchflow.biz/orders/quote', () => {
        return HttpResponse.error();
      })
    );

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useQuote({ fromCurrency: 'KRW', toCurrency: 'USD', forexAmount: 132050 }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
