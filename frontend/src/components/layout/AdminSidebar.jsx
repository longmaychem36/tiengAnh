// ============================================
// Admin Sidebar — Admin-specific navigation
// ============================================
import { NavLink, Link } from 'react-router-dom';
import {
  FiGrid, FiBook, FiBookOpen, FiMic, FiEdit3, FiHeadphones,
  FiPlay, FiUsers, FiShield, FiArrowLeft, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const adminItems = [
  { to: '/admin', icon: FiGrid, label: 'Tổng quan', exact: true },
  { to: '/admin/courses', icon: FiBook, label: 'Khóa học' },
  { to: '/admin/listening', icon: FiHeadphones, label: 'Listening' },
  { to: '/admin/reading', icon: FiBookOpen, label: 'Reading' },
  { to: '/admin/speaking', icon: FiMic, label: 'Speaking' },
  { to: '/admin/writing', icon: FiEdit3, label: 'Writing' },
  { to: '/admin/grammar', icon: FiBookOpen, label: 'Grammar' },
  { to: '/admin/games', icon: FiPlay, label: 'Mini Games' },
];

const superAdminItems = [
  { to: '/admin/users', icon: FiUsers, label: 'Người dùng' },
];

function AdminSidebar() {
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const NavItem = ({ to, icon: Icon, label, exact }) => (
    <NavLink
      to={to}
      end={exact}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: '10px',
        marginBottom: '2px',
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
        background: isActive ? 'rgba(194,24,91,0.32)' : 'transparent',
        transition: 'all 150ms ease',
        textDecoration: 'none',
        letterSpacing: '0.01em'
      })}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div style={{
          width: 38, height: 38, borderRadius: '10px',
          background: 'linear-gradient(135deg, #c2185b, #8a4b35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: '18px'
        }}>E</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.2 }}>
            EngLearn
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {/* Admin Section */}
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

      {/* Bottom section */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Role badge */}
        <div style={{
          padding: '10px', borderRadius: '10px', marginBottom: '8px',
          background: isSuperAdmin
            ? 'linear-gradient(135deg, rgba(200,133,30,0.16), rgba(201,74,85,0.16))'
            : 'rgba(194,24,91,0.14)',
          textAlign: 'center'
        }}>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: isSuperAdmin ? '#fbbf24' : '#f8bfd5'
          }}>
            {isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin'}
          </span>
        </div>

        {/* Back to learning */}
        <Link to="/dashboard" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 16px', borderRadius: '10px',
          color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem',
          textDecoration: 'none', transition: 'all 150ms ease',
          fontWeight: 500
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <FiArrowLeft size={16} />
          Về trang học
        </Link>

        {/* Logout */}
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
          padding: '10px 16px', borderRadius: '10px', border: 'none',
          background: 'transparent', color: 'rgba(255,255,255,0.4)',
          fontSize: '0.85rem', cursor: 'pointer', transition: 'all 150ms ease',
          fontWeight: 500
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <FiLogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
