// ============================================
// Progress Page
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiCheckCircle, FiTarget, FiPlay } from 'react-icons/fi';
import { progressApi, gamificationApi } from '../api/progressApi';
import Loading from '../components/common/Loading';
import { calcPercentage } from '../utils/helpers';

function Progress() {
  const [overall, setOverall] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      progressApi.getOverall().catch(() => ({ data: null })),
      gamificationApi.getMyAchievements().catch(() => ({ data: [] }))
    ]).then(([progressRes, achieveRes]) => {
      setOverall(progressRes.data);
      setAchievements(achieveRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const stats = [
    {
      icon: <FiBook size={24} />,
      label: 'Lessons Completed',
      value: overall?.CompletedLessons || 0,
      total: overall?.TotalLessons || 0,
      color: '#6366f1'
    },
    {
      icon: <FiCheckCircle size={24} />,
      label: 'Words Mastered',
      value: overall?.MasteredVocab || 0,
      total: overall?.TotalVocab || 0,
      color: '#10b981'
    },
    {
      icon: <FiPlay size={24} />,
      label: 'Games Played',
      value: overall?.GamesPlayed || 0,
      total: null,
      color: '#ec4899'
    },
    {
      icon: <FiTarget size={24} />,
      label: 'Average Score',
      value: `${overall?.AvgScore || 0}%`,
      total: null,
      color: '#f59e0b'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>📊 Learning Progress</h1>
        <p>Track your journey and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52,
                borderRadius: 'var(--radius-xl)',
                background: `${stat.color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
                margin: '0 auto var(--space-3)'
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {stat.label}
              </div>
              {stat.total !== null && (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-bar-fill" style={{
                      width: `${calcPercentage(typeof stat.value === 'number' ? stat.value : 0, stat.total)}%`,
                      background: stat.color
                    }} />
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {typeof stat.value === 'number' ? stat.value : 0} / {stat.total}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          🏆 Achievements ({achievements.length})
        </h2>
        {achievements.length > 0 ? (
          <div className="grid grid-3">
            {achievements.map((a, i) => (
              <motion.div key={a.Id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: 'var(--space-2)' }}>🏅</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>{a.Name}</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    {a.Description}
                  </p>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Unlocked: {new Date(a.UnlockedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🎯</div>
            <p>Complete lessons and games to unlock achievements!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Progress;
