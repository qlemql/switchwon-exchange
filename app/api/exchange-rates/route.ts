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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/exchange-rates/latest`,
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

    // 백엔드 응답 형식: { data: [...] }
    // 프론트엔드 형식: [...]
    return NextResponse.json(result.data || result);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}
