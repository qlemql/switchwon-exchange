import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  amountSchema,
  quoteRequestSchema,
  orderRequestSchema,
} from '@/shared/lib/validators';

describe('emailSchema', () => {
  it('should validate correct email', () => {
    const result = emailSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });

  it('should validate email with subdomain', () => {
    const result = emailSchema.safeParse({ email: 'user@mail.example.com' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = emailSchema.safeParse({ email: 'invalid-email' });
    expect(result.success).toBe(false);
  });

  it('should reject email without @', () => {
    const result = emailSchema.safeParse({ email: 'invalid.com' });
    expect(result.success).toBe(false);
  });

  it('should reject empty email', () => {
    const result = emailSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('should trim whitespace', () => {
    const result = emailSchema.safeParse({ email: '  test@example.com  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
});

describe('amountSchema', () => {
  it('should validate positive number', () => {
    const result = amountSchema.safeParse(1000);
    expect(result.success).toBe(true);
  });

  it('should validate decimal number', () => {
    const result = amountSchema.safeParse(100.50);
    expect(result.success).toBe(true);
  });

  it('should reject zero', () => {
    const result = amountSchema.safeParse(0);
    expect(result.success).toBe(false);
  });

  it('should reject negative number', () => {
    const result = amountSchema.safeParse(-100);
    expect(result.success).toBe(false);
  });

  it('should reject non-number', () => {
    const result = amountSchema.safeParse('100');
    expect(result.success).toBe(false);
  });
});

describe('quoteRequestSchema', () => {
  it('should validate correct quote request', () => {
    const result = quoteRequestSchema.safeParse({
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid currency', () => {
    const result = quoteRequestSchema.safeParse({
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      forexAmount: 1000,
    });
    expect(result.success).toBe(false);
  });

  it('should reject same from and to currency', () => {
    const result = quoteRequestSchema.safeParse({
      fromCurrency: 'USD',
      toCurrency: 'USD',
      forexAmount: 1000,
    });
    expect(result.success).toBe(false);
  });

  it('should reject zero amount', () => {
    const result = quoteRequestSchema.safeParse({
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative amount', () => {
    const result = quoteRequestSchema.safeParse({
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: -1000,
    });
    expect(result.success).toBe(false);
  });
});

describe('orderRequestSchema', () => {
  it('should validate correct order request', () => {
    const result = orderRequestSchema.safeParse({
      exchangeRateId: 1,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing exchangeRateId', () => {
    const result = orderRequestSchema.safeParse({
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-positive exchangeRateId', () => {
    const result = orderRequestSchema.safeParse({
      exchangeRateId: 0,
      fromCurrency: 'KRW',
      toCurrency: 'USD',
      forexAmount: 132050,
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid currency combination', () => {
    const result = orderRequestSchema.safeParse({
      exchangeRateId: 1,
      fromCurrency: 'USD',
      toCurrency: 'USD',
      forexAmount: 1000,
    });
    expect(result.success).toBe(false);
  });
});
