import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExchangeRateCard } from '@/features/exchange/ui/ExchangeRateCard';
import type { ExchangeRate } from '@/shared/types';

describe('ExchangeRateCard', () => {
  const mockRate: ExchangeRate = {
    exchangeRateId: 1,
    currency: 'USD',
    rate: 1320.50,
    changePercentage: 0.42,
    applyDateTime: '2024-01-15T10:30:00Z',
  };

  it('should render currency name', () => {
    render(<ExchangeRateCard rate={mockRate} />);

    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('should render exchange rate', () => {
    render(<ExchangeRateCard rate={mockRate} />);

    expect(screen.getByText(/1,320.50/)).toBeInTheDocument();
  });

  it('should render change percentage', () => {
    render(<ExchangeRateCard rate={mockRate} />);

    expect(screen.getByText(/0.42%/)).toBeInTheDocument();
  });

  it('should show positive change with red color', () => {
    render(<ExchangeRateCard rate={mockRate} />);

    const changeElement = screen.getByText(/0.42%/);
    expect(changeElement).toHaveClass('text-red-500');
  });

  it('should show negative change with blue color', () => {
    const negativeRate: ExchangeRate = {
      ...mockRate,
      changePercentage: -0.42,
    };

    render(<ExchangeRateCard rate={negativeRate} />);

    const changeElement = screen.getByText(/0.42%/);
    expect(changeElement).toHaveClass('text-blue-500');
  });

  it('should render full exchange rate information', () => {
    const jpyRate: ExchangeRate = {
      exchangeRateId: 2,
      currency: 'JPY',
      rate: 9.15,
      changePercentage: 0.55,
      applyDateTime: '2024-01-15T10:30:00Z',
    };

    render(<ExchangeRateCard rate={jpyRate} />);

    expect(screen.getByText('JPY')).toBeInTheDocument();
    expect(screen.getByText(/9.15/)).toBeInTheDocument();
    expect(screen.getByText(/0.55%/)).toBeInTheDocument();
  });
});
