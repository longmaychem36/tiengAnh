// ============================================
// Sidebar Component - Role-based Navigation
// ============================================
import { NavLink } from 'react-router-dom';
import {
  FiAward, FiBarChart2, FiBook, FiBookOpen, FiHome,
  FiSearch, FiSettings, FiShield, FiUser
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Tổng quan' },
  { to: '/courses', icon: FiBook, label: 'Khóa học' },
  { to: '/grammar', icon: FiBookOpen, label: 'Ngữ pháp' },
  { to: '/dictionary', icon: FiSearch, label: 'Từ điển' },
  { to: '/collections', icon: FiBookOpen, label: 'Bộ sưu tập' },
  { to: '/progress', icon: FiBarChart2, label: 'Tiến độ' },
  { to: '/profile', icon: FiUser, label: 'Hồ sơ' }
];

function NavItem({ to, icon: Icon, label, isAdminLink }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `lingo-nav-item ${isActive ? 'is-active' : ''} ${isAdminLink ? 'is-admin' : ''}`}
    >
      <Icon size={18} />
      <span>{label}</span>
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
          <span>English Learning</span>
        </div>
      </div>

      <nav className="lingo-sidebar-nav">
        <span className="lingo-nav-label">Điều hướng</span>
        {navItems.map(item => <NavItem key={item.to} {...item} />)}

        {isAdmin && (
          <>
            <span className="lingo-nav-label lingo-admin-label"><FiShield size={12} /> Admin</span>
            <NavItem to="/admin" icon={FiSettings} label="Bảng điều khiển" isAdminLink />
          </>
        )}
      </nav>

      <div className="lingo-sidebar-bottom">
        {isAdmin && (
          <div className={`lingo-role-card ${isSuperAdmin ? 'is-super' : ''}`}>
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </div>
        )}

        <div className="lingo-streak-card">
          <FiAward />
          <strong>Tiếp tục học</strong>
          <span>Hoàn thành bài học để nhận EXP.</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
