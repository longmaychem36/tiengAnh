// ============================================
// Protected Route — Redirects unauthenticated users
// ============================================
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from './Loading';

function ProtectedRoute({ children, learnerOnly = false }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (learnerOnly && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (learnerOnly && user.onboardingCompleted === false && pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export default ProtectedRoute;
