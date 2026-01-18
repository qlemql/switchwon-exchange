import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExchange } from '@/features/exchange/hooks/useExchange';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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

describe('useExchange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have mutation function', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchange(), { wrapper });

    expect(typeof result.current.mutate).toBe('function');
  });

  it('should be idle initially', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchange(), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should execute exchange successfully', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchange(), { wrapper });

    result.current.mutate({
      exchangeRateId: 1,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should return order data on success', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchange(), { wrapper });

    result.current.mutate({
      exchangeRateId: 1,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveProperty('id');
    expect(result.current.data).toHaveProperty('fromCurrency');
    expect(result.current.data).toHaveProperty('toCurrency');
    expect(result.current.data).toHaveProperty('forexAmount');
  });

  it('should navigate to history page on success', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchange(), { wrapper });

    result.current.mutate({
      exchangeRateId: 1,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/history');
    });
  });

  it('should handle error state', async () => {
    // MSW 핸들러를 오버라이드하여 에러 시뮬레이션
    const { server } = await import('@/__tests__/mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.post('https://exchange-example.switchflow.biz/orders', () => {
        return HttpResponse.error();
      })
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useExchange(), { wrapper });

    result.current.mutate({
      exchangeRateId: 1,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
