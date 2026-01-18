import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExchangeRateCard } from '@/features/exchange/ui/ExchangeRateCard';

describe('ExchangeRateCard', () => {
  const mockRate = {
    currency: 'USD',
    rate: 1320.50,
    previousClose: 1315.00,
    change: 0.42,
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
    const negativeRate = {
      ...mockRate,
      change: -0.42,
    };

    render(<ExchangeRateCard rate={negativeRate} />);

    const changeElement = screen.getByText(/-0.42%/);
    expect(changeElement).toHaveClass('text-blue-500');
  });

  it('should show zero change with gray color', () => {
    const zeroRate = {
      ...mockRate,
      change: 0,
    };

    render(<ExchangeRateCard rate={zeroRate} />);

    const changeElement = screen.getByText(/0.00%/);
    expect(changeElement).toHaveClass('text-gray-500');
  });

  it('should render with correct structure', () => {
    const { container } = render(<ExchangeRateCard rate={mockRate} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display JPY rate correctly', () => {
    const jpyRate = {
      currency: 'JPY',
      rate: 9.15,
      previousClose: 9.10,
      change: 0.55,
    };

    render(<ExchangeRateCard rate={jpyRate} />);

    expect(screen.getByText('JPY')).toBeInTheDocument();
    expect(screen.getByText(/9.15/)).toBeInTheDocument();
    expect(screen.getByText(/0.55%/)).toBeInTheDocument();
  });
});
