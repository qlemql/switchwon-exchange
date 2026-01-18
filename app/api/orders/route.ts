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
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders?page=${page}&limit=${limit}`,
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

    // 백엔드 응답 형식: { code, message, data: Order[] }
    // 프론트엔드는 { orders: Order[], total, page, limit } 형식 기대
    const orders = result.data || [];
    return NextResponse.json({
      orders,
      total: orders.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
