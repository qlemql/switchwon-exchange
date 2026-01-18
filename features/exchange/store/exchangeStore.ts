/**
 * 환전 페이지 UI 상태 관리 (Zustand)
 * @description 통화 선택, 탭 상태 등 클라이언트 전용 UI 상태
 */

import { create } from 'zustand';
import { Currency } from '@/shared/types';

// 탭 타입 정의
export type ExchangeTab = 'receive' | 'send';

interface ExchangeState {
  // 상태
  fromCurrency: Currency;
  toCurrency: Currency;
  tab: ExchangeTab;

  // 액션
  setFromCurrency: (currency: Currency) => void;
  setToCurrency: (currency: Currency) => void;
  swapCurrencies: () => void;
  setTab: (tab: ExchangeTab) => void;
  reset: () => void;
}

// 초기 상태
const initialState = {
  fromCurrency: 'KRW' as Currency,
  toCurrency: 'USD' as Currency,
  tab: 'receive' as ExchangeTab,
};

export const useExchangeStore = create<ExchangeState>((set) => ({
  // 초기 상태
  ...initialState,

  // 액션
  setFromCurrency: (currency) =>
    set({ fromCurrency: currency }),

  setToCurrency: (currency) =>
    set({ toCurrency: currency }),

  swapCurrencies: () =>
    set((state) => ({
      fromCurrency: state.toCurrency,
      toCurrency: state.fromCurrency,
    })),

  setTab: (tab) =>
    set({ tab }),

  reset: () =>
    set(initialState),
}));
