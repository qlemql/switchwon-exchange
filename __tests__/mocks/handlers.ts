import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'https://exchange-example.switchflow.biz';

export const handlers = [
  // Next.js API Routes - Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string };

    // 유효한 이메일이면 성공
    if (body.email && body.email.includes('@')) {
      return HttpResponse.json(
        {
          code: 'OK',
          message: '정상적으로 처리되었습니다.',
          data: {
            memberId: 1,
            token: 'mock-jwt-token',
          },
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': 'token=mock-jwt-token; HttpOnly; Path=/; SameSite=Strict',
          },
        }
      );
    }

    // 이메일이 없거나 잘못된 형식이면 실패
    return HttpResponse.json(
      {
        code: 'VALIDATION_ERROR',
        message: '유효한 이메일 주소를 입력해주세요',
        data: {},
      },
      { status: 400 }
    );
  }),

  // Next.js API Routes - Logout
  http.post('/api/auth/logout', () => {
    return HttpResponse.json(
      {
        success: true,
        message: '로그아웃 성공',
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0',
        },
      }
    );
  }),

  // External API - Login (query parameter로 email 받음)
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_ERROR',
          message: '요청 데이터가 이상해요.',
          data: {},
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      code: 'OK',
      message: '정상적으로 처리되었습니다.',
      data: {
        memberId: 1,
        token: 'mock-jwt-token',
      },
    });
  }),

  // Exchange Rates
  http.get(`${API_BASE_URL}/exchange-rates/latest`, () => {
    return HttpResponse.json({
      code: 'OK',
      message: '정상적으로 처리되었습니다.',
      data: [
        {
          exchangeRateId: 1,
          currency: 'USD',
          rate: 1320.50,
          changePercentage: 0.42,
          applyDateTime: new Date().toISOString(),
        },
        {
          exchangeRateId: 2,
          currency: 'JPY',
          rate: 9.15,
          changePercentage: 0.55,
          applyDateTime: new Date().toISOString(),
        },
      ],
    });
  }),

  // Wallets
  http.get(`${API_BASE_URL}/wallets`, () => {
    return HttpResponse.json({
      code: 'OK',
      message: '정상적으로 처리되었습니다.',
      data: {
        totalKrwBalance: 1000000,
        wallets: [
          { walletId: 1, currency: 'KRW', balance: 1000000 },
          { walletId: 2, currency: 'USD', balance: 0 },
          { walletId: 3, currency: 'JPY', balance: 0 },
        ],
      },
    });
  }),

  // Quote
  http.get(`${API_BASE_URL}/orders/quote`, ({ request }) => {
    const url = new URL(request.url);
    const fromCurrency = url.searchParams.get('fromCurrency');
    const toCurrency = url.searchParams.get('toCurrency');
    const forexAmount = url.searchParams.get('forexAmount');

    const rate = toCurrency === 'USD' ? 1320.50 : 9.15;
    const amount = parseFloat(forexAmount || '0');

    // 백엔드 응답 형식: { code, message, data: { krwAmount, appliedRate } }
    return HttpResponse.json({
      code: 'OK',
      message: '정상적으로 처리되었습니다.',
      data: {
        krwAmount: fromCurrency === 'KRW' ? amount : Math.floor(amount * rate),
        appliedRate: rate,
      },
    });
  }),

  // Create Order
  http.post(`${API_BASE_URL}/orders`, async ({ request }) => {
    const body = await request.json() as {
      exchangeRateId: number;
      fromCurrency: string;
      toCurrency: string;
      forexAmount: number;
    };

    // 백엔드 응답 형식: { code, message, data: null }
    return HttpResponse.json({
      code: 'OK',
      message: '정상적으로 처리되었습니다.',
      data: null,
    });
  }),

  // Orders History
  http.get(`${API_BASE_URL}/orders`, () => {
    return HttpResponse.json({
      code: 'OK',
      message: '정상적으로 처리되었습니다.',
      data: [
        {
          orderId: 1,
          fromCurrency: 'KRW',
          fromAmount: 132050,
          toCurrency: 'USD',
          toAmount: 100,
          appliedRate: 1320.50,
          orderedAt: '2026-01-18T08:00:00Z',
        },
      ],
    });
  }),
];
