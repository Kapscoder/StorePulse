import React, { useState } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string, order: SortOrder) => void;
  sortKey?: string;
  sortOrder?: SortOrder;
}

function SortableTable<T extends { id: string }>({ columns, data, onSort, sortKey, sortOrder }: Props<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    const newOrder: SortOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(key, newOrder);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left font-semibold text-gray-600 ${col.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                {col.label}
                {col.sortable && sortKey === String(col.key) && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SortableTable;
