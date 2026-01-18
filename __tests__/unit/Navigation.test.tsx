import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from '@/widgets/navigation/ui/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockUsePathname = vi.fn();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('Navigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/exchange');
    vi.clearAllMocks();
  });

  it('should render navigation bar', () => {
    render(<Navigation />, { wrapper: Wrapper });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render app title', () => {
    render(<Navigation />, { wrapper: Wrapper });
    expect(screen.getByText(/Exchange app/i)).toBeInTheDocument();
  });

  it('should render Exchange link', () => {
    render(<Navigation />, { wrapper: Wrapper });
    const link = screen.getByRole('link', { name: /환전 하기/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/exchange');
  });

  it('should render History link', () => {
    render(<Navigation />, { wrapper: Wrapper });
    const link = screen.getByRole('link', { name: /환전 내역/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/history');
  });

  it('should highlight active link', () => {
    mockUsePathname.mockReturnValue('/exchange');

    render(<Navigation />, { wrapper: Wrapper });
    const activeLink = screen.getByRole('link', { name: /환전 하기/i });
    expect(activeLink).toHaveClass('text-blue-600');
  });

  it('should not highlight inactive links', () => {
    mockUsePathname.mockReturnValue('/exchange');

    render(<Navigation />, { wrapper: Wrapper });
    const inactiveLink = screen.getByRole('link', { name: /환전 내역/i });
    expect(inactiveLink).not.toHaveClass('text-blue-600');
  });
});
