import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

export default function RoleGuard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentAdmin } = useAdmin();

  useEffect(() => {
    // If the user is an admin
    if (user?.isAdmin || currentAdmin) {
      // And they are trying to access a non-admin route (other than /admin/login)
      if (!location.pathname.startsWith('/admin') || location.pathname === '/admin/login') {
        navigate('/admin/dashboard', { replace: true });
      }
    } else if (user && !user.isAdmin) {
      // If a normal user tries to access an admin route
      if (location.pathname.startsWith('/admin')) {
        navigate('/', { replace: true });
      }
    }
  }, [user, currentAdmin, location.pathname, navigate]);

  return <>{children}</>;
}
