import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const adminItems = [
  { to: '/admin', label: 'Tổng quan', exact: true },
  { to: '/admin/listening', label: 'Listening' },
  { to: '/admin/reading', label: 'Reading' },
  { to: '/admin/speaking', label: 'Speaking' },
  { to: '/admin/writing', label: 'Writing' },
  { to: '/admin/grammar', label: 'Grammar' },
  { to: '/admin/vocabulary', label: 'Vocabulary' },
  { to: '/admin/placement-tests', label: 'Placement tests' },
  { to: '/admin/games', label: 'Mini games' },
];

const superAdminItems = [
  { to: '/admin/users', label: 'Người dùng' },
];

function NavItem({ to, label, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `admin-sidebar-link ${isActive ? 'is-active' : ''}`}
    >
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
        <div>
          <div className="admin-brand-title">EngLearn</div>
          <div className="admin-brand-subtitle">Admin</div>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-sidebar-section-label">Nội dung</div>
        {adminItems.map(item => <NavItem key={item.to} {...item} />)}

        {isSuperAdmin && (
          <>
            <div className="admin-sidebar-section-label">Super Admin</div>
            {superAdminItems.map(item => <NavItem key={item.to} {...item} />)}
          </>
        )}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-role-badge">
          <span>{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
        </div>

        <button type="button" onClick={logout} className="admin-logout-button">
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
