// ============================================
// Register Page
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      padding: 'var(--space-4)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-10)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '24px',
            marginBottom: 'var(--space-4)'
          }}>E</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            Join thousands learning English
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input className="form-input" type="text" placeholder="johndoe" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} required style={{ paddingLeft: 42 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input className="form-input" type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required style={{ paddingLeft: 42 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} style={{ paddingLeft: 42 }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input className="form-input" type="password" placeholder="Repeat password" value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required style={{ paddingLeft: 42 }} />
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}
            style={{ marginTop: 'var(--space-4)' }}>
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: 'var(--space-6)',
          color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
        </p>

        <Link to="/" style={{
          display: 'block', textAlign: 'center', marginTop: 'var(--space-4)',
          fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)'
        }}>
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default Register;
