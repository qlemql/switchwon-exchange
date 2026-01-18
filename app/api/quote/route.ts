import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Query parameters 추출
    const searchParams = request.nextUrl.searchParams;
    const fromCurrency = searchParams.get('fromCurrency');
    const toCurrency = searchParams.get('toCurrency');
    const forexAmount = searchParams.get('forexAmount');

    if (!fromCurrency || !toCurrency || !forexAmount) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: '필수 파라미터가 누락되었습니다.', data: {} },
        { status: 400 }
      );
    }

    // 백엔드 API 호출 (GET with query parameters)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/quote?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&forexAmount=${forexAmount}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    // 백엔드 응답 형식: { code, message, data: { krwAmount, appliedRate } }
    return NextResponse.json(result.data || result);
  } catch (error: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: error.message || 'Failed to get quote', data: {} },
      { status: 500 }
    );
  }
}
