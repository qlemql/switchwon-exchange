/**
 * MSW 핸들러 - 인증 API
 */

import { http, HttpResponse } from 'msw';

export const authHandlers = [
  // POST /api/auth/login - 로그인 성공
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string };

    // 유효한 이메일이면 성공
    if (body.email && body.email.includes('@')) {
      return HttpResponse.json(
        {
          success: true,
          message: '로그인 성공',
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
        success: false,
        message: '유효한 이메일 주소를 입력해주세요',
      },
      { status: 400 }
    );
  }),

  // POST /api/auth/logout - 로그아웃
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
];
