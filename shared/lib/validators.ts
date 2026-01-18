import { z } from 'zod';

// Email validation
export const emailSchema = z.object({
  email: z.string().trim().email('유효한 이메일 주소를 입력해주세요'),
});

export type EmailInput = z.infer<typeof emailSchema>;

// Amount validation (positive numbers only)
export const amountSchema = z
  .number()
  .positive('금액은 0보다 커야 합니다')
  .finite('유효한 숫자를 입력해주세요');

// Currency validation
const currencyEnum = z.enum(['KRW', 'USD', 'JPY'], {
  errorMap: () => ({ message: '지원되지 않는 통화입니다' }),
});

// Quote request validation
export const quoteRequestSchema = z
  .object({
    fromCurrency: currencyEnum,
    toCurrency: currencyEnum,
    forexAmount: amountSchema,
  })
  .refine((data) => data.fromCurrency !== data.toCurrency, {
    message: '출발 통화와 도착 통화는 달라야 합니다',
    path: ['toCurrency'],
  });

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

// Order request validation
export const orderRequestSchema = z
  .object({
    exchangeRateId: z.number().int().positive('유효한 환율 ID가 필요합니다'),
    fromCurrency: currencyEnum,
    toCurrency: currencyEnum,
    forexAmount: amountSchema,
  })
  .refine((data) => data.fromCurrency !== data.toCurrency, {
    message: '출발 통화와 도착 통화는 달라야 합니다',
    path: ['toCurrency'],
  });

export type OrderRequest = z.infer<typeof orderRequestSchema>;

// Wallet balance validation
export const walletBalanceSchema = z.object({
  currency: currencyEnum,
  balance: z.number().nonnegative('잔액은 음수가 될 수 없습니다'),
});

export type WalletBalance = z.infer<typeof walletBalanceSchema>;
