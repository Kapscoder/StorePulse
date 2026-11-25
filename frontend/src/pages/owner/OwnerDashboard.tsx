import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';
import SortableTable, { Column, SortOrder } from '../../components/SortableTable';

interface Rater {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  ratedAt: string;
}

interface DashboardData {
  store: { id: string; name: string; email: string; address: string };
  averageRating: number | null;
  totalRatings: number;
  raters: Rater[];
}

const OwnerDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ key: 'userName', order: 'asc' as SortOrder });

  useEffect(() => {
    api.get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;
  if (!data) return <div className="text-center mt-20 text-red-400">Failed to load dashboard</div>;

  const sortedRaters = [...data.raters].sort((a, b) => {
    const valA = (a as any)[sort.key] ?? '';
    const valB = (b as any)[sort.key] ?? '';
    return sort.order === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
  });

  const columns: Column<Rater>[] = [
    { key: 'userName', label: 'User Name', sortable: true },
    { key: 'userEmail', label: 'Email', sortable: true },
    {
      key: 'rating', label: 'Rating', sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1">
          <StarRating value={Math.round(r.rating)} readOnly size="sm" />
          <span className="text-xs text-gray-600">{r.rating.toFixed(1)}</span>
        </div>
      ),
    },
    { key: 'ratedAt', label: 'Date', render: (r) => new Date(r.ratedAt).toLocaleDateString() },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Store Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">{data.store.name} — {data.store.address || 'No address'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow">
          <div className="text-sm opacity-80 mb-2">Average Rating</div>
          {data.averageRating !== null ? (
            <>
              <div className="text-4xl font-bold mb-1">{data.averageRating.toFixed(1)}</div>
              <StarRating value={Math.round(data.averageRating)} readOnly size="md" />
            </>
          ) : (
            <div className="text-xl opacity-70">No ratings yet</div>
          )}
        </div>
        <div className="bg-amber-500 text-white rounded-2xl p-6 shadow">
          <div className="text-sm opacity-80 mb-2">Total Ratings</div>
          <div className="text-4xl font-bold">{data.totalRatings}</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Users Who Rated Your Store</h2>
      <SortableTable
        columns={columns}
        data={sortedRaters.map((r, i) => ({ ...r, id: r.userId + i }))}
        onSort={(key, order) => setSort({ key, order })}
        sortKey={sort.key}
        sortOrder={sort.order}
      />
    </div>
  );
};

export default OwnerDashboard;
