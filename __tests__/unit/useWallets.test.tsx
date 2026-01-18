import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWallets } from '@/features/exchange/hooks/useWallets';

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

describe('useWallets', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch wallets on mount', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should return loading state initially', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useWallets(), { wrapper });

    expect(result.current.isPending).toBe(true);
  });

  it('should have wallets array in data', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data?.length).toBeGreaterThan(0);
  });

  it('should have correct wallet data structure', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const wallet = result.current.data?.[0];
    expect(wallet).toHaveProperty('currency');
    expect(wallet).toHaveProperty('balance');
    expect(typeof wallet?.currency).toBe('string');
    expect(typeof wallet?.balance).toBe('number');
  });

  it('should refetch on manual refetch call', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

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
      http.get('https://exchange-example.switchflow.biz/wallets', () => {
        return HttpResponse.error();
      })
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useWallets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
