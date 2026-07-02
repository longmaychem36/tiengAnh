import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import Loading from '../common/Loading';

function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <nav className="admin-navbar">
          <div className="admin-navbar-heading">
            <span className="admin-navbar-title">LingoConnect · Quản trị hệ thống</span>
          </div>

          <div className="admin-user-summary">
            <span className="admin-user-label">Đang đăng nhập</span>
            <strong>{user?.username || 'Quản trị viên'}</strong>
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
