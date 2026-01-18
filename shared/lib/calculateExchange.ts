/**
 * 환전 계산 유틸리티 함수
 * @description 주어진 금액과 환율을 기반으로 받을 금액을 계산합니다.
 */

/**
 * 환전 시 받을 금액을 계산합니다.
 * @param amount - 환전할 금액
 * @param rate - 환율 (1단위당 가격)
 * @returns 환전 후 받을 금액 (소수점 이하 반올림)
 * @example
 * // 100 USD를 KRW로 환전 (환율: 1 USD = 1320.50 KRW)
 * calculateReceiveAmount(100, 1320.50) // 132050
 *
 * // 132050 KRW를 USD로 환전 (환율: 1 USD = 1320.50 KRW)
 * calculateReceiveAmount(132050, 1320.50) // 100
 */
export const calculateReceiveAmount = (
  amount: number,
  rate: number
): number => {
  if (amount === 0) {
    return 0;
  }

  // 금액과 환율을 곱하여 환전 금액 계산
  const result = amount * rate;

  // 소수점 처리: 0.01 단위로 반올림 (소수점 2자리까지)
  // JavaScript의 부동소수점 정밀도 문제를 해결하기 위해 Math.round 사용
  return Math.round(result * 100) / 100;
};
