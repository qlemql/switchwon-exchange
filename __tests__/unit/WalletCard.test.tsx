import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletCard } from '@/features/exchange/ui/WalletCard';

describe('WalletCard', () => {
  const mockWallet = {
    walletId: 1,
    currency: 'KRW' as const,
    balance: 1000000,
  };

  it('should render currency name', () => {
    render(<WalletCard wallet={mockWallet} />);

    expect(screen.getByText('KRW')).toBeInTheDocument();
  });

  it('should render balance with currency formatting', () => {
    render(<WalletCard wallet={mockWallet} />);

    expect(screen.getByText(/₩1,000,000/)).toBeInTheDocument();
  });

  it('should render USD wallet correctly', () => {
    const usdWallet = {
      walletId: 2,
      currency: 'USD' as const,
      balance: 500.50,
    };

    render(<WalletCard wallet={usdWallet} />);

    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText(/\$500\.50/)).toBeInTheDocument();
  });

  it('should render JPY wallet correctly', () => {
    const jpyWallet = {
      walletId: 3,
      currency: 'JPY' as const,
      balance: 10000,
    };

    render(<WalletCard wallet={jpyWallet} />);

    expect(screen.getByText('JPY')).toBeInTheDocument();
    expect(screen.getByText(/¥10,000/)).toBeInTheDocument();
  });

  it('should render zero balance', () => {
    const zeroWallet = {
      walletId: 4,
      currency: 'USD' as const,
      balance: 0,
    };

    render(<WalletCard wallet={zeroWallet} />);

    expect(screen.getByText(/\$0\.00/)).toBeInTheDocument();
  });

  it('should render with correct structure', () => {
    const { container } = render(<WalletCard wallet={mockWallet} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display large balance correctly', () => {
    const largeWallet = {
      walletId: 5,
      currency: 'KRW' as const,
      balance: 9999999999,
    };

    render(<WalletCard wallet={largeWallet} />);

    expect(screen.getByText(/₩9,999,999,999/)).toBeInTheDocument();
  });

  it('should display decimal balance for USD', () => {
    const decimalWallet = {
      walletId: 6,
      currency: 'USD' as const,
      balance: 123.45,
    };

    render(<WalletCard wallet={decimalWallet} />);

    expect(screen.getByText(/\$123\.45/)).toBeInTheDocument();
  });
});
