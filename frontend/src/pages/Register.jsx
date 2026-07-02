import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const authShellStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at 14% 16%, rgba(28, 176, 246, 0.22), transparent 28rem), radial-gradient(circle at 86% 18%, rgba(88, 204, 2, 0.2), transparent 26rem), radial-gradient(circle at 52% 92%, rgba(255, 200, 0, 0.2), transparent 22rem), linear-gradient(180deg, #fbfeff 0%, #eefaff 52%, #f7fff0 100%)',
  padding: 'var(--space-4)'
};

const authCardStyle = {
  width: '100%',
  maxWidth: 430,
  background: 'rgba(255, 255, 255, 0.94)',
  borderRadius: 'var(--radius-2xl)',
  padding: 'var(--space-10)',
  border: '1px solid rgba(216, 237, 248, 0.95)',
  boxShadow: '0 28px 70px rgba(28, 176, 246, 0.16)'
};

const brandMarkStyle = {
  width: 56,
  height: 56,
  borderRadius: 'var(--radius-xl)',
  background: 'linear-gradient(135deg, #1cb0f6, #58cc02)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 800,
  fontSize: '24px',
  marginBottom: 'var(--space-4)',
  boxShadow: '0 12px 24px rgba(28, 176, 246, 0.22)'
};

const iconStyle = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--color-text-muted)'
};

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const userData = await register({ username: form.username, email: form.email, password: form.password });
      toast.success('Tạo tài khoản thành công.');
      navigate(userData.onboardingCompleted === false ? '/onboarding' : '/dashboard');
    } catch (err) {
      toast.error(err.message || 'Không thể tạo tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={authShellStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={authCardStyle}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={brandMarkStyle}>L</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Tạo tài khoản</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            Bắt đầu quá trình học tiếng Anh ngay hôm nay
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <span className="form-label">Tên người dùng</span>
            <div style={{ position: 'relative' }}>
              <FiUser style={iconStyle} />
              <input
                aria-label="Username"
                className="form-input"
                type="text"
                placeholder="nguyenvana"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Email</span>
            <div style={{ position: 'relative' }}>
              <FiMail style={iconStyle} />
              <input
                aria-label="Email"
                className="form-input"
                type="email"
                placeholder="tenban@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Mật khẩu</span>
            <div style={{ position: 'relative' }}>
              <FiLock style={iconStyle} />
              <input
                aria-label="Password"
                className="form-input"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Xác nhận mật khẩu</span>
            <div style={{ position: 'relative' }}>
              <FiLock style={iconStyle} />
              <input
                aria-label="Confirm Password"
                className="form-input"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg w-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 'var(--space-4)', background: 'linear-gradient(135deg, #1cb0f6, #58cc02)', boxShadow: '0 12px 24px rgba(28, 176, 246, 0.24)' }}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: 'var(--space-6)',
          color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)'
        }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
