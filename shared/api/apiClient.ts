/**
 * Axios 기반 API 클라이언트
 * @description httpOnly cookies를 사용한 인증 방식
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiError } from '@/shared/types';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // httpOnly cookies를 위한 설정
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청이 전송되기 전 처리
    // httpOnly cookies는 브라우저가 자동으로 전송하므로 별도 처리 불필요
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답 처리
    return response;
  },
  (error: AxiosError) => {
    // 에러 응답 처리
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - 인증 실패
      if (status === 401) {
        // 클라이언트 사이드에서만 리다이렉트
        if (typeof window !== 'undefined') {
          // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }

      // API 에러 객체 생성
      const apiError: ApiError = new Error(
        (data as any)?.message || '요청 처리 중 오류가 발생했습니다'
      );
      apiError.status = status;
      apiError.code = (data as any)?.code;

      return Promise.reject(apiError);
    }

    // 네트워크 에러 또는 타임아웃
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      const networkError: ApiError = new Error(
        error.message || '네트워크 연결을 확인해주세요'
      );
      networkError.code = 'NETWORK_ERROR';
      return Promise.reject(networkError);
    }

    // 기타 에러
    return Promise.reject(error);
  }
);

// API 호출 헬퍼 함수들
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),
};
