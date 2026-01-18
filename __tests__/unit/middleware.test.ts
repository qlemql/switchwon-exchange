import { describe, it, expect, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';

describe('middleware', () => {
  it('should allow access to public routes without token', () => {
    const request = new NextRequest('http://localhost:3000/login');
    const response = middleware(request);

    expect(response).toBeDefined();
  });

  it('should redirect to login when accessing protected route without token', () => {
    const request = new NextRequest('http://localhost:3000/exchange');
    const response = middleware(request);

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain('/login');
  });

  it('should allow access to protected route with token', () => {
    const request = new NextRequest('http://localhost:3000/exchange');
    request.cookies.set('token', 'mock-token');
    const response = middleware(request);

    expect(response?.status).not.toBe(307);
  });

  it('should redirect to exchange when accessing login with token', () => {
    const request = new NextRequest('http://localhost:3000/login');
    request.cookies.set('token', 'mock-token');
    const response = middleware(request);

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain('/exchange');
  });

  it('should allow access to history route with token', () => {
    const request = new NextRequest('http://localhost:3000/history');
    request.cookies.set('token', 'mock-token');
    const response = middleware(request);

    expect(response?.status).not.toBe(307);
  });

  it('should redirect to login when accessing history without token', () => {
    const request = new NextRequest('http://localhost:3000/history');
    const response = middleware(request);

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toContain('/login');
  });

  it('should allow access to root path', () => {
    const request = new NextRequest('http://localhost:3000/');
    const response = middleware(request);

    expect(response).toBeDefined();
  });
});
