'use client';

import { useState } from 'react';
import { useOrders } from '@/features/history/hooks/useOrders';
import { TransactionTable } from '@/features/history/ui/TransactionTable';
import { Pagination } from '@/features/history/ui/Pagination';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useOrders({ page, limit });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">환전 내역</h1>
          <p className="mt-2 text-sm text-gray-600">
            환전 내역을 확인할 수 있습니다.
          </p>
        </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          환전 내역을 불러오는데 실패했습니다
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <TransactionTable
          orders={data?.orders || []}
          isLoading={isLoading}
        />
        {data && data.total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
