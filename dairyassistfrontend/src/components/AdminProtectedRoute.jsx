import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAdmin();
  
  // Direct backup check: If context is syncing, trust the token in storage
  const token = localStorage.getItem('adminToken');

  // 1. If context is loading, wait.
  if (loading) {
    return <div className="loading-container">Loading Admin Access...</div>;
  }

  // 2. If there is NO token in storage, definitely kick them out.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If token exists, but Context says not authenticated (and not loading),
  // it means the token was invalid/expired. Kick them out.
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }

  
  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;