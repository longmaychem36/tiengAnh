// ============================================
// Admin Dashboard - operational overview
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertCircle,
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiClock,
  FiCreditCard,
  FiGrid,
  FiHeadphones,
  FiMic,
  FiPlay,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';

const numberFormatter = new Intl.NumberFormat('vi-VN');

function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

function formatMinutes(seconds) {
  return `${formatNumber(Math.round(Number(seconds || 0) / 60))} phút`;
}

function percent(value, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((Number(value || 0) / Number(total || 1)) * 100));
}

function getField(row, ...keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }
  return undefined;
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(new Date(value));
}

function DonutChart({ title, total, segments }) {
  let cursor = 0;
  const gradient = segments.map((segment) => {
    const value = Number(segment.value || 0);
    const start = cursor;
    const end = total > 0 ? cursor + (value / total) * 100 : cursor;
    cursor = end;
    return `${segment.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="admin-donut-chart-card">
      <div
        className="admin-donut-chart"
        style={{ background: total > 0 ? `conic-gradient(${gradient})` : '#e9ecef' }}
        aria-label={title}
      >
        <span>{formatNumber(total)}</span>
      </div>
      <div className="admin-chart-legend">
        <h3>{title}</h3>
        {segments.map((segment) => (
          <div key={segment.label} className="admin-chart-legend-row">
            <i style={{ background: segment.color }} />
            <span>{segment.label}</span>
            <strong>{formatNumber(segment.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatioBar({ label, value, total, color }) {
  const width = percent(value, total);
  return (
    <div className="admin-ratio-row">
      <div>
        <span>{label}</span>
        <strong>{formatNumber(value)}</strong>
      </div>
      <div className="admin-ratio-track">
        <span style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}

function ModuleBars({ modules }) {
  const maxItems = Math.max(1, ...modules.map((module) => Number(module.items || 0)));
  return (
    <div className="admin-module-chart-list">
      {modules.map((module) => (
        <div key={module.key} className="admin-module-chart-row">
          <span>{module.name}</span>
          <div className="admin-module-chart-track">
            <b style={{ width: `${Math.max(4, percent(module.items, maxItems))}%` }} />
          </div>
          <strong>{formatNumber(module.items)}</strong>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard() {
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

  const totals = useMemo(() => ({
    activeRate: percent(safeStats.activeUsers, safeStats.totalUsers),
    adminRate: percent(safeStats.adminUsers, safeStats.totalUsers),
    contentItems: Number(safeStats.totalLearningItems || 0),
    studyMinutes: Math.round(Number(safeStats.totalStudySeconds || 0) / 60)
  }), [safeStats]);

  if (loading) return <Loading />;

  const statCards = [
    {
      label: 'Accounts',
      value: safeStats.totalUsers,
      detail: `${formatNumber(safeStats.activeUsers)} active / ${formatNumber(safeStats.lockedUsers)} locked`,
      note: `${totals.activeRate}% active`,
      icon: <FiUsers />
    },
    {
      label: 'Admins',
      value: safeStats.adminUsers,
      detail: `${formatNumber(safeStats.learnerUsers)} learners`,
      note: `${totals.adminRate}% admin`,
      icon: <FiAward />
    },
    {
      label: 'Learning content',
      value: safeStats.totalSkillLessons,
      detail: `${formatNumber(totals.contentItems)} questions/items`,
      icon: <FiBookOpen />
    },
    {
      label: 'Study time',
      value: totals.studyMinutes,
      detail: formatMinutes(safeStats.totalStudySeconds),
      note: `${formatNumber(safeStats.totalExp)} EXP`,
      icon: <FiClock />
    },
    {
      label: 'Plus users',
      value: safeStats.plusUsers,
      detail: `${formatNumber(safeStats.totalPaymentRequests)} payment requests`,
      icon: <FiCreditCard />
    },
    {
      label: 'New users',
      value: safeStats.newUsers7d,
      detail: 'last 7 days',
      icon: <FiTrendingUp />
    }
  ];

  const moduleIcons = {
    listening: <FiHeadphones />,
    reading: <FiBookOpen />,
    speaking: <FiMic />,
    writing: <FiGrid />,
    grammar: <FiBookOpen />,
    games: <FiPlay />,
    vocabulary: <FiGrid />
  };

  const modules = safeStats.modules || [];
  const activity = safeStats.activity7d || [];
  const maxActivity = Math.max(1, ...activity.map((item) => Number(getField(item, 'ActiveSeconds', 'activeseconds') || 0)));
  const freeUsers = Math.max(0, Number(safeStats.learnerUsers || 0) - Number(safeStats.plusUsers || 0));
  const visibleModules = modules.filter((module) => Number(module.items || 0) > 0 || Number(module.lessons || 0) > 0);

  return (
    <main className="admin-dashboard admin-simple-dashboard" aria-labelledby="admin-dashboard-title">
      <header className="admin-page-title admin-dashboard-title-row">
        <div>
          <h1 id="admin-dashboard-title">Dashboard</h1>
        </div>
        <Link to="/admin/users" className="btn btn-primary">
          <FiUsers /> Accounts
        </Link>
      </header>

      {error && (
        <div className="admin-dashboard-alert" role="alert">
          <FiAlertCircle /> Could not load fresh dashboard numbers. The page is showing empty values.
        </div>
      )}

      <section className="admin-stat-grid admin-dashboard-stat-grid" aria-label="Summary">
        {statCards.map((card) => (
          <article key={card.label} className="admin-stat-card admin-rich-stat-card">
            <div className="admin-stat-card-head">
              <span>{card.label}</span>
              {card.icon}
            </div>
            <div className="admin-stat-card-body">
              <strong>{formatNumber(card.value)}</strong>
              <span>{card.detail}</span>
              {card.note && <small className="is-positive">{card.note}</small>}
            </div>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid-wide">
        <article className="admin-panel admin-module-table">
          <div className="admin-panel-head">
            <h2>Content modules</h2>
          </div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Lessons/sets</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((row) => {
                  const isEmpty = Number(row.lessons || 0) === 0 && Number(row.items || 0) === 0;
                  return (
                    <tr key={row.key}>
                      <td>
                        <span className="admin-table-module">
                          {moduleIcons[row.key] || <FiGrid />}
                          <strong>{row.name}</strong>
                        </span>
                      </td>
                      <td>{formatNumber(row.lessons)}</td>
                      <td>{formatNumber(row.items)}</td>
                      <td>
                        <span className={`admin-status-chip ${isEmpty ? 'is-locked' : 'is-active'}`}>
                          {isEmpty ? 'Needs content' : 'Ready'}
                        </span>
                      </td>
                      <td>
                        <Link to={row.to} className="btn btn-primary btn-xs">
                          Open <FiArrowRight />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="admin-panel admin-activity-panel">
          <div className="admin-panel-head">
            <h2>7-day activity</h2>
          </div>
          <div className="admin-activity-bars">
            {activity.map((item) => {
              const seconds = Number(getField(item, 'ActiveSeconds', 'activeseconds') || 0);
              const height = Math.max(6, Math.round((seconds / maxActivity) * 96));
              return (
                <div key={String(getField(item, 'Date', 'date'))} className="admin-activity-bar-item">
                  <span className="admin-activity-bar" style={{ height }} />
                  <small>{formatDate(getField(item, 'Date', 'date'))}</small>
                  <b>{Math.round(seconds / 60)}m</b>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-visual-chart-panel">
          <div className="admin-panel-head">
            <h2>Account and content charts</h2>
          </div>
          <div className="admin-visual-chart-grid">
            <DonutChart
              title="Account roles"
              total={Number(safeStats.totalUsers || 0)}
              segments={[
                { label: 'Learners', value: safeStats.learnerUsers, color: '#0f766e' },
                { label: 'Admins', value: safeStats.adminUsers, color: '#2563eb' }
              ]}
            />

            <div className="admin-ratio-chart-card">
              <h3>Plan and status</h3>
              <RatioBar label="Plus learners" value={safeStats.plusUsers} total={safeStats.totalUsers} color="#7c3aed" />
              <RatioBar label="Free learners" value={freeUsers} total={safeStats.totalUsers} color="#0891b2" />
              <RatioBar label="Active accounts" value={safeStats.activeUsers} total={safeStats.totalUsers} color="#16a34a" />
              <RatioBar label="Locked accounts" value={safeStats.lockedUsers} total={safeStats.totalUsers} color="#dc2626" />
            </div>

            <div className="admin-module-chart-card">
              <h3>Content item volume</h3>
              <ModuleBars modules={visibleModules.length ? visibleModules : modules} />
            </div>
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-head">
            <h2>Top learners</h2>
          </div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>EXP</th>
                  <th>Level</th>
                  <th>Streak</th>
                </tr>
              </thead>
              <tbody>
                {(safeStats.topLearners || []).map((item) => (
                  <tr key={getField(item, 'Id', 'id')}>
                    <td><strong>{getField(item, 'Username', 'username')}</strong><br /><span>{getField(item, 'Email', 'email')}</span></td>
                    <td>{formatNumber(getField(item, 'Exp', 'exp'))}</td>
                    <td>{formatNumber(getField(item, 'Level', 'level'))}</td>
                    <td>{formatNumber(getField(item, 'StreakDays', 'streakdays'))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}

export default AdminDashboard;
