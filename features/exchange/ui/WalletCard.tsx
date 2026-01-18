/**
 * WalletCard 컴포넌트
 * @description 지갑 잔액 카드
 */

import { Card, CardContent } from '@/shared/ui/card';
import { formatCurrency } from '@/shared/lib/formatters';
import type { Wallet } from '@/shared/types';

interface WalletCardProps {
  wallet: Wallet;
}

export const WalletCard = ({ wallet }: WalletCardProps) => {
  const { currency, balance } = wallet;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium text-gray-600">{currency}</div>
          <div className="text-2xl font-bold">
            {formatCurrency(balance, currency)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
