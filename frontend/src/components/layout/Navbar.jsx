// ============================================
// Navbar Component
// ============================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notificationApi } from '../../api/notificationApi';
import { FiBell, FiCheck, FiLogOut, FiX, FiZap } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';

function formatNotificationTime(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoadingNotifications(true);
    try {
      const res = await notificationApi.listMine({ limit: 8 });
      const data = res.data || res;
      setNotifications(data.notifications || []);
      setUnreadCount(Number(data.unreadCount || 0));
    } catch {
      // Notification polling should not interrupt the learning flow.
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(timer);
  }, [loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markNotificationRead = async (item) => {
    if (!item?.recipientId || item.readAt) return;
    try {
      const res = await notificationApi.markRead(item.recipientId);
      const data = res.data || res;
      setNotifications(data.notifications || []);
      setUnreadCount(Number(data.unreadCount || 0));
    } catch {
      // Keep the dropdown usable even if the read marker fails.
    }
  };

  const markAllRead = async () => {
    try {
      const res = await notificationApi.markAllRead();
      const data = res.data || res;
      setNotifications(data.notifications || []);
      setUnreadCount(Number(data.unreadCount || 0));
    } catch {
      // Ignore transient failures.
    }
  };

  const openNotificationDetail = async (item) => {
    setSelectedNotification(item);
    setOpen(false);
    await markNotificationRead(item);
  };

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
              <FiZap size={16} /> {user.stats.exp || 0} EXP
            </div>
          </>
        )}

        <div className={user?.isPlus ? 'lingo-chip lingo-chip-plus' : 'lingo-chip'}>
          {user?.isPlus ? 'PLUS' : 'FREE'}
        </div>

        <div className="lingo-notification-menu" ref={dropdownRef}>
          <button
            type="button"
            className="btn btn-icon btn-ghost lingo-notification-button"
            title="Thông báo"
            aria-label="Thông báo"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <FiBell size={18} />
            {unreadCount > 0 && <span>{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>

          {open && (
            <section className="lingo-notification-dropdown" aria-label="Danh sách thông báo">
              <div className="lingo-notification-head">
                <strong>Thông báo</strong>
                {unreadCount > 0 && (
                  <button type="button" onClick={markAllRead}>
                    <FiCheck />
                    Đã đọc tất cả
                  </button>
                )}
              </div>

              <div className="lingo-notification-list">
                {loadingNotifications && notifications.length === 0 && (
                  <div className="lingo-notification-empty">Đang tải thông báo...</div>
                )}

                {!loadingNotifications && notifications.length === 0 && (
                  <div className="lingo-notification-empty">Chưa có thông báo mới.</div>
                )}

                {notifications.map((item) => {
                  const content = (
                    <>
                      <span className={`lingo-notification-dot ${item.readAt ? '' : 'is-unread'}`} />
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.message}</p>
                        <time>{formatNotificationTime(item.createdAt)}</time>
                      </div>
                    </>
                  );

                  return (
                    <button
                      key={item.recipientId || item.id}
                      type="button"
                      className={`lingo-notification-item ${item.readAt ? '' : 'is-unread'}`}
                      onClick={() => openNotificationDetail(item)}
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

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

        <button type="button" className="btn btn-icon btn-ghost" onClick={logout} title="Đăng xuất">
          <FiLogOut size={18} />
        </button>
      </div>

      {selectedNotification && (
        <div className="lingo-notification-modal-backdrop" role="presentation" onClick={() => setSelectedNotification(null)}>
          <section
            className="lingo-notification-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>Thông báo</span>
                <h2 id="notification-detail-title">{selectedNotification.title}</h2>
                <time>{formatNotificationTime(selectedNotification.createdAt)}</time>
              </div>
              <button type="button" aria-label="Đóng" onClick={() => setSelectedNotification(null)}>
                <FiX />
              </button>
            </header>
            <p>{selectedNotification.message}</p>
          </section>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
