import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiKey, FiLock, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';

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

const inputWrapStyle = {
  position: 'relative'
};

const iconStyle = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--color-text-muted)'
};

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setCode('');
      setPassword('');
      setConfirmPassword('');
      setStep('reset');
      toast.success('Mã xác nhận đã được gửi đến email.');
    } catch (err) {
      toast.error(err.message || 'Không thể gửi mã xác nhận.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, password });
      setStep('done');
      toast.success('Mật khẩu đã được cập nhật.');
    } catch (err) {
      toast.error(err.message || 'Không thể đặt lại mật khẩu.');
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
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>
            {step === 'done' ? 'Đã cập nhật mật khẩu' : 'Đặt lại mật khẩu'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            {step === 'email'
              ? 'Nhập email tài khoản để nhận mã xác nhận.'
              : step === 'reset'
                ? 'Nhập mã trong email và chọn mật khẩu mới.'
                : 'Bạn có thể đăng nhập bằng mật khẩu mới.'}
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={requestCode} autoComplete="off">
            <div className="form-group">
              <span className="form-label">Email</span>
              <div style={inputWrapStyle}>
                <FiMail style={iconStyle} />
                <input
                  aria-label="Email"
                  className="form-input"
                  type="email"
                  autoComplete="email"
                  placeholder="tenban@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
              {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              {!loading && <FiArrowRight />}
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={resetPassword} autoComplete="off">
            <div className="form-group">
              <span className="form-label">Mã xác nhận</span>
              <div style={inputWrapStyle}>
                <FiKey style={iconStyle} />
                <input
                  aria-label="Verification code"
                  className="form-input"
                  type="text"
                  name="reset_verification_code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  style={{ paddingLeft: 42, letterSpacing: 4, fontWeight: 800 }}
                />
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Mật khẩu mới</span>
              <div style={inputWrapStyle}>
                <FiLock style={iconStyle} />
                <input
                  aria-label="New password"
                  className="form-input"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Xác nhận mật khẩu</span>
              <div style={inputWrapStyle}>
                <FiLock style={iconStyle} />
                <input
                  aria-label="Confirm password"
                  className="form-input"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
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
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              {!loading && <FiArrowRight />}
            </button>

            <button
              className="btn btn-secondary btn-lg w-full"
              type="button"
              disabled={loading}
              onClick={requestCode}
              style={{ marginTop: 'var(--space-3)' }}
            >
              Gửi lại mã
            </button>
          </form>
        )}

        {step === 'done' && (
          <Link
            to="/login"
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: 'var(--space-4)', background: 'linear-gradient(135deg, #1cb0f6, #58cc02)' }}
          >
            Về trang đăng nhập
            <FiArrowRight />
          </Link>
        )}

        <Link
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 'var(--space-6)',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-sm)'
          }}
        >
          <FiArrowLeft /> Về trang đăng nhập
        </Link>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
