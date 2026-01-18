/**
 * ExchangeForm 컴포넌트
 * @description 환전 폼
 */

'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';
import { Input } from '@/shared/ui/ui/input';
import { Button } from '@/shared/ui/ui/button';
import { Label } from '@/shared/ui/label';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useQuote } from '@/features/exchange/hooks/useQuote';
import { useExchange } from '@/features/exchange/hooks/useExchange';
import { useExchangeRates } from '@/features/exchange/hooks/useExchangeRates';
import { formatCurrency } from '@/shared/lib/formatters';
import type { Currency } from '@/shared/types';

const FOREIGN_CURRENCIES = ['USD', 'JPY'] as const;

const getCurrencyFlag = (currency: Currency): string => {
  const flags: Record<Currency, string> = {
    KRW: '🇰🇷',
    USD: '🇺🇸',
    JPY: '🇯🇵',
  };
  return flags[currency] || '';
};

const getCurrencyLabel = (currency: Currency): string => {
  const labels: Record<Currency, string> = {
    KRW: '원화',
    USD: '달러',
    JPY: '엔화',
  };
  return labels[currency] || currency;
};

type ExchangeMode = 'buy' | 'sell';

export const ExchangeForm = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [mode, setMode] = useState<ExchangeMode>('buy');
  const [amount, setAmount] = useState<string>('');
  const queryClient = useQueryClient();

  // Debounced amount for quote fetching
  const debouncedAmount = useDebounce(parseFloat(amount) || 0, 300);

  // Exchange rates to get exchangeRateId
  const { data: rates, refetch: refetchRates } = useExchangeRates();

  // Quote fetching: always fromCurrency=selectedCurrency (외화 기준)
  // buy/sell 모두 "외화 금액"을 입력받아 필요한 원화를 계산
  const { data: quote, isSuccess: quoteSuccess } = useQuote({
    fromCurrency: selectedCurrency,
    toCurrency: 'KRW',
    forexAmount: debouncedAmount,
  });

  // Exchange mutation
  const { mutate: exchange, isPending: isExchanging } = useExchange();

  const handleExchange = async () => {
    if (!quote) return;

    // 환전 직전에 최신 환율 정보를 다시 조회
    const { data: latestRates } = await refetchRates();

    if (!latestRates) return;

    const exchangeRate = latestRates.find(r => r.currency === selectedCurrency);
    if (!exchangeRate) return;

    // buy 모드: KRW -> 외화
    // sell 모드: 외화 -> KRW
    // forexAmount는 항상 외화(USD, JPY) 금액을 의미
    const fromCurrency = mode === 'buy' ? 'KRW' : selectedCurrency;
    const toCurrency = mode === 'buy' ? selectedCurrency : 'KRW';
    const forexAmount = parseFloat(amount); // 항상 외화 금액

    exchange({
      exchangeRateId: exchangeRate.exchangeRateId,
      fromCurrency,
      toCurrency,
      forexAmount,
    });
  };

  const isValidAmount = parseFloat(amount) > 0;
  const isExchangeDisabled = !isValidAmount || !quote || isExchanging;

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      {/* Currency Selector */}
      <div>
        <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as Currency)}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <span className="flex items-center gap-2">
                {getCurrencyFlag(selectedCurrency)} {selectedCurrency} 환전하기
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FOREIGN_CURRENCIES.map((currency) => (
              <SelectItem key={currency} value={currency}>
                <span className="flex items-center gap-2">
                  {getCurrencyFlag(currency)} {getCurrencyLabel(currency)} {currency}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Buy/Sell Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          onClick={() => setMode('buy')}
          className={mode === 'buy' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
        >
          살래요
        </Button>
        <Button
          type="button"
          onClick={() => setMode('sell')}
          className={mode === 'sell' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
        >
          팔래요
        </Button>
      </div>

      {/* Mode Label */}
      <div className="text-sm text-gray-600">
        {mode === 'buy' ? '매수 금액' : '매도 금액'}
      </div>

      {/* Amount Input */}
      <div className="relative">
        <Input
          type="number"
          placeholder=""
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pr-32"
        />
        {!amount && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            30 {getCurrencyLabel(selectedCurrency)} {mode === 'buy' ? '사기' : '팔기'}
          </div>
        )}
      </div>

      {/* Arrow Icon */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          ↓
        </div>
      </div>

      {/* Received Amount Label */}
      <div className="text-sm text-gray-600">
        필요 원화
      </div>

      {/* Quote Display */}
      <div className="relative">
        <Input
          type="text"
          value={quote && quoteSuccess ? Math.floor(quote.krwAmount).toLocaleString() : ''}
          readOnly
          placeholder=""
          className="bg-gray-50 border-gray-200 pr-40"
        />
        {quoteSuccess && quote && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500">
            {Math.floor(quote.krwAmount).toLocaleString()}원 {mode === 'buy' ? '필요해요' : '받을 수 있어요'}
          </div>
        )}
      </div>

      {/* Exchange Rate Display */}
      <div className="text-right text-sm text-gray-600">
        {(() => {
          if (quoteSuccess && quote) {
            return `적용 환율: 1 ${selectedCurrency} = ${quote.appliedRate.toLocaleString()} 원`;
          }
          const currentRate = rates?.find(r => r.currency === selectedCurrency);
          if (currentRate) {
            return `적용 환율: 1 ${selectedCurrency} = ${currentRate.rate.toLocaleString()} 원`;
          }
          return '적용 환율: -';
        })()}
      </div>

      {/* Exchange Button */}
      <Button
        type="button"
        className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12"
        disabled={isExchangeDisabled}
        onClick={handleExchange}
      >
        {isExchanging ? '환전 중...' : '환전하기'}
      </Button>
    </div>
  );
};
