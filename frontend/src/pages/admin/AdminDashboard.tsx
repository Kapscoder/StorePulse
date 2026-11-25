import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const StatCard: React.FC<{ label: string; value: number; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className={`${color} rounded-2xl p-6 text-white shadow-md`}>
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-4xl font-bold">{value.toLocaleString()}</div>
    <div className="text-sm mt-1 opacity-80">{label}</div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center mt-20 text-gray-400">Loading...</div>;
  if (!stats) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👤" color="bg-indigo-600" />
        <StatCard label="Total Stores" value={stats.totalStores} icon="🏪" color="bg-emerald-600" />
        <StatCard label="Total Ratings" value={stats.totalRatings} icon="⭐" color="bg-amber-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/admin/users" className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="font-semibold text-gray-700">👥 Manage Users</div>
          <div className="text-sm text-gray-400 mt-1">View, filter and add users</div>
        </a>
        <a href="/admin/stores" className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
          <div className="font-semibold text-gray-700">🏪 Manage Stores</div>
          <div className="text-sm text-gray-400 mt-1">View, filter and add stores</div>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
