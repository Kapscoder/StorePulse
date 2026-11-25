import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserList from './pages/admin/AdminUserList';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AddUser from './pages/admin/AddUser';
import AdminStoreList from './pages/admin/AdminStoreList';
import AddStore from './pages/admin/AddStore';

// User
import UserStoreList from './pages/user/UserStoreList';

// Owner
import OwnerDashboard from './pages/owner/OwnerDashboard';

const RoleRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster position="top-right" />
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RoleRedirect />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUserList /></ProtectedRoute>} />
            <Route path="/admin/users/new" element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute>} />
            <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminUserDetail /></ProtectedRoute>} />
            <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={['admin']}><AdminStoreList /></ProtectedRoute>} />
            <Route path="/admin/stores/new" element={<ProtectedRoute allowedRoles={['admin']}><AddStore /></ProtectedRoute>} />

            {/* Normal user routes */}
            <Route path="/stores" element={<ProtectedRoute allowedRoles={['normal_user']}><UserStoreList /></ProtectedRoute>} />

            {/* Store owner routes */}
            <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['store_owner']}><OwnerDashboard /></ProtectedRoute>} />

            {/* Shared */}
            <Route path="/change-password" element={<ProtectedRoute allowedRoles={['normal_user', 'store_owner']}><ChangePassword /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<RoleRedirect />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
