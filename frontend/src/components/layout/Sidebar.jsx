// ============================================
// Sidebar Component — Role-based Navigation
// ============================================
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiBook, FiBookOpen, FiSearch,
  FiPlay, FiBarChart2, FiUser, FiAward,
  FiUsers, FiSettings, FiShield, FiMic
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/courses', icon: FiBook, label: 'Khóa học' },
  { to: '/grammar', icon: FiBookOpen, label: 'Grammar' },
  { to: '/dictionary', icon: FiSearch, label: 'Dictionary' },
  { to: '/collections', icon: FiBookOpen, label: 'Collections' },
  { to: '/games', icon: FiPlay, label: 'Mini Games' },
  { to: '/progress', icon: FiBarChart2, label: 'Progress' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
];

// Admin can manage content
const adminItems = [
  { to: '/admin/courses', icon: FiBook, label: 'QL Khóa học' },
  { to: '/admin/games', icon: FiPlay, label: 'QL Mini Games' },
];

// SuperAdmin can manage users + system
const superAdminItems = [
  { to: '/admin/users', icon: FiUsers, label: 'QL Người dùng' },
];

function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  const NavItem = ({ to, icon: Icon, label, isAdminLink }) => (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-1)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? (isAdminLink ? 'var(--color-error)' : 'var(--color-primary)') : 'var(--color-text-secondary)',
        background: isActive ? (isAdminLink ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-primary-light)') : 'transparent',
        transition: 'all 150ms ease',
        textDecoration: 'none'
      })}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      zIndex: 'var(--z-sidebar)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      {/* Logo */}
      <div style={{
        height: 'var(--navbar-height)',
        display: 'flex', alignItems: 'center',
        padding: '0 var(--space-6)',
        borderBottom: '1px solid var(--color-border)',
        gap: 'var(--space-3)'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: '18px'
        }}>E</div>
        <span style={{
          fontWeight: 700, fontSize: 'var(--font-size-lg)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>EngLearn</span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
        {/* Main menu */}
        <div style={{ marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 var(--space-3)' }}>
            Menu
          </span>
        </div>
        {navItems.map(item => <NavItem key={item.to} {...item} />)}

        {/* Admin section — visible to admin + superadmin */}
        {isAdmin && (
          <>
            <div style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 var(--space-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiShield size={12} /> Admin
              </span>
            </div>
            {adminItems.map(item => <NavItem key={item.to} {...item} isAdminLink />)}
          </>
        )}

        {/* SuperAdmin section — only superadmin */}
        {isSuperAdmin && (
          <>
            <div style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 var(--space-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiShield size={12} /> Super Admin
              </span>
            </div>
            {superAdminItems.map(item => <NavItem key={item.to} {...item} isAdminLink />)}
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
        {/* Role badge */}
        {isAdmin && (
          <div style={{
            padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)',
            background: isSuperAdmin ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1))' : 'rgba(59,130,246,0.1)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: isSuperAdmin ? '#d97706' : '#2563eb' }}>
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
          </div>
        )}

        <div style={{
          padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
          textAlign: 'center'
        }}>
          <FiAward size={24} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }} />
          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Keep learning!</p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Complete lessons to earn EXP</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
