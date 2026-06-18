import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import Loading from '../common/Loading';
import '../../styles/admin.css';

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <nav className="admin-navbar">
          <span className="admin-navbar-title">Admin</span>
          <div className="admin-user-summary">
            <span>{user?.username || 'Admin'}</span>
            <small>{user?.role}</small>
          </div>
        </nav>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
