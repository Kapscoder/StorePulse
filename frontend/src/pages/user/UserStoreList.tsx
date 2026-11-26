import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SortableTable, { Column, SortOrder } from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

interface Store {
  id: string;
  name: string;
  address: string;
  email: string;
  overallRating: number | null;
  userRating: number | null;
}

const UserStoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ key: 'name', order: 'asc' as SortOrder });
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [ratingInput, setRatingInput] = useState<Record<string, number>>({});
  const limit = 10;

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy: sort.key, sortOrder: sort.order, page: String(page), limit: String(limit) });
      if (filters.name) params.set('name', filters.name);
      if (filters.address) params.set('address', filters.address);
      const res = await api.get(`/stores?${params}`);
      setStores(res.data.stores);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRate = async (storeId: string, hasRated: boolean) => {
    const rating = ratingInput[storeId];
    if (!rating) { toast.error('Please select a star rating'); return; }
    setSubmitting(storeId);
    try {
      if (hasRated) {
        await api.put(`/ratings/${storeId}`, { rating });
        toast.success('Rating updated!');
      } else {
        await api.post('/ratings', { storeId, rating });
        toast.success('Rating submitted!');
      }
      fetchStores();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setSubmitting(null);
    }
  };

  const columns: Column<Store>[] = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'overallRating', label: 'Overall Rating', render: (s) =>
        s.overallRating !== null ? (
          <div className="flex items-center gap-1">
            <StarRating value={Math.round(s.overallRating)} readOnly size="sm" />
            <span className="text-xs text-gray-600">{s.overallRating.toFixed(1)}</span>
          </div>
        ) : <span className="text-gray-400 text-xs">No ratings</span>,
    },
    {
      key: 'userRating', label: 'Your Rating', render: (s) => (
        <div className="flex items-center gap-2">
          <StarRating
            value={ratingInput[s.id] ?? s.userRating}
            onChange={(val) => setRatingInput((p) => ({ ...p, [s.id]: val }))}
            size="sm"
          />
          <button
            onClick={() => handleRate(s.id, s.userRating !== null)}
            disabled={submitting === s.id}
            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 ml-1"
          >
            {s.userRating !== null ? 'Update' : 'Submit'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Browse Stores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input placeholder="Search by name" value={filters.name}
          onChange={(e) => { setFilters((p) => ({ ...p, name: e.target.value })); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
        <input placeholder="Search by address" value={filters.address}
          onChange={(e) => { setFilters((p) => ({ ...p, address: e.target.value })); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none" />
      </div>
      {loading ? <div className="text-center text-gray-400 py-10">Loading...</div> : (
        <SortableTable columns={columns} data={stores} onSort={(key, order) => setSort({ key, order })} sortKey={sort.key} sortOrder={sort.order} />
      )}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{total} stores</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
          <span className="px-2 py-1">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserStoreList;
