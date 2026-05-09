// ============================================
// 404 Not Found Page
// ============================================
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 'var(--space-8)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', maxWidth: 400 }}
      >
        <div style={{
          fontSize: '120px', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-4)'
        }}>
          404
        </div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <button className="btn btn-primary btn-lg">
            Go Home
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;
