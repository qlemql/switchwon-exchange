import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/shared/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    expect(result.current).toBe('first');

    // 값 변경
    rerender({ value: 'second' });

    // 즉시는 변경되지 않음
    expect(result.current).toBe('first');

    // 300ms 후 변경됨
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('second');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    // 첫 번째 변경
    rerender({ value: 'second' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 두 번째 변경 (타이머 리셋)
    rerender({ value: 'third' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 세 번째 변경 (타이머 리셋)
    rerender({ value: 'fourth' });

    // 아직 변경 안 됨
    expect(result.current).toBe('first');

    // 마지막 변경 후 300ms 경과
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('fourth');
  });

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    );

    expect(result.current).toBe(0);

    rerender({ value: 100 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(100);
  });

  it('should cleanup timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('test', 300));

    // unmount 시 타이머 정리 확인
    unmount();

    // 에러 없이 정상 종료되어야 함
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should work with custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    rerender({ value: 'second', delay: 500 });

    // 300ms 후에는 아직 변경 안 됨
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('first');

    // 500ms 후에는 변경됨
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('second');
  });
});
