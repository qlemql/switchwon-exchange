/**
 * 환율 관련 타입 정의
 */

import { Currency } from './index';

// 환율 정보 (백엔드 API 응답 형식)
export interface ExchangeRate {
  exchangeRateId: number;
  currency: Currency;
  rate: number;
  changePercentage: number;
  applyDateTime: string; // ISO 8601 format
}

// 환율 목록 응답
export interface ExchangeRatesResponse {
  rates: {
    [K in Currency]?: number;
  };
  baseDate: string; // 기준일시
}

// 환율 변동 정보
export interface RateChange {
  currency: Currency;
  currentRate: number;
  previousRate: number;
  changePercent: number; // 변동률 (%)
  direction: 'up' | 'down' | 'stable';
}
