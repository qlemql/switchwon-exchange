'use client';

import { ExchangeForm } from '@/features/exchange/ui/ExchangeForm';
import { ExchangeRateCard } from '@/features/exchange/ui/ExchangeRateCard';
import { WalletCard } from '@/features/exchange/ui/WalletCard';
import { useExchangeRates } from '@/features/exchange/hooks/useExchangeRates';
import { useWallets } from '@/features/exchange/hooks/useWallets';

export default function ExchangePage() {
  const { data: rates, isLoading: ratesLoading } = useExchangeRates();
  const { data: wallets, isLoading: walletsLoading } = useWallets();

  // Calculate total assets in KRW
  const totalAssets = wallets?.reduce((total, wallet) => {
    if (wallet.currency === 'KRW') {
      return total + wallet.balance;
    }
    const rate = rates?.find(r => r.currency === wallet.currency);
    return total + (wallet.balance * (rate?.rate || 0));
  }, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 환율 정보 + 내 지갑 */}
          <div className="space-y-6">
            {/* 환율 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">환율 정보</h2>
              <p className="text-sm text-gray-600 mb-4">
                실시간 환율을 확인하고 간편하게 환전하세요.
              </p>
            {ratesLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {rates
                  ?.sort((a, b) => {
                    const order = ['USD', 'JPY'];
                    return order.indexOf(a.currency) - order.indexOf(b.currency);
                  })
                  .map((rate) => (
                    <ExchangeRateCard key={rate.exchangeRateId} rate={rate} />
                  ))}
              </div>
            )}
          </div>

          {/* 내 지갑 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">내 지갑</h2>
            {walletsLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <div className="bg-white rounded-lg p-4 space-y-3">
                {wallets?.map((wallet) => (
                  <div key={wallet.currency} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{wallet.currency}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {wallet.currency === 'KRW'
                        ? `₩ ${wallet.balance.toLocaleString()}`
                        : `$ ${wallet.balance.toLocaleString()}`}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-600">총 보유 자산</span>
                    <span className="text-sm font-bold text-blue-600">
                      ₩ {totalAssets.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 환전 폼 */}
        <div>
          <ExchangeForm />
        </div>
      </div>
    </div>
  );
}
