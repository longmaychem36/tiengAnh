// ============================================
// Sidebar Component - Role-based Navigation
// ============================================
import { NavLink } from 'react-router-dom';
import { FiSettings, FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', image: '/nav-icons/learn.svg', label: 'Học' },
  { to: '/daily-tasks', image: '/nav-icons/tasks.svg', label: 'Nhiệm vụ' },
  { to: '/courses', image: '/nav-icons/courses.svg', label: 'Khóa học' },
  { to: '/grammar', image: '/nav-icons/grammar.svg', label: 'Ngữ pháp' },
  { to: '/dictionary', image: '/nav-icons/dictionary.svg', label: 'Từ điển' },
  { to: '/vocabulary', image: '/nav-icons/collections.svg', label: 'Vocabulary' },
  { to: '/progress', image: '/nav-icons/progress.svg', label: 'Tiến độ' },
  { to: '/profile', image: '/nav-icons/profile.svg', label: 'Hồ sơ' }
];

function NavItem({ to, image, icon: Icon, label, isAdminLink }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `lingo-nav-item ${isActive ? 'is-active' : ''} ${isAdminLink ? 'is-admin' : ''}`}
    >
      <span className="lingo-nav-icon">
        {image ? <img src={image} alt="" aria-hidden="true" /> : <Icon size={21} />}
      </span>
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

      {isAdmin && (
        <div className={`lingo-role-card ${isSuperAdmin ? 'is-super' : ''}`}>
          {isSuperAdmin ? 'Super Admin' : 'Admin'}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
