// ============================================
// Admin Sidebar — Admin-specific navigation
// ============================================
import { NavLink } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const adminItems = [
  { to: '/admin', image: '/nav-icons/admin-dashboard.svg', label: 'Tổng quan', exact: true },
  { to: '/admin/listening', image: '/nav-icons/admin-listening.svg', label: 'Listening' },
  { to: '/admin/reading', image: '/nav-icons/admin-reading.svg', label: 'Reading' },
  { to: '/admin/speaking', image: '/nav-icons/admin-speaking.svg', label: 'Speaking' },
  { to: '/admin/writing', image: '/nav-icons/admin-writing.svg', label: 'Writing' },
  { to: '/admin/grammar', image: '/nav-icons/admin-grammar.svg', label: 'Grammar' },
  { to: '/admin/vocabulary', image: '/nav-icons/admin-vocabulary.svg', label: 'Vocabulary' },
  { to: '/admin/placement-tests', image: '/nav-icons/admin-placement.svg', label: 'Kiểm tra đầu vào' },
  { to: '/admin/games', image: '/nav-icons/admin-games.svg', label: 'Mini Games' },
];

const superAdminItems = [
  { to: '/admin/users', image: '/nav-icons/admin-users.svg', label: 'Người dùng' },
];

function NavItem({ to, image, label, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `admin-sidebar-link ${isActive ? 'is-active' : ''}`}
    >
      <span className="admin-sidebar-icon">
        <img src={image} alt="" aria-hidden="true" />
      </span>
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
          <FiShield size={11} />
          Quản lý nội dung
        </div>
        {adminItems.map(item => <NavItem key={item.to} {...item} />)}

        {/* SuperAdmin Section */}
        {isSuperAdmin && (
          <>
            <div className="admin-sidebar-section-label" style={{ color: '#f59e0b', marginTop: '20px' }}>
              <FiShield size={11} />
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
          <span className="admin-sidebar-icon">
            <img src="/nav-icons/logout.svg" alt="" aria-hidden="true" />
          </span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
