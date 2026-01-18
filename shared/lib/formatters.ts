import type { Currency, CurrencySymbol } from '@/shared/types';

const CURRENCY_SYMBOLS: CurrencySymbol = {
  KRW: '₩',
  USD: '$',
  JPY: '¥',
};

const CURRENCY_DECIMALS: Record<Currency, number> = {
  KRW: 0,
  USD: 2,
  JPY: 0,
};

/**
 * 통화 금액을 포맷팅합니다.
 * @param amount - 숫자 금액
 * @param currency - 통화 코드 (KRW, USD, JPY)
 * @returns 포맷팅된 문자열 (예: "₩1,000,000")
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
  const decimals = CURRENCY_DECIMALS[currency];
  const symbol = CURRENCY_SYMBOLS[currency];

  // 반올림
  const roundedAmount = Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);

  // 음수 처리
  const isNegative = roundedAmount < 0;
  const absoluteAmount = Math.abs(roundedAmount);

  // 숫자 포맷팅
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absoluteAmount);

  // 심볼 추가
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};

/**
 * 날짜를 YYYY-MM-DD HH:mm:ss 형식으로 포맷팅합니다.
 * @param date - ISO string 또는 Date 객체
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
