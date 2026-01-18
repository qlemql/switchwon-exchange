// Currency types
export type Currency = 'KRW' | 'USD' | 'JPY';

export type CurrencySymbol = {
  [K in Currency]: string;
};

// Error types
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR'
  | 'WALLET_INSUFFICIENT_BALANCE'
  | 'EXCHANGE_RATE_MISMATCH'
  | 'CURRENCY_MISMATCH'
  | 'NETWORK_ERROR';

export interface ApiError extends Error {
  code?: ErrorCode;
  status?: number;
}

// Re-export all domain types
export * from './auth.types';
export * from './exchange.types';
export * from './wallet.types';
export * from './order.types';
