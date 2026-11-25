import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homeLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'store_owner') return '/owner/dashboard';
    return '/stores';
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link to={homeLink()} className="text-xl font-bold tracking-wide">
        🏪 StorePulse
      </Link>
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80">
            {user?.name} <span className="ml-1 bg-indigo-500 px-2 py-0.5 rounded text-xs capitalize">{user?.role?.replace('_', ' ')}</span>
          </span>
          {(user?.role === 'normal_user' || user?.role === 'store_owner') && (
            <Link to="/change-password" className="text-sm hover:underline">
              Change Password
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-700 text-sm px-3 py-1 rounded hover:bg-indigo-50 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
