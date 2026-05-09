// ============================================
// Home Page — Landing Page (Public)
// ============================================
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiSearch, FiPlay, FiAward, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const features = [
  { icon: <FiBook size={28} />, title: 'Interactive Courses', desc: 'Learn English with structured courses and engaging lessons', color: '#6366f1' },
  { icon: <FiSearch size={28} />, title: 'EN-VI Dictionary', desc: 'Comprehensive English-Vietnamese dictionary with audio pronunciation', color: '#8b5cf6' },
  { icon: <FiPlay size={28} />, title: 'Mini Games', desc: 'Practice with fun listening, matching, and sentence games', color: '#ec4899' },
  { icon: <FiAward size={28} />, title: 'Gamification', desc: 'Earn EXP, level up, maintain streaks, and unlock achievements', color: '#f59e0b' }
];

function Home() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        position: 'relative',
        padding: 'var(--space-8)'
      }}>
        {/* Animated background shapes */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute', width: 400, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            top: '-10%', right: '-5%',
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute', width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            bottom: '10%', left: '-5%',
            animation: 'float 8s ease-in-out infinite 1s'
          }} />
          <div style={{
            position: 'absolute', width: 200, height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
            top: '40%', left: '30%',
            animation: 'float 7s ease-in-out infinite 0.5s'
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', maxWidth: 700, position: 'relative', zIndex: 1 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
            marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)',
            color: '#a5b4fc'
          }}>
            Start your English journey today
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800, lineHeight: 1.1,
            color: 'white', marginBottom: 'var(--space-6)'
          }}>
            Master English with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Interactive Learning
            </span>
          </h1>

          <p style={{
            fontSize: 'var(--font-size-lg)', color: '#94a3b8',
            marginBottom: 'var(--space-10)', maxWidth: 500, margin: '0 auto var(--space-10)'
          }}>
            Courses, dictionary, mini games, and gamification — everything you need
            to learn English effectively.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/dashboard' : '/register'}>
              <button className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <FiArrowRight />
              </button>
            </Link>
            {!user && (
              <Link to="/login">
                <button className="btn btn-lg" style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '1rem'
                }}>
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{
        padding: 'var(--space-24) var(--space-8)',
        background: 'var(--color-bg)',
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            Everything you need to learn English
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-12)' }}>
            A comprehensive platform designed for Vietnamese learners
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-6)',
          maxWidth: 1100, margin: '0 auto'
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card"
              style={{ textAlign: 'left', cursor: 'default' }}
            >
              <div style={{
                width: 56, height: 56,
                borderRadius: 'var(--radius-xl)',
                background: `${f.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color, marginBottom: 'var(--space-4)'
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: 'var(--space-8)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)'
      }}>
        © {new Date().getFullYear()} English Learning System. Built for Vietnamese learners.
      </footer>
    </div>
  );
}

export default Home;
