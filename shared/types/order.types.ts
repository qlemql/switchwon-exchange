/**
 * 주문(환전) 관련 타입 정의
 */

import { Currency } from './index';

// 환전 견적 요청
export interface QuoteRequest {
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number; // 환전할 금액
}

// 환전 견적 응답
export interface QuoteResponse {
  exchangeRateId: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number;
  receiveAmount: number; // 받을 금액
  rate: number; // 적용된 환율
  expiresAt: string; // 견적 만료 시간 (ISO 8601)
}

// 환전 주문 요청
export interface OrderRequest {
  exchangeRateId: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number;
}

// 환전 주문 응답
export interface OrderResponse {
  success: boolean;
  order: Order;
  message: string;
}

// 주문 상태
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

// 주문 정보
export interface Order {
  id: number;
  userId: number;
  exchangeRateId: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  forexAmount: number;
  receiveAmount: number;
  rate: number;
  status: OrderStatus;
  createdAt: string;
  completedAt?: string;
}

// 주문 목록 요청 (페이지네이션)
export interface OrdersRequest {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

// 주문 목록 응답
export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
