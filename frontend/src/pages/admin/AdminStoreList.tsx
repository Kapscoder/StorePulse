import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SortableTable, { Column, SortOrder } from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number | null;
  owner: { name: string; email: string } | null;
}

const AdminStoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ key: 'name', order: 'asc' as SortOrder });
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: sort.key, sortOrder: sort.order, page: String(page), limit: String(limit) });
      if (filters.name) params.set('name', filters.name);
      if (filters.email) params.set('email', filters.email);
      if (filters.address) params.set('address', filters.address);
      const res = await api.get(`/admin/stores?${params}`);
      setStores(res.data.stores);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const columns: Column<Store>[] = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'averageRating', label: 'Rating', render: (s) =>
        s.averageRating !== null ? (
          <div className="flex items-center gap-1">
            <StarRating value={Math.round(s.averageRating)} readOnly size="sm" />
            <span className="text-xs text-gray-600">{s.averageRating.toFixed(1)}</span>
          </div>
        ) : <span className="text-gray-400 text-xs">No ratings</span>,
    },
    { key: 'owner', label: 'Owner', render: (s) => s.owner ? `${s.owner.name}` : '—' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stores</h1>
        <Link to="/admin/stores/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
          + Add Store
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {(['name', 'email', 'address'] as const).map((f) => (
          <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={filters[f]}
            onChange={(e) => { setFilters((p) => ({ ...p, [f]: e.target.value })); setPage(1); }}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
        ))}
      </div>
      {loading ? <div className="text-center text-gray-400 py-10">Loading...</div> : (
        <SortableTable columns={columns} data={stores} onSort={(key, order) => setSort({ key, order })} sortKey={sort.key} sortOrder={sort.order} />
      )}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{total} total stores</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
          <span className="px-2 py-1">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreList;
