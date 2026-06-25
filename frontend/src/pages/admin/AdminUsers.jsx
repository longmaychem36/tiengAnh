// ============================================
// Admin User Management
// ============================================
import { useEffect, useMemo, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
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
  role: 'admin',
  isActive: true,
  plan: 'free',
  onboardingCompleted: false,
  placementLevel: ''
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

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function normalizeUserForForm(user) {
  return {
    id: getUserId(user),
    username: getField(user, 'Username', 'username') || '',
    email: getField(user, 'Email', 'email') || '',
    role: getField(user, 'Role', 'role') || 'user',
    isActive: getField(user, 'IsActive', 'isactive') !== false,
    plan: getField(user, 'Plan', 'plan') || 'free',
    onboardingCompleted: Boolean(getField(user, 'OnboardingCompleted', 'onboardingcompleted')),
    placementLevel: getField(user, 'PlacementLevel', 'placementlevel') || ''
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

function UserTable({ title, icon, users, loading, currentUserId, showLearnerColumns = false, onEdit, onToggle, onResetPassword, onDelete }) {
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
              {showLearnerColumns && <th>Placement</th>}
              <th>Login cuối</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
              const id = getUserId(item);
              const role = getField(item, 'Role', 'role') || 'user';
              const colors = roleColors[role] || roleColors.user;
              const isActive = getField(item, 'IsActive', 'isactive') !== false;
              const isSelf = id === String(currentUserId || '');

              return (
                <tr key={id}>
                  <td><strong>{getField(item, 'Username', 'username') || 'Chưa có tên'}</strong></td>
                  <td>{getField(item, 'Email', 'email')}</td>
                  <td>
                    <span className="admin-role-chip" style={{ background: colors.bg, color: colors.color }}>
                      {roleLabels[role] || role}
                    </span>
                  </td>
                  {showLearnerColumns && <td>{getField(item, 'Plan', 'plan') || 'free'}</td>}
                  {showLearnerColumns && <td>{getField(item, 'PlacementLevel', 'placementlevel') || '-'}</td>}
                  <td>{formatDate(getField(item, 'LastLogin', 'lastlogin'))}</td>
                  <td>
                    <span className={`admin-status-chip ${isActive ? 'is-active' : 'is-locked'}`}>
                      {isActive ? 'Active' : 'Locked'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-inline-actions admin-user-row-actions">
                      <button type="button" className="btn btn-icon btn-sm" title="Sửa" aria-label="Sửa account" onClick={() => onEdit(item)}>
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
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [learners, setLearners] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    loadAll();
  }, [page]);

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

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editForm?.id) return;
    setSaving(true);
    try {
      const isLearner = editForm.role === 'user';
      await adminApi.updateUser(editForm.id, {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        isActive: editForm.isActive,
        plan: isLearner ? editForm.plan : 'free',
        onboardingCompleted: isLearner ? editForm.onboardingCompleted : true,
        placementLevel: isLearner ? editForm.placementLevel || null : null
      });
      toast.success('Đã cập nhật account');
      closeEdit();
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không cập nhật được account'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (userId) => {
    try {
      await adminApi.toggleUserActive(userId);
      toast.success('Đã cập nhật trạng thái account');
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không cập nhật được trạng thái'));
    }
  };

  const openResetPassword = (target) => {
    const role = getField(target, 'Role', 'role') || 'user';
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
          <form className="admin-modal-panel" onSubmit={saveEdit}>
            <div className="admin-subpanel-head">
              <div>
                <h3>Sửa account</h3>
                <p>{getField(editingUser, 'Email', 'email')}</p>
              </div>
              <button type="button" className="btn btn-icon" onClick={closeEdit}><FiX /></button>
            </div>
            <div className="admin-form-grid">
              <label><span>Username</span><input className="form-input" value={editForm.username} onChange={(e) => updateEditForm('username', e.target.value)} required /></label>
              <label><span>Email</span><input className="form-input" type="email" value={editForm.email} onChange={(e) => updateEditForm('email', e.target.value)} required /></label>
              {editForm.role === 'user' && (
                <>
                  <label><span>Plan</span><select className="form-input" value={editForm.plan} onChange={(e) => updateEditForm('plan', e.target.value)}><option value="free">Free</option><option value="plus">Plus</option></select></label>
                  <label><span>Placement</span><select className="form-input" value={editForm.placementLevel} onChange={(e) => updateEditForm('placementLevel', e.target.value)}><option value="">Chưa đặt</option><option value="new">New</option><option value="basic">Basic</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
                  <label className="admin-check-row"><input type="checkbox" checked={editForm.onboardingCompleted} onChange={(e) => updateEditForm('onboardingCompleted', e.target.checked)} /> Đã onboarding</label>
                </>
              )}
              <label className="admin-check-row"><input type="checkbox" checked={editForm.isActive} onChange={(e) => updateEditForm('isActive', e.target.checked)} /> Active</label>
              <div className="admin-form-actions is-wide">
                <button type="submit" className="btn btn-primary" disabled={saving}>Lưu</button>
                <button type="button" className="btn btn-ghost" onClick={closeEdit}>Hủy</button>
              </div>
            </div>
          </form>
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
