// ============================================
// Dashboard Page
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiPlay, FiSearch, FiTrendingUp, FiAward, FiTarget } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { courseApi } from '../api/courseApi';
import { gamificationApi } from '../api/progressApi';
import Loading from '../components/common/Loading';

function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      courseApi.getAll({ page: 1, limit: 6 }).catch(() => ({ data: [] })),
      gamificationApi.getStats().catch(() => ({ data: null }))
    ]).then(([courseRes, statsRes]) => {
      setCourses(courseRes.data || []);
      setStats(statsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const quickActions = [
    { icon: <FiBook size={22} />, label: 'Courses', desc: 'Browse lessons', to: '/courses/all', color: '#6366f1' },
    { icon: <FiSearch size={22} />, label: 'Dictionary', desc: 'Look up words', to: '/dictionary', color: '#8b5cf6' },
    { icon: <FiPlay size={22} />, label: 'Games', desc: 'Play & learn', to: '/games', color: '#ec4899' },
    { icon: <FiTrendingUp size={22} />, label: 'Progress', desc: 'View stats', to: '/progress', color: '#10b981' },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
          color: 'white',
          marginBottom: 'var(--space-8)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Welcome back, {user?.username}!
          </h1>
          <p style={{ opacity: 0.85, fontSize: 'var(--font-size-lg)' }}>
            Keep up the great work. You're making amazing progress!
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <HiOutlineFire size={24} />
              <div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{stats?.StreakDays || 0}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Day Streak</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FiAward size={24} />
              <div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Lv.{stats?.Level || 1}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Level</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FiTarget size={24} />
              <div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{stats?.Exp || 0}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', opacity: 0.8 }}>Total EXP</div>
              </div>
            </div>
          </div>

          {/* EXP Progress */}
          {stats && (
            <div style={{ marginTop: 'var(--space-4)', maxWidth: 400 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: 4, opacity: 0.8 }}>
                <span>Level {stats.Level}</span>
                <span>{stats.levelProgress || 0}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)' }}>
                <div style={{
                  height: '100%', borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.8)',
                  width: `${stats.levelProgress || 0}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: -40, bottom: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }} />
      </motion.div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={action.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', cursor: 'pointer' }}>
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: `${action.color}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: action.color
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{action.label}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>{action.desc}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Courses */}
      <div>
        <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Recent Courses</h2>
          <Link to="/courses/all" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>View All →</Link>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-3">
            {courses.map((course, i) => (
              <motion.div key={course.Id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/courses/${course.Id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card">
                    <div className="badge badge-primary" style={{ marginBottom: 'var(--space-3)' }}>
                      {course.LevelName || 'All Levels'}
                    </div>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                      {course.Title}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
                      {course.Description?.substring(0, 80)}...
                    </p>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {course.LessonCount || 0} lessons
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
            <FiBook size={40} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
            <p>No courses available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
