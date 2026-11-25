import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
  ownedStore?: {
    id: string;
    name: string;
    address: string;
    averageRating: number | null;
  } | null;
}

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => toast.error('Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-gray-400">Loading...</div>;
  if (!user) return <div className="text-center mt-20 text-red-400">User not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/admin/users" className="text-indigo-600 text-sm hover:underline mb-4 block">← Back to Users</Link>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <span className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          {[
            ['Email', user.email],
            ['Address', user.address || '—'],
            ['Member since', new Date(user.createdAt).toLocaleDateString()],
          ].map(([label, val]) => (
            <div key={label} className="flex">
              <span className="w-32 text-gray-500 font-medium">{label}</span>
              <span className="text-gray-800">{val}</span>
            </div>
          ))}
        </div>

        {user.role === 'store_owner' && user.ownedStore && (
          <div className="mt-6 border-t pt-5">
            <h3 className="font-semibold text-gray-700 mb-3">Owned Store</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="font-medium text-gray-800">{user.ownedStore.name}</div>
              <div className="text-gray-500">{user.ownedStore.address || '—'}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-500">Store Rating:</span>
                {user.ownedStore.averageRating !== null ? (
                  <>
                    <StarRating value={Math.round(user.ownedStore.averageRating)} readOnly size="sm" />
                    <span className="text-gray-700 font-medium">{user.ownedStore.averageRating.toFixed(1)}</span>
                  </>
                ) : (
                  <span className="text-gray-400">No ratings yet</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
