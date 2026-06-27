// ============================================
// Admin User Management
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiGift,
  FiLock,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUnlock,
  FiUserPlus,
  FiUsers,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../hooks/useAuth';

const initialAccountForm = {
  username: '',
  email: '',
  password: '',
  isActive: true
};

const roleLabels = {
  user: 'Learner',
  admin: 'Admin'
};

const roleColors = {
  user: { bg: '#f1f5f9', color: '#475569' },
  admin: { bg: '#dbeafe', color: '#1d4ed8' }
};

function getErrorMessage(err, fallback) {
  return err?.message || err?.errors?.[0]?.msg || fallback;
}

function getField(row, ...keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }
  return undefined;
}

function getNumberField(row, ...keys) {
  return Number(getField(row, ...keys) || 0);
}

function getUserId(row) {
  return String(getField(row, 'Id', 'id') || '');
}

function getRole(row) {
  return String(getField(row, 'Role', 'role') || 'user').toLowerCase();
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function formatPlusDays(row) {
  const plan = String(getField(row, 'Plan', 'plan') || 'free').toLowerCase();
  if (plan !== 'plus') return '-';
  const days = Number(getField(row, 'PlusDaysRemaining', 'plusdaysremaining') || 0);
  return days > 0 ? `${days} ngày` : 'Hết hạn';
}

function formatPlacement(row) {
  return getField(row, 'PlacementLevel', 'placementlevel') || '-';
}

function normalizeUserForForm(user) {
  return {
    id: getUserId(user),
    username: getField(user, 'Username', 'username') || '',
    email: getField(user, 'Email', 'email') || '',
    role: getRole(user),
    plusDaysToAdd: '',
    raw: user
  };
}

function MetricCard({ label, value, tone }) {
  return (
    <article className="admin-stat-card admin-user-stat-card">
      <strong style={{ color: tone }}>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function UserTable({
  title,
  icon,
  users,
  loading,
  currentUserId,
  showLearnerColumns = false,
  onEdit,
  onOpenLearner,
  onToggle,
  onResetPassword,
  onDelete
}) {
  return (
    <section className="admin-content-card admin-users-list-panel">
      <div className="admin-subpanel-head">
        <div>
          <h3>{title}</h3>
        </div>
        {icon}
      </div>

      <div className="admin-table-wrap admin-users-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
              {showLearnerColumns && <th>Plan</th>}
              {showLearnerColumns && <th>Plus còn lại</th>}
              {showLearnerColumns && <th>Placement</th>}
              <th>Login cuối</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
              const id = getUserId(item);
              const role = getRole(item);
              const colors = roleColors[role] || roleColors.user;
              const isActive = getField(item, 'IsActive', 'isactive') !== false;
              const isSelf = id === String(currentUserId || '');

              return (
                <tr key={id}>
                  <td>
                    {role === 'user' ? (
                      <button type="button" className="admin-user-name-link" onClick={() => onOpenLearner(item)}>
                        {getField(item, 'Username', 'username') || 'Chưa có tên'}
                      </button>
                    ) : <strong>{getField(item, 'Username', 'username') || 'Chưa có tên'}</strong>}
                  </td>
                  <td>{getField(item, 'Email', 'email')}</td>
                  <td>
                    <span className="admin-role-chip" style={{ background: colors.bg, color: colors.color }}>
                      {roleLabels[role] || role}
                    </span>
                  </td>
                  {showLearnerColumns && <td>{getField(item, 'Plan', 'plan') || 'free'}</td>}
                  {showLearnerColumns && <td>{formatPlusDays(item)}</td>}
                  {showLearnerColumns && <td>{formatPlacement(item)}</td>}
                  <td>{formatDate(getField(item, 'LastLogin', 'lastlogin'))}</td>
                  <td>
                    <span className={`admin-status-chip ${isActive ? 'is-active' : 'is-locked'}`}>
                      {isActive ? 'Active' : 'Locked'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-inline-actions admin-user-row-actions">
                      <button type="button" className="btn btn-icon btn-sm" title="Chi tiết" aria-label="Chi tiết account" onClick={() => role === 'user' ? onOpenLearner(item) : onEdit(item)}>
                        <FiEdit2 />
                      </button>
                      {role === 'admin' && (
                        <button type="button" className="btn btn-icon btn-sm" title="Đổi mật khẩu" aria-label="Đổi mật khẩu" onClick={() => onResetPassword(item)}>
                          <FiRefreshCw />
                        </button>
                      )}
                      <button type="button" className="btn btn-icon btn-sm" title={isActive ? 'Khóa' : 'Mở khóa'} aria-label={isActive ? 'Khóa account' : 'Mở khóa account'} disabled={isSelf} onClick={() => onToggle(id)}>
                        {isActive ? <FiLock /> : <FiUnlock />}
                      </button>
                      <button type="button" className="btn btn-icon btn-sm is-danger" title="Xóa" aria-label="Xóa account" disabled={isSelf} onClick={() => onDelete(item)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && users.length === 0 && <div className="admin-empty-inline">Không có account phù hợp.</div>}
        {loading && <div className="admin-empty-inline">Đang tải danh sách account...</div>}
      </div>
    </section>
  );
}

function AdminUsers() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [learners, setLearners] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [giftingPlus, setGiftingPlus] = useState(false);
  const [accountForm, setAccountForm] = useState(initialAccountForm);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [resetPassword, setResetPassword] = useState('');

  const statCards = useMemo(() => ([
    { label: 'Tổng account', value: getNumberField(stats, 'totalUsers', 'totalusers'), color: '#171717' },
    { label: 'Learners', value: getNumberField(stats, 'members'), color: '#0f766e' },
    { label: 'Admins', value: getNumberField(stats, 'admins'), color: '#2563eb' },
    { label: 'Plus', value: getNumberField(stats, 'plusUsers', 'plususers'), color: '#7c3aed' },
    { label: 'Bị khóa', value: getNumberField(stats, 'locked'), color: '#a13b4b' },
    { label: 'Tạo mới 7 ngày', value: getNumberField(stats, 'newUsers7d', 'newusers7d'), color: '#b45309' }
  ]), [stats]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [adminRes, learnerRes, statsRes] = await Promise.all([
        adminApi.getUsers({ page: 1, limit: 100, role: 'admin', search }),
        adminApi.getUsers({ page, limit: 15, role: 'user', search }),
        adminApi.getUserStats()
      ]);
      setAdmins(adminRes.data.users || []);
      setLearners(learnerRes.data.users || []);
      setTotalPages(learnerRes.data.totalPages || 1);
      setStats(statsRes.data || {});
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được danh sách account'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (page === 1) loadAll();
    else setPage(1);
  };

  const updateAccountForm = (field, value) => {
    setAccountForm((current) => ({ ...current, [field]: value }));
  };

  const updateEditForm = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createUser({
        username: accountForm.username.trim(),
        email: accountForm.email.trim(),
        password: accountForm.password,
        role: 'admin',
        isActive: accountForm.isActive
      });
      toast.success('Đã tạo account');
      setAccountForm(initialAccountForm);
      setPage(1);
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tạo được account'));
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (target) => {
    setEditingUser(target);
    setEditForm(normalizeUserForForm(target));
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditForm(null);
  };

  const submitInlinePlusGift = async () => {
    if (!editForm?.id || editForm.role !== 'user') return;
    const days = Math.floor(Number(editForm.plusDaysToAdd));
    if (!Number.isFinite(days) || days < 1) {
      toast.error('Số ngày Plus phải lớn hơn 0');
      return;
    }

    setGiftingPlus(true);
    try {
      const res = await adminApi.giftPlusDays(editForm.id, days);
      toast.success(`Đã tặng thêm ${days} ngày Plus`);
      setEditForm((current) => ({
        ...current,
        plusDaysToAdd: '',
        raw: { ...current.raw, ...(res.data || {}) }
      }));
      setEditingUser((current) => ({ ...current, ...(res.data || {}) }));
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tặng được ngày Plus'));
    } finally {
      setGiftingPlus(false);
    }
  };

  const toggleActive = async (userId) => {
    try {
      const res = await adminApi.toggleUserActive(userId);
      const updated = res.data;
      if (updated) {
        const mergeUser = (item) => (getUserId(item) === String(userId) ? { ...item, ...updated } : item);
        setAdmins((current) => current.map(mergeUser));
        setLearners((current) => current.map(mergeUser));
      }
      toast.success('Đã cập nhật trạng thái account');
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không cập nhật được trạng thái'));
    }
  };

  const openResetPassword = (target) => {
    const role = getRole(target);
    if (role !== 'admin') {
      toast.error('Không thể đổi mật khẩu learner từ trang admin');
      return;
    }
    setResetTarget(target);
    setResetPassword('');
  };

  const submitResetPassword = async (e) => {
    e.preventDefault();
    if (!resetTarget) return;
    try {
      await adminApi.resetUserPassword(getUserId(resetTarget), resetPassword);
      toast.success('Đã đổi mật khẩu');
      setResetTarget(null);
      setResetPassword('');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không đổi được mật khẩu'));
    }
  };

  const deleteAccount = async (target) => {
    const name = getField(target, 'Email', 'email') || getField(target, 'Username', 'username');
    if (!window.confirm(`Xóa account ${name}? Hành động này sẽ xóa cả tiến độ liên quan.`)) return;
    try {
      await adminApi.deleteUser(getUserId(target));
      toast.success('Đã xóa account');
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không xóa được account'));
    }
  };

  return (
    <div className="admin-users-page">
      <div className="admin-receptive-header">
        <div>
          <h1>Quản lý account</h1>
        </div>
      </div>

      {stats && (
        <section className="admin-user-stat-grid" aria-label="Thống kê account">
          {statCards.map((item) => <MetricCard key={item.label} label={item.label} value={item.value} tone={item.color} />)}
        </section>
      )}

      <section className="admin-content-card admin-create-account-panel">
        <div className="admin-subpanel-head">
          <div>
            <h3>Tạo account admin</h3>
          </div>
          <FiUserPlus />
        </div>

        <form className="admin-form-grid" onSubmit={createAccount}>
          <label>
            <span>Username</span>
            <input className="form-input" value={accountForm.username} onChange={(e) => updateAccountForm('username', e.target.value)} placeholder="teacher01" required />
          </label>
          <label>
            <span>Email</span>
            <input className="form-input" type="email" value={accountForm.email} onChange={(e) => updateAccountForm('email', e.target.value)} placeholder="teacher01@example.com" required />
          </label>
          <label>
            <span>Mật khẩu tạm thời</span>
            <input className="form-input" type="password" value={accountForm.password} onChange={(e) => updateAccountForm('password', e.target.value)} minLength={6} placeholder="Ít nhất 6 ký tự" required />
          </label>
          <label className="admin-check-row">
            <input type="checkbox" checked={accountForm.isActive} onChange={(e) => updateAccountForm('isActive', e.target.checked)} />
            Active
          </label>
          <div className="admin-form-actions is-wide">
            <button className="btn btn-primary" type="submit" disabled={creating}>
              <FiUserPlus /> {creating ? 'Đang tạo...' : 'Tạo account'}
            </button>
          </div>
        </form>
      </section>

      <form className="admin-user-search admin-content-card" onSubmit={handleSearch}>
        <div className="admin-user-search-input">
          <FiSearch />
          <input aria-label="Tìm account" className="form-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo username hoặc email..." />
        </div>
        <button className="btn btn-primary" type="submit">Tìm</button>
      </form>

      <UserTable
        title="Danh sách admin"
        icon={<FiShield />}
        users={admins}
        loading={loading}
        currentUserId={currentUser?.id}
        onEdit={openEdit}
        onOpenLearner={(item) => navigate(`/admin/users/${getUserId(item)}`)}
        onToggle={toggleActive}
        onResetPassword={openResetPassword}
        onDelete={deleteAccount}
      />

      <UserTable
        title="Danh sách learner"
        icon={<FiUsers />}
        users={learners}
        loading={loading}
        currentUserId={currentUser?.id}
        showLearnerColumns
        onEdit={openEdit}
        onOpenLearner={(item) => navigate(`/admin/users/${getUserId(item)}`)}
        onToggle={toggleActive}
        onResetPassword={openResetPassword}
        onDelete={deleteAccount}
      />

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            <FiChevronLeft /> Trước
          </button>
          <span>Trang learner {page}/{totalPages}</span>
          <button type="button" className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
            Sau <FiChevronRight />
          </button>
        </div>
      )}

      {editingUser && editForm && (
        <div className="admin-modal-backdrop" role="presentation">
          <div className="admin-modal-panel">
            <div className="admin-subpanel-head">
              <div>
                <h3>Chi tiết account</h3>
                <p>{getField(editingUser, 'Email', 'email')}</p>
              </div>
              <button type="button" className="btn btn-icon" onClick={closeEdit}><FiX /></button>
            </div>

            <div className="admin-form-grid">
              <div className="admin-account-detail-grid is-wide">
                <section className="admin-account-detail-card">
                  <span>Username</span>
                  <strong>{editForm.username || '-'}</strong>
                  <small>Định danh đăng nhập, không chỉnh sửa từ trang admin.</small>
                </section>
                <section className="admin-account-detail-card">
                  <span>Email</span>
                  <strong>{editForm.email || '-'}</strong>
                  <small>Email tài khoản, chỉ người dùng tự thay đổi trong hồ sơ.</small>
                </section>
              </div>

              {editForm.role === 'user' && (
                <>
                  <div className="admin-account-detail-grid is-wide">
                    <section className="admin-account-detail-card">
                      <span>Gói học tập</span>
                      <strong>{String(getField(editForm.raw, 'Plan', 'plan') || 'free').toUpperCase()}</strong>
                      <small>
                        {String(getField(editForm.raw, 'Plan', 'plan') || 'free').toLowerCase() === 'plus'
                          ? `Còn lại ${formatPlusDays(editForm.raw)} · Hết hạn ${formatDate(getField(editForm.raw, 'PlusExpiresAt', 'plusexpiresat'))}`
                          : 'Chưa kích hoạt Plus'}
                      </small>
                    </section>
                    <section className="admin-account-detail-card">
                      <span>Trình độ đầu vào</span>
                      <strong>{formatPlacement(editForm.raw)}</strong>
                      <small>{getField(editForm.raw, 'OnboardingCompleted', 'onboardingcompleted') ? 'Đã hoàn tất onboarding' : 'Chưa hoàn tất onboarding'}</small>
                    </section>
                  </div>
                  <div className="admin-plus-gift-box is-wide">
                    <div>
                      <strong>Tặng thêm Plus</strong>
                      <span>Số ngày nhập vào sẽ được cộng vào hạn Plus hiện tại.</span>
                    </div>
                    <input className="form-input" type="number" min="1" max="3650" value={editForm.plusDaysToAdd} onChange={(e) => updateEditForm('plusDaysToAdd', e.target.value)} placeholder="30" />
                    <button type="button" className="btn btn-secondary" disabled={giftingPlus || !editForm.plusDaysToAdd} onClick={submitInlinePlusGift}>
                      <FiGift /> {giftingPlus ? 'Đang tặng...' : 'Tặng Plus'}
                    </button>
                  </div>
                </>
              )}

              <div className="admin-form-actions is-wide">
                <button type="button" className="btn btn-ghost" onClick={closeEdit}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {resetTarget && (
        <div className="admin-modal-backdrop" role="presentation">
          <form className="admin-modal-panel admin-small-modal" onSubmit={submitResetPassword}>
            <div className="admin-subpanel-head">
              <div>
                <h3>Reset mật khẩu</h3>
                <p>{getField(resetTarget, 'Email', 'email')}</p>
              </div>
              <button type="button" className="btn btn-icon" onClick={() => setResetTarget(null)}><FiX /></button>
            </div>
            <div className="admin-form-grid">
              <label className="is-wide">
                <span>Mật khẩu mới</span>
                <input className="form-input" type="password" minLength={6} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} required />
              </label>
              <div className="admin-form-actions is-wide">
                <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
                <button type="button" className="btn btn-ghost" onClick={() => setResetTarget(null)}>Hủy</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
