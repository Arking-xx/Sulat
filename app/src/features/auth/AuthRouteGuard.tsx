import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
export function AuthRouteGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}
