// ============================================
// Navbar Component
// ============================================
import { useAuth } from '../../hooks/useAuth';
import { FiBell, FiLogOut } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="lingo-navbar">
      <div className="lingo-navbar-actions">
        {user?.stats && (
          <>
            <div className="lingo-chip lingo-chip-warning">
              <HiOutlineFire size={16} />
              <span>{user.stats.streakDays || 0} ngày</span>
            </div>
            <div className="lingo-chip lingo-chip-indigo">
              ⚡ {user.stats.exp || 0} EXP
            </div>
          </>
        )}

        <div className={user?.isPlus ? 'lingo-chip lingo-chip-plus' : 'lingo-chip'}>
          {user?.isPlus ? 'PLUS' : 'FREE'}
        </div>

        <button className="btn btn-icon btn-ghost" title="Thông báo">
          <FiBell size={18} />
        </button>

        <div className="lingo-user-pill">
          <div className="lingo-avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            ) : (
              user?.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <span>{user?.username || 'User'}</span>
        </div>

        <button className="btn btn-icon btn-ghost" onClick={logout} title="Đăng xuất">
          <FiLogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
