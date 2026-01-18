'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/features/auth/hooks/useLogout';

export const Navigation = () => {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // 로그인 페이지에서는 네비게이션 숨기기
  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              🔄 Exchange app
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/exchange"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/exchange')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              환전 하기
            </Link>
            <Link
              href="/history"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/history')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              환전 내역
            </Link>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
