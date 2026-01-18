import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/shared/api/apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create axios instance with correct base URL', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults.baseURL).toBe('/api');
  });

  it('should set correct default headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe(
      'application/json'
    );
  });

  it('should set timeout to 10 seconds', () => {
    expect(apiClient.defaults.timeout).toBe(10000);
  });

  it('should enable withCredentials for cookies', () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });

  it('should have request interceptor configured', () => {
    expect(apiClient.interceptors.request).toBeDefined();
    expect(apiClient.interceptors.request.handlers.length).toBeGreaterThan(0);
  });

  it('should have response interceptor configured', () => {
    expect(apiClient.interceptors.response).toBeDefined();
    expect(apiClient.interceptors.response.handlers.length).toBeGreaterThan(0);
  });
});
