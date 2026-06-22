// ============================================
// Admin User Management - Admin
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiLock, FiSearch, FiUnlock, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

const initialAccountForm = {
  username: '',
  email: '',
  password: '',
  role: 'user',
};

const roleLabels = {
  user: 'Learner',
  admin: 'Admin',
};

const roleColors = {
  user: { bg: '#f1f5f9', color: '#475569' },
  admin: { bg: '#dbeafe', color: '#1d4ed8' },
};

function getErrorMessage(err, fallback) {
  return err?.message || err?.errors?.[0]?.msg || fallback;
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [accountForm, setAccountForm] = useState(initialAccountForm);

  const statCards = useMemo(() => ([
    { label: 'Tổng account', value: stats?.totalUsers || 0, color: '#171717' },
    { label: 'Learners', value: stats?.members || 0, color: '#0f766e' },
    { label: 'Admins', value: stats?.admins || 0, color: '#2563eb' },
    { label: 'Bị khóa', value: stats?.locked || 0, color: '#a13b4b' },
  ]), [stats]);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit: 15, search });
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được danh sách account'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await adminApi.getUserStats();
      setStats(res.data);
    } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (page === 1) {
      loadUsers();
      return;
    }
    setPage(1);
  };

  const updateAccountForm = (field, value) => {
    setAccountForm((current) => ({ ...current, [field]: value }));
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createUser({
        username: accountForm.username.trim(),
        email: accountForm.email.trim(),
        password: accountForm.password,
        role: accountForm.role,
      });
      toast.success('Đã tạo account');
      setAccountForm(initialAccountForm);
      if (page !== 1) {
        setPage(1);
        await loadStats();
      } else {
        await Promise.all([loadUsers(), loadStats()]);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tạo được account'));
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (userId) => {
    try {
      await adminApi.toggleUserActive(userId);
      toast.success('Đã cập nhật trạng thái account');
      loadUsers();
      loadStats();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không cập nhật được trạng thái'));
    }
  };

  return (
    <div className="admin-users-page">
      <div className="admin-receptive-header">
        <div>
          <h1>Quản lý account</h1>
          <p>Admin tạo account mới tại đây. Role của user hiện có không chỉnh trực tiếp trong danh sách.</p>
        </div>
      </div>

      {stats && (
        <section className="admin-user-stat-grid" aria-label="Thống kê account">
          {statCards.map((item) => (
            <article key={item.label} className="admin-stat-card admin-user-stat-card">
              <strong style={{ color: item.color }}>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>
      )}

      <section className="admin-content-card admin-create-account-panel">
        <div className="admin-subpanel-head">
          <div>
            <h3>Tạo account</h3>
            <p>Chọn role ngay khi tạo. Nếu cần đổi role sau này, hãy tạo account đúng role thay vì sửa user đang tồn tại.</p>
          </div>
          <FiUserPlus />
        </div>

        <form className="admin-form-grid" onSubmit={createAccount}>
          <label>
            <span>Username</span>
            <input
              className="form-input"
              value={accountForm.username}
              onChange={(e) => updateAccountForm('username', e.target.value)}
              placeholder="teacher01"
              required
            />
          </label>

          <label>
            <span>Email</span>
            <input
              className="form-input"
              type="email"
              value={accountForm.email}
              onChange={(e) => updateAccountForm('email', e.target.value)}
              placeholder="teacher01@example.com"
              required
            />
          </label>

          <label>
            <span>Mật khẩu tạm thời</span>
            <input
              className="form-input"
              type="password"
              value={accountForm.password}
              onChange={(e) => updateAccountForm('password', e.target.value)}
              minLength={6}
              placeholder="Ít nhất 6 ký tự"
              required
            />
          </label>

          <label>
            <span>Role</span>
            <select
              className="form-input"
              value={accountForm.role}
              onChange={(e) => updateAccountForm('role', e.target.value)}
            >
              <option value="user">Learner</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="admin-form-actions is-wide">
            <button className="btn btn-primary" type="submit" disabled={creating}>
              <FiUserPlus />
              {creating ? 'Đang tạo...' : 'Tạo account'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-content-card admin-users-list-panel">
        <div className="admin-subpanel-head">
          <div>
            <h3>Danh sách account</h3>
            <p>Tìm account và khóa/mở khi cần. Role chỉ hiển thị để kiểm tra.</p>
          </div>
        </div>

        <form className="admin-user-search" onSubmit={handleSearch}>
          <div className="admin-user-search-input">
            <FiSearch />
            <input
              aria-label="Tìm account"
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo username hoặc email..."
            />
          </div>
          <button className="btn btn-primary" type="submit">Tìm</button>
        </form>

        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Role</th>
                <th>Level</th>
                <th>EXP</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const role = user.Role || 'user';
                const colors = roleColors[role] || roleColors.user;
                const isActive = user.IsActive !== false;

                return (
                  <tr key={user.Id}>
                    <td>
                      <strong>{user.Username || 'Chưa có tên'}</strong>
                    </td>
                    <td>
                      <span>{user.Email}</span>
                    </td>
                    <td>
                      <span className="admin-role-chip" style={{ background: colors.bg, color: colors.color }}>
                        {roleLabels[role] || role}
                      </span>
                    </td>
                    <td>{user.Level || 1}</td>
                    <td>{user.Exp || 0}</td>
                    <td>
                      <span className={`admin-status-chip ${isActive ? 'is-active' : 'is-locked'}`}>
                        {isActive ? 'Active' : 'Locked'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => toggleActive(user.Id)}
                      >
                        {isActive ? <FiLock /> : <FiUnlock />}
                        {isActive ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && users.length === 0 && (
            <div className="admin-empty-inline">Không tìm thấy account.</div>
          )}

          {loading && (
            <div className="admin-empty-inline">Đang tải danh sách account...</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              <FiChevronLeft />
              Trước
            </button>
            <span>Trang {page}/{totalPages}</span>
            <button type="button" className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
              Sau
              <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminUsers;
