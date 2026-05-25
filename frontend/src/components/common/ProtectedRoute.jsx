// ============================================
// Protected Route — Redirects unauthenticated users
// ============================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from './Loading';

function ProtectedRoute({ children, learnerOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (learnerOnly && (user.role === 'admin' || user.role === 'superadmin')) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
