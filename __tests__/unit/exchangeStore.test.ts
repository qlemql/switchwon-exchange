import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExchangeStore } from '@/features/exchange/store/exchangeStore';

describe('useExchangeStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    const { result } = renderHook(() => useExchangeStore());
    act(() => {
      result.current.reset();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useExchangeStore());

    expect(result.current.fromCurrency).toBe('KRW');
    expect(result.current.toCurrency).toBe('USD');
    expect(result.current.tab).toBe('receive'); // '받을금액' 탭
  });

  it('should set fromCurrency', () => {
    const { result } = renderHook(() => useExchangeStore());

    act(() => {
      result.current.setFromCurrency('USD');
    });

    expect(result.current.fromCurrency).toBe('USD');
  });

  it('should set toCurrency', () => {
    const { result } = renderHook(() => useExchangeStore());

    act(() => {
      result.current.setToCurrency('JPY');
    });

    expect(result.current.toCurrency).toBe('JPY');
  });

  it('should swap currencies', () => {
    const { result } = renderHook(() => useExchangeStore());

    // 초기 상태: KRW -> USD
    expect(result.current.fromCurrency).toBe('KRW');
    expect(result.current.toCurrency).toBe('USD');

    act(() => {
      result.current.swapCurrencies();
    });

    // 스왑 후: USD -> KRW
    expect(result.current.fromCurrency).toBe('USD');
    expect(result.current.toCurrency).toBe('KRW');
  });

  it('should set tab', () => {
    const { result } = renderHook(() => useExchangeStore());

    act(() => {
      result.current.setTab('send');
    });

    expect(result.current.tab).toBe('send');
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() => useExchangeStore());

    // 상태 변경
    act(() => {
      result.current.setFromCurrency('JPY');
      result.current.setToCurrency('KRW');
      result.current.setTab('send');
    });

    // 변경 확인
    expect(result.current.fromCurrency).toBe('JPY');
    expect(result.current.toCurrency).toBe('KRW');
    expect(result.current.tab).toBe('send');

    // 리셋
    act(() => {
      result.current.reset();
    });

    // 초기 상태로 복구 확인
    expect(result.current.fromCurrency).toBe('KRW');
    expect(result.current.toCurrency).toBe('USD');
    expect(result.current.tab).toBe('receive');
  });
});
