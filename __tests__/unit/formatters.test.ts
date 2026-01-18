import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import type { Currency } from '@/shared/types';

describe('formatCurrency', () => {
  // KRW 테스트
  it('should format KRW with ₩ symbol and no decimals', () => {
    expect(formatCurrency(1000000, 'KRW')).toBe('₩1,000,000');
  });

  it('should format small KRW amounts', () => {
    expect(formatCurrency(100, 'KRW')).toBe('₩100');
  });

  it('should format zero KRW', () => {
    expect(formatCurrency(0, 'KRW')).toBe('₩0');
  });

  // USD 테스트
  it('should format USD with $ symbol and 2 decimals', () => {
    expect(formatCurrency(1000.50, 'USD')).toBe('$1,000.50');
  });

  it('should format small USD amounts with decimals', () => {
    expect(formatCurrency(5.99, 'USD')).toBe('$5.99');
  });

  it('should format USD with no decimal part as .00', () => {
    expect(formatCurrency(100, 'USD')).toBe('$100.00');
  });

  it('should format zero USD', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  // JPY 테스트
  it('should format JPY with ¥ symbol and no decimals', () => {
    expect(formatCurrency(15000, 'JPY')).toBe('¥15,000');
  });

  it('should format small JPY amounts', () => {
    expect(formatCurrency(100, 'JPY')).toBe('¥100');
  });

  it('should format zero JPY', () => {
    expect(formatCurrency(0, 'JPY')).toBe('¥0');
  });

  // 엣지 케이스
  it('should handle negative amounts', () => {
    expect(formatCurrency(-1000, 'KRW')).toBe('-₩1,000');
    expect(formatCurrency(-50.25, 'USD')).toBe('-$50.25');
  });

  it('should handle very large numbers', () => {
    expect(formatCurrency(1234567890, 'KRW')).toBe('₩1,234,567,890');
  });

  it('should round USD to 2 decimal places', () => {
    expect(formatCurrency(10.999, 'USD')).toBe('$11.00');
    expect(formatCurrency(10.995, 'USD')).toBe('$11.00');
  });

  it('should handle decimal amounts for JPY (round to integer)', () => {
    expect(formatCurrency(100.7, 'JPY')).toBe('¥101');
  });
});

describe('formatDate', () => {
  it('should format ISO string to YYYY-MM-DD HH:mm:ss', () => {
    const date = '2026-01-18T08:30:00Z';
    const formatted = formatDate(date);
    // UTC 기준이므로 정확한 시간은 환경에 따라 다를 수 있음
    expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });

  it('should handle Date object', () => {
    const date = new Date('2026-01-18T15:45:30Z');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });

  it('should format specific date correctly', () => {
    // 명시적으로 로컬 시간대로 생성
    const date = new Date(2026, 0, 18, 15, 45, 30); // 월은 0부터 시작
    const formatted = formatDate(date);
    expect(formatted).toContain('2026-01-18');
  });

  it('should pad single digit months and days', () => {
    const date = new Date(2026, 0, 5, 9, 5, 3); // 2026-01-05 09:05:03
    const formatted = formatDate(date);
    expect(formatted).toBe('2026-01-05 09:05:03');
  });

  it('should handle midnight', () => {
    const date = new Date(2026, 0, 1, 0, 0, 0);
    const formatted = formatDate(date);
    expect(formatted).toBe('2026-01-01 00:00:00');
  });

  it('should handle end of day', () => {
    const date = new Date(2026, 11, 31, 23, 59, 59);
    const formatted = formatDate(date);
    expect(formatted).toBe('2026-12-31 23:59:59');
  });
});
