import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface UseProtectedRouteOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { requireAdmin = false, redirectTo = '/login' } = options;
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (requireAdmin && !isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAdmin, redirectTo, navigate]);

  return { isLoading, isAuthenticated, isAdmin };
}
