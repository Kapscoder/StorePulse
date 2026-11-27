import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 w-56 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => <div key={n} className="h-36 bg-slate-200 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((n) => <div key={n} className="h-24 bg-slate-200 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      sub: 'Registered accounts across all roles',
      gradient: 'from-indigo-600 to-indigo-700',
      badge: 'Users',
      to: '/admin/users',
    },
    {
      label: 'Total Stores',
      value: stats.totalStores,
      sub: 'Active stores listed on platform',
      gradient: 'from-emerald-600 to-teal-700',
      badge: 'Stores',
      to: '/admin/stores',
    },
    {
      label: 'Submitted Ratings',
      value: stats.totalRatings,
      sub: 'Customer reviews collected',
      gradient: 'from-amber-500 to-orange-600',
      badge: 'Ratings',
      to: '/admin/stores',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Signed in as <span className="font-medium text-slate-700">{user?.name}</span> — platform overview & management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/users/new"
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition shadow-xs"
          >
            + Add User
          </Link>
          <Link
            to="/admin/stores/new"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
          >
            + Add Store
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className={`group bg-gradient-to-br ${c.gradient} rounded-2xl p-6 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                {c.badge}
              </span>
              <span className="text-white/70 group-hover:translate-x-0.5 transition-transform text-sm">→</span>
            </div>
            <div className="text-4xl font-bold tracking-tight">{c.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-white/95 mt-1">{c.label}</div>
            <div className="text-xs text-white/75 mt-1">{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/users"
            className="group flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition"
          >
            <div>
              <div className="font-semibold text-slate-800 group-hover:text-indigo-700 transition">
                Manage Users
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Filter by name, email, address, or role & inspect user profiles
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold group-hover:bg-indigo-600 group-hover:text-white transition">
              →
            </span>
          </Link>

          <Link
            to="/admin/stores"
            className="group flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-sm transition"
          >
            <div>
              <div className="font-semibold text-slate-800 group-hover:text-emerald-700 transition">
                Manage Stores
              </div>
              <div className="text-sm text-slate-500 mt-1">
                View store ratings, filter listings, and register new store owners
              </div>
            </div>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold group-hover:bg-emerald-600 group-hover:text-white transition">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
