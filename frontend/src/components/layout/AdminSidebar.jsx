import { NavLink } from 'react-router-dom';
import {
  FiBookOpen,
  FiCommand,
  FiEdit3,
  FiGrid,
  FiHeadphones,
  FiLayers,
  FiLogOut,
  FiMic,
  FiPlay,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const adminItems = [
  { to: '/admin', label: 'Dashboard', icon: FiCommand, exact: true },
  { to: '/admin/listening', label: 'Listening', icon: FiHeadphones },
  { to: '/admin/reading', label: 'Reading', icon: FiBookOpen },
  { to: '/admin/speaking', label: 'Speaking', icon: FiMic },
  { to: '/admin/writing', label: 'Writing', icon: FiEdit3 },
  { to: '/admin/grammar', label: 'Grammar', icon: FiLayers },
  { to: '/admin/vocabulary', label: 'Vocabulary', icon: FiGrid },
  { to: '/admin/games', label: 'Mini games', icon: FiPlay },
  { to: '/admin/users', label: 'Accounts', icon: FiUsers },
];

function NavItem({ to, label, icon: Icon, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `admin-sidebar-link ${isActive ? 'is-active' : ''}`}
    >
      <span className="admin-nav-icon" aria-hidden="true">
        <Icon />
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <nav className="admin-sidebar-nav">
        {adminItems.map((item) => <NavItem key={item.to} {...item} />)}

      </nav>

      <div className="admin-sidebar-bottom">
        <a className="admin-sidebar-mini-link" href="https://themesberg.com" target="_blank" rel="noreferrer">
          Read tutorial
        </a>
        <span className="admin-sidebar-badge">Volt Dashboard</span>
        <button type="button" onClick={logout} className="admin-logout-button">
          <span className="admin-nav-icon" aria-hidden="true">
            <FiLogOut />
          </span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
