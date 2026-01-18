/**
 * ExchangeRateCard 컴포넌트
 * @description 환율 정보 카드
 */

import { Card, CardContent } from '@/shared/ui/card';
import type { ExchangeRate } from '@/shared/types';

interface ExchangeRateCardProps {
  rate: ExchangeRate;
}

export const ExchangeRateCard = ({ rate }: ExchangeRateCardProps) => {
  const { currency, rate: exchangeRate, changePercentage } = rate;

  // 환율 포맷팅 (천단위 콤마 + 소수점 2자리)
  const formatRate = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getCurrencyName = (currency: string): string => {
    const names: Record<string, string> = {
      USD: '미국달러',
      JPY: '일본엔화',
    };
    return names[currency] || currency;
  };

  const isPositive = changePercentage >= 0;

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{currency}</span>
            <span className="text-xs text-gray-500">{getCurrencyName(currency)}</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatRate(exchangeRate)} <span className="text-sm font-normal text-gray-500">KRW</span>
          </div>
          <div className={`text-xs ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(changePercentage).toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
