/**
 * 지갑 관련 타입 정의
 */

import { Currency } from './index';

// 지갑 정보 (백엔드 API 응답 형식)
export interface Wallet {
  walletId: number;
  currency: Currency;
  balance: number;
}

// 지갑 잔액
export interface WalletBalance {
  currency: Currency;
  balance: number;
}

// 지갑 목록 응답
export interface WalletsResponse {
  wallets: Wallet[];
  totalAssets: {
    [K in Currency]?: number;
  };
}
