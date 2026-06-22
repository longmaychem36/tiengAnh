// ============================================
// Admin Dashboard - simple overview
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowRight, FiBookOpen, FiGrid, FiHeadphones, FiMic, FiPlay } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';

const numberFormatter = new Intl.NumberFormat('vi-VN');

function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

function percent(value, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((Number(value || 0) / Number(total || 1)) * 100));
}

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    adminApi.getDashboardStats()
      .then((res) => {
        if (!isMounted) return;
        setStats(res.data || {});
        setError(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setStats({});
        setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const safeStats = stats || {};

  const totals = useMemo(() => {
    const skillLessons =
      Number(safeStats.totalSkillLessons || 0) ||
      Number(safeStats.totalListeningLessons || 0) +
        Number(safeStats.totalReadingLessons || 0) +
        Number(safeStats.totalSpeakingLessons || 0) +
        Number(safeStats.totalWritingLessons || 0);

    return {
      skillLessons,
      activeRate: percent(safeStats.activeUsers, safeStats.totalUsers),
      questionTotal:
        Number(safeStats.totalListeningQuestions || 0) +
        Number(safeStats.totalReadingQuestions || 0) +
        Number(safeStats.totalSpeakingQuestions || 0) +
        Number(safeStats.totalWritingExercises || 0) +
        Number(safeStats.totalGrammarTopics || 0) +
        Number(safeStats.totalQuestions || 0),
    };
  }, [safeStats]);

  if (loading) return <Loading />;

  const statCards = [
    {
      label: 'Users',
      value: safeStats.totalUsers,
      detail: `${formatNumber(safeStats.activeUsers)} active accounts`,
      note: `${totals.activeRate}% active rate`,
      trend: 'up',
    },
    {
      label: 'Lessons',
      value: totals.skillLessons,
      detail: 'Listening, Reading, Speaking, Writing',
      note: 'content inventory',
      trend: 'up',
    },
    {
      label: 'Questions',
      value: totals.questionTotal,
      detail: 'Exercises, quizzes and mini games',
      note: 'review weekly',
      trend: 'down',
    },
    {
      label: 'Grammar',
      value: safeStats.totalGrammarCategories,
      detail: `${formatNumber(safeStats.totalGrammarTopics)} topics`,
      note: 'topic coverage',
      trend: 'up',
    },
  ];

  const rows = [
    {
      icon: <FiHeadphones />,
      module: 'Listening',
      lessons: safeStats.totalListeningLessons,
      items: safeStats.totalListeningQuestions,
      to: '/admin/listening',
    },
    {
      icon: <FiBookOpen />,
      module: 'Reading',
      lessons: safeStats.totalReadingLessons,
      items: safeStats.totalReadingQuestions,
      to: '/admin/reading',
    },
    {
      icon: <FiMic />,
      module: 'Speaking',
      lessons: safeStats.totalSpeakingLessons,
      items: safeStats.totalSpeakingQuestions,
      to: '/admin/speaking',
    },
    {
      icon: <FiGrid />,
      module: 'Writing',
      lessons: safeStats.totalWritingLessons,
      items: safeStats.totalWritingExercises,
      to: '/admin/writing',
    },
    {
      icon: <FiBookOpen />,
      module: 'Grammar',
      lessons: safeStats.totalGrammarCategories,
      items: safeStats.totalGrammarTopics,
      to: '/admin/grammar',
    },
    {
      icon: <FiPlay />,
      module: 'Mini games',
      lessons: safeStats.totalGameLevels,
      items: safeStats.totalQuestions,
      to: '/admin/games',
    },
  ];

  const chartPoints = [
    safeStats.totalListeningQuestions,
    safeStats.totalReadingQuestions,
    safeStats.totalSpeakingQuestions,
    safeStats.totalWritingExercises,
    safeStats.totalGrammarTopics,
    safeStats.totalQuestions,
  ].map((value) => Number(value || 0));
  const maxChartValue = Math.max(1, ...chartPoints);
  const svgPoints = chartPoints
    .map((value, index) => {
      const x = 18 + index * 48;
      const y = 118 - (value / maxChartValue) * 88;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <main className="admin-dashboard admin-simple-dashboard" aria-labelledby="admin-dashboard-title">
      <nav className="admin-breadcrumb" aria-label="Breadcrumb">
        <Link to="/admin">Home</Link>
        <span>/</span>
        <span>Overview</span>
      </nav>

      <header className="admin-page-title">
        <h1 id="admin-dashboard-title">Dashboard</h1>
        <p>This is the homepage of the admin interface for {user?.username || 'the current admin'}.</p>
      </header>

      {error && (
        <div className="admin-dashboard-alert" role="alert">
          <FiAlertCircle />
          Could not load fresh dashboard numbers. The page is showing empty values.
        </div>
      )}

      <section className="admin-stat-grid" aria-label="Summary">
        {statCards.map((card) => (
          <article key={card.label} className="admin-stat-card">
            <div className="admin-stat-card-head">{card.label}</div>
            <div className="admin-stat-card-body">
              <strong>{formatNumber(card.value)}</strong>
              <span>{card.detail}</span>
              <small className={card.trend === 'down' ? 'is-negative' : 'is-positive'}>{card.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-module-table">
          <div className="admin-panel-head">
            <h2>Content modules</h2>
          </div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Lessons</th>
                  <th>Items</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.module}>
                    <td>
                      <span className="admin-table-module">
                        {row.icon}
                        <strong>{row.module}</strong>
                      </span>
                    </td>
                    <td>{formatNumber(row.lessons)}</td>
                    <td>{formatNumber(row.items)}</td>
                    <td>
                      <Link to={row.to} className="btn btn-primary btn-xs">
                        View
                        <FiArrowRight />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/listening" className="admin-panel-footer-link">View all</Link>
        </article>

        <aside className="admin-panel admin-chart-panel">
          <div className="admin-panel-head">
            <h2>Activity by module</h2>
          </div>
          <svg className="admin-line-chart" viewBox="0 0 280 140" role="img" aria-label="Content activity by module">
            <line x1="16" y1="118" x2="264" y2="118" />
            <line x1="16" y1="84" x2="264" y2="84" />
            <line x1="16" y1="50" x2="264" y2="50" />
            <polyline points={svgPoints} />
            {svgPoints.split(' ').map((point) => {
              const [x, y] = point.split(',');
              return <circle key={point} cx={x} cy={y} r="4" />;
            })}
          </svg>
          <div className="admin-chart-labels">
            <span>Listen</span>
            <span>Read</span>
            <span>Speak</span>
            <span>Write</span>
            <span>Grammar</span>
            <span>Games</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default AdminDashboard;
