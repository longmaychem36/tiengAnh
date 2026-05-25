// ============================================
// Admin Layout — Separate shell for admin pages
// ============================================
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import Loading from '../common/Loading';

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
        {/* Admin Navbar */}
        <nav className="admin-navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Bảng điều khiển
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: user.role === 'superadmin'
                  ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(135deg, #c2185b, #8a4b35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.85rem'
              }}>
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>
                  {user?.username || 'Admin'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
