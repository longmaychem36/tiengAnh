// ============================================
// Sidebar Component - Role-based Navigation
// ============================================
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SoftIcon from '../common/SoftIcon';

const navItems = [
  { to: '/dashboard', label: 'Tổng quan', icon: 'home' },
  { to: '/daily-tasks', label: 'Nhiệm vụ', icon: 'tasks' },
  { to: '/courses', label: 'Khóa học', icon: 'courses', activePaths: ['/games'] },
  { to: '/grammar', label: 'Ngữ pháp', icon: 'grammar' },
  { to: '/dictionary', label: 'Từ điển', icon: 'dictionary' },
  { to: '/vocabulary', label: 'Từ vựng', icon: 'vocabulary' },
  { to: '/profile', label: 'Hồ sơ & tiến độ', icon: 'profile' }
];

function NavItem({ to, label, icon, isAdminLink, activePaths = [] }) {
  const { pathname } = useLocation();
  const isRelatedActive = activePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `lingo-nav-item ${isActive || isRelatedActive ? 'is-active' : ''} ${isAdminLink ? 'is-admin' : ''}`}
    >
      {icon && <SoftIcon name={icon} className="lingo-nav-icon" />}
      <span className="lingo-nav-text">{label}</span>
    </NavLink>
  );
}

function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <aside className="lingo-sidebar">
      <div className="lingo-brand">
        <div className="lingo-brand-mark">L</div>
        <div>
          <strong>LingoWeb</strong>
          <span>Học tiếng Anh</span>
        </div>
      </div>

      <nav className="lingo-sidebar-nav">
        <span className="lingo-nav-label">Điều hướng</span>
        {navItems.map(item => <NavItem key={item.to} {...item} />)}

        {isAdmin && (
          <>
            <span className="lingo-nav-label lingo-admin-label">Admin</span>
            <NavItem to="/admin" label="Bảng điều khiển" icon="admin" isAdminLink />
          </>
        )}
      </nav>

      {isAdmin && (
        <div className={`lingo-role-card ${isSuperAdmin ? 'is-super' : ''}`}>
          {isSuperAdmin ? 'Super Admin' : 'Admin'}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
