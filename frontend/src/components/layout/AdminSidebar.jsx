import { NavLink } from 'react-router-dom';
import {
  FiBookOpen,
  FiBell,
  FiCommand,
  FiEdit3,
  FiGrid,
  FiHeadphones,
  FiLayers,
  FiLogOut,
  FiLifeBuoy,
  FiMic,
  FiPlay,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const adminItems = [
  { to: '/admin', label: 'Tổng quan', icon: FiCommand, exact: true },
  { to: '/admin/listening', label: 'Luyện nghe', icon: FiHeadphones },
  { to: '/admin/reading', label: 'Luyện đọc', icon: FiBookOpen },
  { to: '/admin/speaking', label: 'Luyện nói', icon: FiMic },
  { to: '/admin/writing', label: 'Luyện viết', icon: FiEdit3 },
  { to: '/admin/grammar', label: 'Ngữ pháp', icon: FiLayers },
  { to: '/admin/vocabulary', label: 'Từ vựng', icon: FiGrid },
  { to: '/admin/games', label: 'Trò chơi', icon: FiPlay },
  { to: '/admin/users', label: 'Tài khoản', icon: FiUsers },
  { to: '/admin/notifications', label: 'Thông báo', icon: FiBell },
  { to: '/admin/support', label: 'Hỗ trợ', icon: FiLifeBuoy },
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
    <aside className="admin-sidebar" aria-label="Điều hướng quản trị">
      <nav className="admin-sidebar-nav">
        {adminItems.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      <div className="admin-sidebar-bottom">
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
