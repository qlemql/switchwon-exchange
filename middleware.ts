/**
 * Next.js Middleware - 라우트 보호 및 인증 체크
 * @description httpOnly cookies를 사용한 인증 확인
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 라우트 (로그인 필요)
const protectedRoutes = ['/exchange', '/history'];

// 인증된 사용자가 접근하면 안 되는 라우트
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // httpOnly cookie에서 토큰 확인
  const token = request.cookies.get('token')?.value;

  // 보호된 라우트 체크
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 인증 라우트 체크
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. 보호된 라우트에 토큰 없이 접근 시 -> 로그인으로 리다이렉트
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. 로그인 페이지에 토큰 있는 상태로 접근 시 -> 환전 페이지로 리다이렉트
  if (isAuthRoute && token) {
    const exchangeUrl = new URL('/exchange', request.url);
    return NextResponse.redirect(exchangeUrl);
  }

  // 3. 정상적인 경우 그대로 진행
  return NextResponse.next();
}

// Middleware 적용 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 middleware 적용:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
