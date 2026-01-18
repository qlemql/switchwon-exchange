import type { Currency } from '@/shared/types';

export interface Order {
  orderId: number;
  fromCurrency: Currency;
  fromAmount: number;
  toCurrency: Currency;
  toAmount: number;
  appliedRate: number;
  orderedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrdersParams {
  page: number;
  limit: number;
}
