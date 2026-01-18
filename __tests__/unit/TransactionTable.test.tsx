import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionTable } from '@/features/history/ui/TransactionTable';
import type { Order } from '@/features/history/types';

const mockOrders: Order[] = [
  {
    orderId: 1,
    fromCurrency: 'KRW',
    toCurrency: 'USD',
    fromAmount: 1000000,
    toAmount: 750,
    appliedRate: 1333.33,
    orderedAt: '2024-01-15T10:30:00Z',
  },
  {
    orderId: 2,
    fromCurrency: 'USD',
    toCurrency: 'JPY',
    fromAmount: 500,
    toAmount: 75000,
    appliedRate: 150,
    orderedAt: '2024-01-14T15:45:00Z',
  },
];

describe('TransactionTable', () => {
  it('should render table headers', () => {
    render(<TransactionTable orders={mockOrders} />);
    expect(screen.getByText('거래 ID')).toBeInTheDocument();
    expect(screen.getByText('거래 일시')).toBeInTheDocument();
    expect(screen.getByText('매수 금액')).toBeInTheDocument();
    expect(screen.getByText('체결 환율')).toBeInTheDocument();
    expect(screen.getByText('매도 금액')).toBeInTheDocument();
  });

  it('should display transaction rows', () => {
    render(<TransactionTable orders={mockOrders} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should format currency amounts correctly', () => {
    render(<TransactionTable orders={mockOrders} />);
    // 매수 금액 (toAmount) 표시 확인
    expect(screen.getByText(/750/)).toBeInTheDocument();
    expect(screen.getByText(/75,000/)).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    render(<TransactionTable orders={mockOrders} />);
    // 날짜 형식 확인 (로케일에 따라 달라질 수 있음)
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('should show empty state when no orders', () => {
    render(<TransactionTable orders={[]} />);
    expect(screen.getByText('거래 내역이 없습니다')).toBeInTheDocument();
  });

  it('should display loading skeleton', () => {
    render(<TransactionTable orders={mockOrders} isLoading={true} />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should be scrollable on mobile', () => {
    render(<TransactionTable orders={mockOrders} />);
    const table = screen.getByRole('table');
    expect(table.parentElement).toHaveClass('overflow-x-auto');
  });

  it('should display all order data correctly', () => {
    render(<TransactionTable orders={mockOrders} />);

    // Check order IDs
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Check exchange rates
    expect(screen.getByText('1333.33')).toBeInTheDocument();
    expect(screen.getByText('150.00')).toBeInTheDocument();
  });
});
