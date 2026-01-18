import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 쿠키 삭제
    const res = NextResponse.json({ message: 'Logged out successfully' });
    res.cookies.delete('token');

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
