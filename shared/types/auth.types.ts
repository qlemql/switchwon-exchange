/**
 * 인증 관련 타입 정의
 */

// 로그인 요청
export interface LoginRequest {
  email: string;
}

// 로그인 응답 (백엔드 API 응답 형식)
export interface LoginResponse {
  code: string;
  message: string;
  data: {
    memberId: number;
    token: string;
  };
}

// 사용자 정보
export interface User {
  id: number;
  email: string;
  name?: string;
}

// 인증 상태
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
