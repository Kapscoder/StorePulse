import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SortableTable, { Column, SortOrder } from '../../components/SortableTable';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
}

const roleBadge = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    normal_user: 'bg-blue-100 text-blue-700',
    store_owner: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100'}`}>
      {role.replace('_', ' ')}
    </span>
  );
};

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ key: 'name', order: 'asc' as SortOrder });
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        sortBy: sort.key,
        sortOrder: sort.order,
        page: String(page),
        limit: String(limit),
      });
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const columns: Column<User>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (u) => roleBadge(u.role) },
    {
      key: 'actions', label: '', render: (u) => (
        <Link to={`/admin/users/${u.id}`} className="text-indigo-600 hover:underline text-xs font-medium">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <Link to="/admin/users/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
          + Add User
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {(['name', 'email', 'address'] as const).map((f) => (
          <input
            key={f}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            value={filters[f]}
            onChange={(e) => { setFilters((p) => ({ ...p, [f]: e.target.value })); setPage(1); }}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
          />
        ))}
        <select
          value={filters.role}
          onChange={(e) => { setFilters((p) => ({ ...p, role: e.target.value })); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="normal_user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : (
        <SortableTable
          columns={columns}
          data={users}
          onSort={(key, order) => setSort({ key, order })}
          sortKey={sort.key}
          sortOrder={sort.order}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{total} total users</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
          <span className="px-2 py-1">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page * limit >= total} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
