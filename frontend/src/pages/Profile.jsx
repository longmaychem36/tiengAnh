// ============================================
// Profile Page
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiAward, FiSave } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/userApi';
import toast from 'react-hot-toast';

function Profile() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.update(user.id, { username });
      updateUser({ ...user, username: res.data?.Username || username });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <h1>👤 Profile</h1>
        <p>Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '32px',
            flexShrink: 0
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{user?.username}</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <span className="badge badge-primary">{user?.role}</span>
              {user?.level && <span className="badge badge-success">{user.level.name}</span>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)',
          padding: 'var(--space-4)',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
              {user?.stats?.exp || 0}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Total EXP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-secondary)' }}>
              Lv.{user?.stats?.gameLevel || 1}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Level</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <HiOutlineFire size={24} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-accent)' }}>
                {user?.stats?.streakDays || 0}
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Day Streak</div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" value={username}
              onChange={e => setUsername(e.target.value)} required minLength={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={user?.email || ''} disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <p className="form-error" style={{ color: 'var(--color-text-muted)' }}>Email cannot be changed</p>
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            <FiSave size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Profile;
