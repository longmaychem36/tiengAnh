// ============================================
// Admin Sidebar - Admin-specific navigation
// ============================================
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SoftIcon from '../common/SoftIcon';

const adminItems = [
  { to: '/admin', label: 'Tổng quan', icon: 'admin', exact: true },
  { to: '/admin/listening', label: 'Listening', icon: 'listening' },
  { to: '/admin/reading', label: 'Reading', icon: 'reading' },
  { to: '/admin/speaking', label: 'Speaking', icon: 'speaking' },
  { to: '/admin/writing', label: 'Writing', icon: 'writing' },
  { to: '/admin/grammar', label: 'Grammar', icon: 'grammar' },
  { to: '/admin/vocabulary', label: 'Vocabulary', icon: 'vocabulary' },
  { to: '/admin/placement-tests', label: 'Kiểm tra đầu vào', icon: 'placement' },
  { to: '/admin/games', label: 'Mini Games', icon: 'games' },
];

const superAdminItems = [
  { to: '/admin/users', label: 'Người dùng', icon: 'users' },
];

function NavItem({ to, label, icon, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `admin-sidebar-link ${isActive ? 'is-active' : ''}`}
    >
      <SoftIcon name={icon} className="admin-nav-icon" />
      <span>{label}</span>
    </NavLink>
  );
}

function AdminSidebar() {
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="admin-brand-mark">E</div>
        <div>
          <div className="admin-brand-title">EngLearn</div>
          <div className="admin-brand-subtitle">Admin Panel</div>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-sidebar-section-label">
          Quản lý nội dung
        </div>
        {adminItems.map(item => <NavItem key={item.to} {...item} />)}

        {isSuperAdmin && (
          <>
            <div className="admin-sidebar-section-label" style={{ color: '#f59e0b', marginTop: '20px' }}>
              Super Admin
            </div>
            {superAdminItems.map(item => <NavItem key={item.to} {...item} />)}
          </>
        )}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className={`admin-role-badge ${isSuperAdmin ? 'is-super' : ''}`}>
          <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
        </div>

        <button type="button" onClick={logout} className="admin-logout-button">
          <SoftIcon name="logout" className="admin-nav-icon" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
