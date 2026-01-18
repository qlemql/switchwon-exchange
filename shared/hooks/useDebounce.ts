/**
 * useDebounce Hook
 * @description 값의 변경을 지연시켜 불필요한 API 호출을 방지
 * @example
 * const debouncedAmount = useDebounce(amount, 300);
 */

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 값 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: 다음 effect 실행 전 또는 unmount 시 타이머 제거
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
