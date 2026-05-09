// ============================================
// Navbar Component
// ============================================
import { useAuth } from '../../hooks/useAuth';
import { FiSearch, FiBell, FiLogOut } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      height: 'var(--navbar-height)',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-8)',
      zIndex: 'var(--z-navbar)',
      backdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(255,255,255,0.85)'
    }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-2) var(--space-4)',
        flex: '0 1 400px'
      }}>
        <FiSearch style={{ color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Search courses, lessons, words..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '100%',
            color: 'var(--color-text)',
            fontSize: 'var(--font-size-sm)'
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* Streak */}
        {user?.stats && (
          <div className="badge badge-warning" style={{ gap: '4px' }}>
            <HiOutlineFire size={16} />
            <span>{user.stats.streakDays || 0} days</span>
          </div>
        )}

        {/* EXP */}
        {user?.stats && (
          <div className="badge badge-primary">
            ⚡ {user.stats.exp || 0} EXP
          </div>
        )}

        <button className="btn btn-icon btn-ghost" title="Notifications">
          <FiBell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 'var(--font-size-sm)'
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
            {user?.username || 'User'}
          </span>
        </div>

        <button className="btn btn-icon btn-ghost" onClick={logout} title="Logout">
          <FiLogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
