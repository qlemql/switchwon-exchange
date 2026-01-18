import { describe, it, expect } from 'vitest';
import { calculateReceiveAmount } from '@/shared/lib/calculateExchange';

describe('calculateReceiveAmount', () => {
  it('should calculate USD to KRW conversion (multiply)', () => {
    // 100 USD * 1320.50 = 132050 KRW
    const result = calculateReceiveAmount(100, 1320.50);
    expect(result).toBe(132050);
  });

  it('should handle decimal amounts', () => {
    // 100.50 USD * 1320.50 = 132710.25 KRW
    const result = calculateReceiveAmount(100.50, 1320.50);
    expect(result).toBe(132710.25);
  });

  it('should handle decimal exchange rates', () => {
    // 100 USD * 1100.75 = 110075 KRW
    const result = calculateReceiveAmount(100, 1100.75);
    expect(result).toBe(110075);
  });

  it('should round to 2 decimal places for currency amounts', () => {
    // 100 USD * 1320.567 = 132056.70 KRW (rounded)
    const result = calculateReceiveAmount(100, 1320.567);
    expect(result).toBe(132056.7);
  });

  it('should handle very small amounts', () => {
    // 0.01 USD * 1320.50 = 13.21 KRW (rounded)
    const result = calculateReceiveAmount(0.01, 1320.50);
    expect(result).toBeCloseTo(13.21, 2);
  });

  it('should handle very large amounts', () => {
    // 1000000 USD * 1320.50 = 1320500000 KRW
    const result = calculateReceiveAmount(1000000, 1320.50);
    expect(result).toBe(1320500000);
  });

  it('should return 0 for zero amount', () => {
    const result = calculateReceiveAmount(0, 1320.50);
    expect(result).toBe(0);
  });

  it('should handle JPY exchange rate', () => {
    // 100 USD * 9.12 = 912 JPY
    const result = calculateReceiveAmount(100, 9.12);
    expect(result).toBe(912);
  });

  it('should maintain precision for financial calculations', () => {
    // Prevent floating point errors
    // 1000.99 USD * 1.5 = 1501.485 -> 1501.49 (rounded to 2 decimals)
    const result = calculateReceiveAmount(1000.99, 1.5);
    expect(result).toBeCloseTo(1501.49, 2);
  });

  it('should handle complex decimal multiplication', () => {
    // 999.99 * 123.45 = 123448.7655 -> 123448.77 (rounded)
    const result = calculateReceiveAmount(999.99, 123.45);
    expect(result).toBeCloseTo(123448.77, 2);
  });
});
