import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: '이메일이 필요합니다.', data: {} },
        { status: 400 }
      );
    }

    // 백엔드 API 호출 (email을 query parameter로 전송)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // httpOnly 쿠키 설정
    const res = NextResponse.json(data);

    // 백엔드 응답 형식: { code, message, data: { memberId, token } }
    if (data.data?.token) {
      res.cookies.set('token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      });
    }

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: error.message || 'Login failed', data: {} },
      { status: 500 }
    );
  }
}
