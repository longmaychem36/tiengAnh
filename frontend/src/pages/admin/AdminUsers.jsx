// ============================================
// Admin User Management — SuperAdmin Only
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiLock, FiUnlock, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); loadStats(); }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit: 15, search });
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch { toast.error('Lỗi tải danh sách'); }
    setLoading(false);
  };

  const loadStats = async () => {
    try { const res = await adminApi.getUserStats(); setStats(res.data); } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const changeRole = async (userId, role) => {
    try {
      await adminApi.updateUserRole(userId, role);
      toast.success(`Đã đổi role thành ${role}`);
      loadUsers(); loadStats();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const toggleActive = async (userId) => {
    try {
      await adminApi.toggleUserActive(userId);
      toast.success('Đã thay đổi trạng thái');
      loadUsers(); loadStats();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  const roleColors = {
    superadmin: { bg: '#fef3c7', color: '#d97706', label: '👑 SuperAdmin' },
    admin: { bg: '#dbeafe', color: '#2563eb', label: '🛡️ Admin' },
    member: { bg: '#f1f5f9', color: '#64748b', label: '👤 Member' }
  };

  return (
    <div>
      <div className="page-header">
        <h1>👥 Quản lý người dùng</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Phân quyền, khóa/mở tài khoản (Chỉ SuperAdmin)</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          {[
            { label: 'Tổng', value: stats.totalUsers, icon: '👥', color: '#6366f1' },
            { label: 'Members', value: stats.members, icon: '👤', color: '#10b981' },
            { label: 'Admins', value: stats.admins, icon: '🛡️', color: '#3b82f6' },
            { label: 'Bị khóa', value: stats.locked, icon: '🔒', color: '#ef4444' }
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="form-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên hoặc email..." style={{ paddingLeft: 36 }} />
        </div>
        <button className="btn btn-primary" type="submit">Tìm</button>
      </form>

      {/* User Table */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              <th style={thStyle}>Tên</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Level</th>
              <th style={thStyle}>EXP</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const rc = roleColors[u.Role] || roleColors.member;
              return (
                <tr key={u.Id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}><b>{u.FullName}</b></td>
                  <td style={tdStyle}><span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{u.Email}</span></td>
                  <td style={tdStyle}>
                    <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: rc.bg, color: rc.color, fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>{rc.label}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{u.Level || 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{u.Exp || 0}</td>
                  <td style={tdStyle}>
                    {u.IsActive !== false ? (
                      <span style={{ color: '#10b981', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>✅ Active</span>
                    ) : (
                      <span style={{ color: '#ef4444', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>🔒 Locked</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {/* Role change dropdown */}
                      <select value={u.Role} onChange={e => changeRole(u.Id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)', cursor: 'pointer' }}>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">SuperAdmin</option>
                      </select>
                      {/* Lock/Unlock */}
                      <button onClick={() => toggleActive(u.Id)} title={u.IsActive !== false ? 'Khóa' : 'Mở khóa'}
                        style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '4px 8px', cursor: 'pointer', color: u.IsActive !== false ? '#ef4444' : '#10b981' }}>
                        {u.IsActive !== false ? <FiLock size={14} /> : <FiUnlock size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>Không tìm thấy người dùng</div>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><FiChevronLeft /> Trước</button>
          <span style={{ padding: '8px 16px', color: 'var(--color-text-muted)' }}>Trang {page}/{totalPages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau <FiChevronRight /></button>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 16px', fontSize: 'var(--font-size-sm)' };

export default AdminUsers;
