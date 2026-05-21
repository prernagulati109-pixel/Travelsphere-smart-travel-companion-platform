import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const AdminRoute = () => {
  const { currentAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return currentAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
