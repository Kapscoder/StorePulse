import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homeLink = () => {
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'store_owner') return '/owner/dashboard';
    return '/stores';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to={homeLink()} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">StorePulse</span>
          </Link>

          {user.role === 'admin' && (
            <div className="hidden sm:flex items-center gap-1">
              <NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/admin/users" className={navLinkClass}>Users</NavLink>
              <NavLink to="/admin/stores" className={navLinkClass}>Stores</NavLink>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <span className="font-medium text-slate-800">{user.name}</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
              {user.role.replace('_', ' ')}
            </span>
          </div>

          {(user.role === 'normal_user' || user.role === 'store_owner') && (
            <Link
              to="/change-password"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              Password
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="border border-slate-300 text-slate-700 text-sm px-3.5 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
