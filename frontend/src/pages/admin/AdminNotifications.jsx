import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBell, FiMail, FiRefreshCw, FiSend, FiUsers } from 'react-icons/fi';
import { adminApi } from '../../api/adminApi';
import { adminNotificationApi } from '../../api/notificationApi';

const initialForm = {
  title: '',
  message: '',
  type: 'info',
  linkUrl: '',
  audience: 'all',
  sendEmail: true,
  userIds: []
};

const typeLabels = {
  info: 'Thông báo',
  level_up: 'Lên cấp',
  plus_activated: 'Plus',
  support: 'Hỗ trợ',
  warning: 'Nhắc nhở'
};

function getField(row, ...keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }
  return undefined;
}

function getUserId(user) {
  return String(getField(user, 'Id', 'id') || '');
}

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return '-';
  }
}

function AdminNotifications() {
  const [form, setForm] = useState(initialForm);
  const [learners, setLearners] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const filteredLearners = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return learners;
    return learners.filter((user) => {
      const username = String(getField(user, 'Username', 'username') || '').toLowerCase();
      const email = String(getField(user, 'Email', 'email') || '').toLowerCase();
      return username.includes(keyword) || email.includes(keyword);
    });
  }, [learners, search]);

  const selectedCount = form.audience === 'all' ? learners.length : form.userIds.length;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, notificationsRes] = await Promise.all([
        adminApi.getUsers({ page: 1, limit: 200, role: 'user' }),
        adminNotificationApi.list({ page: 1, limit: 30 })
      ]);
      setLearners(usersRes.data?.users || usersRes.users || []);
      setNotifications(notificationsRes.data || notificationsRes.items || []);
    } catch (err) {
      toast.error(err?.message || 'Không tải được dữ liệu thông báo');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleUser = (userId) => {
    setForm((current) => {
      const exists = current.userIds.includes(userId);
      return {
        ...current,
        userIds: exists
          ? current.userIds.filter((id) => id !== userId)
          : [...current.userIds, userId]
      };
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const message = form.message.trim();

    if (!title || !message) {
      toast.error('Tiêu đề và nội dung là bắt buộc');
      return;
    }

    if (form.audience === 'selected' && form.userIds.length === 0) {
      toast.error('Chọn ít nhất một learner để gửi thông báo');
      return;
    }

    setSending(true);
    try {
      await adminNotificationApi.create({
        title,
        message,
        type: form.type,
        linkUrl: form.linkUrl.trim() || null,
        audience: form.audience,
        userIds: form.audience === 'selected' ? form.userIds : [],
        sendEmail: form.sendEmail
      });
      toast.success('Đã gửi thông báo');
      setForm(initialForm);
      setSearch('');
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Không gửi được thông báo');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-notification-page">
      <header className="admin-page-title admin-notification-title">
        <div>
          <h1>Thông báo</h1>
          <p>Tạo thông báo trong app và gửi email tới learner bằng cấu hình mail hiện có.</p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
          <FiRefreshCw />
          Làm mới
        </button>
      </header>

      <div className="admin-notification-grid">
        <section className="admin-content-card">
          <div className="admin-subpanel-head">
            <div>
              <h3>Tạo thông báo</h3>
              <p>{selectedCount || 0} người nhận dự kiến</p>
            </div>
            <FiSend />
          </div>

          <form className="admin-form-grid admin-notification-form" onSubmit={submit}>
            <label>
              <span>Tiêu đề *</span>
              <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Ví dụ: Plus đã được kích hoạt" />
            </label>

            <label>
              <span>Loại thông báo</span>
              <select value={form.type} onChange={(event) => updateForm('type', event.target.value)}>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="is-wide">
              <span>Nội dung *</span>
              <textarea rows={5} value={form.message} onChange={(event) => updateForm('message', event.target.value)} placeholder="Nội dung sẽ hiển thị trong app và email." />
            </label>

            <label>
              <span>Đường dẫn khi bấm</span>
              <input value={form.linkUrl} onChange={(event) => updateForm('linkUrl', event.target.value)} placeholder="/settings hoặc /dashboard" />
            </label>

            <label>
              <span>Người nhận</span>
              <select value={form.audience} onChange={(event) => updateForm('audience', event.target.value)}>
                <option value="all">Tất cả learner</option>
                <option value="selected">Chọn từng learner</option>
              </select>
            </label>

            <label className="admin-check-row is-wide">
              <input type="checkbox" checked={form.sendEmail} onChange={(event) => updateForm('sendEmail', event.target.checked)} />
              <span>
                <FiMail />
                Gửi kèm email
              </span>
            </label>

            {form.audience === 'selected' && (
              <div className="admin-notification-recipient-box is-wide">
                <div className="admin-notification-recipient-head">
                  <strong>Chọn learner</strong>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên hoặc email" />
                </div>
                <div className="admin-notification-recipient-list">
                  {filteredLearners.map((user) => {
                    const userId = getUserId(user);
                    return (
                      <label key={userId} className="admin-notification-recipient">
                        <input type="checkbox" checked={form.userIds.includes(userId)} onChange={() => toggleUser(userId)} />
                        <span>
                          <strong>{getField(user, 'Username', 'username') || 'Chưa có tên'}</strong>
                          <small>{getField(user, 'Email', 'email')}</small>
                        </span>
                      </label>
                    );
                  })}
                  {!loading && filteredLearners.length === 0 && (
                    <div className="admin-empty-inline">Không có learner phù hợp.</div>
                  )}
                </div>
              </div>
            )}

            <div className="admin-form-actions is-wide">
              <button type="submit" className="btn btn-primary" disabled={sending}>
                <FiSend />
                {sending ? 'Đang gửi...' : 'Gửi thông báo'}
              </button>
            </div>
          </form>
        </section>

        <aside className="admin-content-card admin-notification-summary">
          <div className="admin-subpanel-head">
            <div>
              <h3>Tổng quan</h3>
              <p>Thông báo tự động và thủ công</p>
            </div>
            <FiBell />
          </div>
          <div className="admin-notification-metrics">
            <article>
              <strong>{notifications.length}</strong>
              <span>Thông báo gần đây</span>
            </article>
            <article>
              <strong>{learners.length}</strong>
              <span>Học viên có thể nhận</span>
            </article>
            <article>
              <strong>{notifications.reduce((sum, item) => sum + Number(item.emailSentCount || item.emailsentcount || 0), 0)}</strong>
              <span>Email đã gửi</span>
            </article>
          </div>
        </aside>
      </div>

      <section className="admin-content-card admin-notification-history">
        <div className="admin-subpanel-head">
          <div>
            <h3>Lịch sử thông báo</h3>
            <p>Các thông báo mới nhất trong hệ thống</p>
          </div>
          <FiUsers />
        </div>

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Loại</th>
                <th>Người nhận</th>
                <th>Đã đọc</th>
                <th>Email</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <small className="admin-notification-message-preview">{item.message}</small>
                  </td>
                  <td>{typeLabels[item.type] || item.type}</td>
                  <td>{Number(item.recipientCount || item.recipientcount || 0)}</td>
                  <td>{Number(item.readCount || item.readcount || 0)}</td>
                  <td>{Number(item.emailSentCount || item.emailsentcount || 0)}</td>
                  <td>{formatDate(item.createdAt || item.createdat)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && notifications.length === 0 && (
            <div className="admin-empty-inline">Chưa có thông báo nào.</div>
          )}
          {loading && <div className="admin-empty-inline">Đang tải thông báo...</div>}
        </div>
      </section>
    </div>
  );
}

export default AdminNotifications;
