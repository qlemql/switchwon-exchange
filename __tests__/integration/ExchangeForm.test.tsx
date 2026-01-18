import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExchangeForm } from '@/features/exchange/ui/ExchangeForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useExchangeStore } from '@/features/exchange/store/exchangeStore';

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

// 테스트용 Wrapper
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

describe('ExchangeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render currency select', () => {
    render(<ExchangeForm />, { wrapper: Wrapper });
    expect(screen.getByText(/USD 환전하기/i)).toBeInTheDocument();
  });

  it('should render buy/sell buttons', () => {
    render(<ExchangeForm />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /살래요/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /팔래요/i })).toBeInTheDocument();
  });

  it('should render exchange button', () => {
    render(<ExchangeForm />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /환전하기/i })).toBeInTheDocument();
  });

  it('should show mode label', () => {
    render(<ExchangeForm />, { wrapper: Wrapper });
    expect(screen.getByText(/매수 금액/i)).toBeInTheDocument();
  });

  it('should show required KRW label', () => {
    render(<ExchangeForm />, { wrapper: Wrapper });
    expect(screen.getByText(/필요 원화/i)).toBeInTheDocument();
  });

  it('should switch to sell mode', async () => {
    const user = userEvent.setup();
    render(<ExchangeForm />, { wrapper: Wrapper });

    const sellButton = screen.getByRole('button', { name: /팔래요/i });
    await user.click(sellButton);

    expect(screen.getByText(/매도 금액/i)).toBeInTheDocument();
  });

  it('should disable exchange button when amount is empty', () => {
    render(<ExchangeForm />, { wrapper: Wrapper });
    const button = screen.getByRole('button', { name: /환전하기/i });
    expect(button).toBeDisabled();
  });

  it('should show applied rate', () => {
    render(<ExchangeForm />, { wrapper: Wrapper });
    expect(screen.getByText(/적용 환율/i)).toBeInTheDocument();
  });
});
