
// The VIP Access Control Component
// Ensures that only authenticated users (and optionally admins) can access certain routes.

// Security guard that ensures only authorized personnel (Admins) can access sensitive pages.


import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader } from './Loader';
//props for ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}
//checks weather user is authenticated and if admin access is required
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  // show loader while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader size="lg" />
      </div>
    );
  }
  // redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // redirect to dashboard if admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  // render children if all checks pass
  return <>{children}</>;
}
