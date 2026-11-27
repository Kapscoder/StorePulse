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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-24 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (!data) return <div className="text-center mt-20 text-rose-500">Failed to load dashboard</div>;

  const sortedRaters = [...data.raters].sort((a, b) => {
    const valA = (a as any)[sort.key] ?? '';
    const valB = (b as any)[sort.key] ?? '';
    if (sort.key === 'rating') {
      return sort.order === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    }
    return sort.order === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const columns: Column<Rater>[] = [
    { key: 'userName', label: 'Customer Name', sortable: true },
    { key: 'userEmail', label: 'Email', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <StarRating value={Math.round(r.rating)} readOnly size="sm" />
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
            {r.rating.toFixed(1)}
          </span>
        </div>
      ),
    },
    { key: 'ratedAt', label: 'Submitted On', render: (r) => new Date(r.ratedAt).toLocaleDateString() },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Store Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Store Owner Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">{data.store.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {data.store.email} • {data.store.address || 'No address provided'}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-3">
            Average Store Rating
          </div>
          {data.averageRating !== null ? (
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold tracking-tight">
                  {data.averageRating.toFixed(1)}
                  <span className="text-lg font-normal text-indigo-200"> / 5.0</span>
                </div>
                <div className="mt-2">
                  <StarRating value={Math.round(data.averageRating)} readOnly size="md" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-lg text-indigo-100/80">No ratings submitted yet</div>
          )}
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-100 mb-3">
            Total Customer Reviews
          </div>
          <div>
            <div className="text-4xl font-bold tracking-tight">{data.totalRatings}</div>
            <div className="text-xs text-amber-100 mt-1">
              {data.totalRatings === 1 ? '1 customer has rated your store' : `${data.totalRatings} customers have rated your store`}
            </div>
          </div>
        </div>
      </div>

      {/* Raters Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Customer Ratings</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {data.raters.length} {data.raters.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        <SortableTable
          columns={columns}
          data={sortedRaters.map((r, i) => ({ ...r, id: r.userId + i }))}
          onSort={(key, order) => setSort({ key, order })}
          sortKey={sort.key}
          sortOrder={sort.order}
        />
      </div>
    </div>
  );
};

export default OwnerDashboard;
