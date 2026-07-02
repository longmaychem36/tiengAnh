import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
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

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const goAfterLogin = (userData) => {
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate(userData.onboardingCompleted === false ? '/onboarding' : '/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      const userData = await login(form);
      toast.success('Đăng nhập thành công.');
      goAfterLogin(userData);
    } catch (err) {
      toast.error(err.message || 'Không thể đăng nhập.');
    } finally {
      submittingRef.current = false;
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
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Chào mừng bạn trở lại</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            Đăng nhập để tiếp tục quá trình học tiếng Anh
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <span className="form-label">Email</span>
            <div style={{ position: 'relative' }}>
              <FiMail style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} />
              <input
                aria-label="Email"
                className="form-input"
                type="email"
                placeholder="tenban@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Mật khẩu</span>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} />
              <input
                aria-label="Password"
                className="form-input"
                type="password"
                placeholder="********"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <Link to="/forgot-password" style={{ display: 'block', width: 'fit-content', margin: '-6px 0 var(--space-4) auto', fontSize: 'var(--font-size-sm)', fontWeight: 800, color: '#0d8ecf' }}>
            Quên mật khẩu?
          </Link>

          <button
            className="btn btn-primary btn-lg w-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: 'var(--space-4)', background: 'linear-gradient(135deg, #1cb0f6, #58cc02)', boxShadow: '0 12px 24px rgba(28, 176, 246, 0.24)' }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: 'var(--space-6)',
          color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)'
        }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Đăng ký</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

