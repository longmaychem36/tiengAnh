import { useEffect, useState } from 'react';
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


function learnerId(item) {
  return getField(item, 'Id', 'id');
}

function learnerName(item) {
  return getField(item, 'Username', 'username') || 'Chưa có tên';
}

function TopLearnerCard({ title, criteria, items = [], metric, helper }) {
  return (
    <section className="admin-top-learner-card">
      <div className="admin-top-learner-head">
        <h3>{title}</h3>
        <p>{criteria}</p>
      </div>
      <div className="admin-top-learner-list">
        {items.length > 0 ? items.map((item, index) => {
          const id = learnerId(item);
          return (
            <Link key={title + '-' + (id || index)} to={id ? '/admin/users/' + id : '/admin/users'} className="admin-top-learner-row">
              <span className="admin-rank-number">{index + 1}</span>
              <span className="admin-top-learner-user">
                <strong>{learnerName(item)}</strong>
                <small>{getField(item, 'Email', 'email') || '-'}</small>
              </span>
              <span className="admin-top-learner-metric">
                <strong>{metric(item)}</strong>
                {helper && <small>{helper(item)}</small>}
              </span>
            </Link>
          );
        }) : <div className="admin-empty-inline">Chưa có dữ liệu phù hợp.</div>}
      </div>
    </section>
  );
}

function HealthTile({ label, value, detail }) {
  return (
    <article className="admin-health-tile">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    adminApi.getDashboardStats()
      .then((res) => {
        if (!isMounted) return;
        setStats(res.data || {});
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setStats(null);
        setError('Không thể tải số liệu quản trị từ máy chủ.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const safeStats = stats || {};

  const totals = {
    activeRate: percent(safeStats.activeUsers, safeStats.totalUsers),
    adminRate: percent(safeStats.adminUsers, safeStats.totalUsers),
    contentItems: Number(safeStats.totalLearningItems || 0),
    studyMinutes: Math.round(Number(safeStats.totalStudySeconds || 0) / 60)
  };

  if (loading) return <Loading />;

  if (error && !stats) {
    return (
      <main className="admin-dashboard admin-simple-dashboard" aria-labelledby="admin-dashboard-title">
        <header className="admin-page-title">
          <h1 id="admin-dashboard-title">Tổng quan</h1>
        </header>
        <div className="admin-dashboard-alert" role="alert">
          <FiAlertCircle />
          <span>{error}</span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
            setLoading(true);
            setReloadKey((value) => value + 1);
          }}>
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  const statCards = [
    {
      label: 'Tài khoản',
      value: safeStats.totalUsers,
      detail: `${formatNumber(safeStats.activeUsers)} hoạt động / ${formatNumber(safeStats.lockedUsers)} bị khóa`,
      note: `${totals.activeRate}% đang hoạt động`,
      icon: <FiUsers />
    },
    {
      label: 'Quản trị viên',
      value: safeStats.adminUsers,
      detail: `${formatNumber(safeStats.learnerUsers)} học viên`,
      note: `${totals.adminRate}% tài khoản quản trị`,
      icon: <FiAward />
    },
    {
      label: 'Bài học kỹ năng',
      value: safeStats.totalSkillLessons,
      detail: `${formatNumber(totals.contentItems)} câu hỏi và nội dung`,
      icon: <FiBookOpen />
    },
    {
      label: 'Thời gian học',
      value: totals.studyMinutes,
      detail: formatMinutes(safeStats.totalStudySeconds),
      note: `${formatNumber(safeStats.totalExp)} EXP`,
      icon: <FiClock />
    },
    {
      label: 'Tài khoản Plus',
      value: safeStats.plusUsers,
      detail: `${formatNumber(safeStats.totalPaymentRequests)} yêu cầu thanh toán`,
      icon: <FiCreditCard />
    },
    {
      label: 'Tài khoản mới',
      value: safeStats.newUsers7d,
      detail: 'trong 7 ngày gần nhất',
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
  const health = safeStats.learningHealth || {};
  const criteria = safeStats.topCriteria || {};
  const maxActivity = Math.max(1, ...activity.map((item) => Number(getField(item, 'ActiveSeconds', 'activeseconds') || 0)));
  const freeUsers = Math.max(0, Number(safeStats.learnerUsers || 0) - Number(safeStats.plusUsers || 0));
  const visibleModules = modules.filter((module) => Number(module.items || 0) > 0 || Number(module.lessons || 0) > 0);

  return (
    <main className="admin-dashboard admin-simple-dashboard" aria-labelledby="admin-dashboard-title">
      <header className="admin-page-title admin-dashboard-title-row">
        <div>
          <h1 id="admin-dashboard-title">Tổng quan</h1>
        </div>
        <Link to="/admin/users" className="btn btn-primary">
          <FiUsers /> Quản lý tài khoản
        </Link>
      </header>

      <section className="admin-stat-grid admin-dashboard-stat-grid" aria-label="Số liệu tổng quan">
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

      <section className="admin-health-strip" aria-label="Learning health">
        <HealthTile label="Học viên hoạt động 7 ngày" value={formatNumber(getField(health, 'ActiveLearners7d', 'activelearners7d'))} detail="có ghi nhận thời gian học" />
        <HealthTile label="Học viên hoạt động 30 ngày" value={formatNumber(getField(health, 'ActiveLearners30d', 'activelearners30d'))} detail={percent(getField(health, 'ActiveLearners30d', 'activelearners30d'), safeStats.learnerUsers) + '% học viên'} />
        <HealthTile label="Nhiệm vụ trong 30 ngày" value={formatNumber(getField(health, 'CompletedTasks30d', 'completedtasks30d'))} detail="đã hoàn thành" />
        <HealthTile label="Giờ học 30 ngày" value={formatMinutes(getField(health, 'StudySeconds30d', 'studyseconds30d'))} detail="tổng thời gian học" />
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid-wide">
        <article className="admin-panel admin-module-table">
          <div className="admin-panel-head">
            <h2>Nội dung học tập</h2>
          </div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Học phần</th>
                  <th>Bài học / bộ</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
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
                          {isEmpty ? 'Chưa có nội dung' : 'Sẵn sàng'}
                        </span>
                      </td>
                      <td>
                        <Link to={row.to} className="btn btn-primary btn-xs">
                          Mở <FiArrowRight />
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
            <h2>Hoạt động 7 ngày</h2>
          </div>
          <div className="admin-activity-bars">
            {activity.map((item) => {
              const seconds = Number(getField(item, 'ActiveSeconds', 'activeseconds') || 0);
              const height = Math.max(6, Math.round((seconds / maxActivity) * 96));
              return (
                <div key={String(getField(item, 'Date', 'date'))} className="admin-activity-bar-item">
                  <span className="admin-activity-bar" style={{ height }} />
                  <small>{formatDate(getField(item, 'Date', 'date'))}</small>
                  <b>{Math.round(seconds / 60)} phút</b>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-visual-chart-panel">
          <div className="admin-panel-head">
            <h2>Phân bố tài khoản và nội dung</h2>
          </div>
          <div className="admin-visual-chart-grid">
            <DonutChart
              title="Vai trò tài khoản"
              total={Number(safeStats.totalUsers || 0)}
              segments={[
                { label: 'Học viên', value: safeStats.learnerUsers, color: '#0f766e' },
                { label: 'Quản trị viên', value: safeStats.adminUsers, color: '#2563eb' }
              ]}
            />

            <div className="admin-ratio-chart-card">
              <h3>Gói và trạng thái</h3>
              <RatioBar label="Tài khoản Plus" value={safeStats.plusUsers} total={safeStats.totalUsers} color="#7c3aed" />
              <RatioBar label="Tài khoản Free" value={freeUsers} total={safeStats.totalUsers} color="#0891b2" />
              <RatioBar label="Đang hoạt động" value={safeStats.activeUsers} total={safeStats.totalUsers} color="#16a34a" />
              <RatioBar label="Đang bị khóa" value={safeStats.lockedUsers} total={safeStats.totalUsers} color="#dc2626" />
            </div>

            <div className="admin-module-chart-card">
              <h3>Quy mô nội dung</h3>
              <ModuleBars modules={visibleModules.length ? visibleModules : modules} />
            </div>
          </div>
        </article>

      </section>


      <section className="admin-panel admin-top-learners-section">
        <div className="admin-panel-head">
          <h2>Học viên nổi bật</h2>
        </div>
        <div className="admin-top-learners-grid">
          <TopLearnerCard
            title="Theo EXP"
            criteria={criteria.exp || 'Xếp theo tổng EXP.'}
            items={safeStats.topLearnersByExp || safeStats.topLearners || []}
            metric={(item) => formatNumber(getField(item, 'Exp', 'exp')) + ' EXP'}
            helper={(item) => 'Cấp ' + formatNumber(getField(item, 'Level', 'level')) + ' · chuỗi ' + formatNumber(getField(item, 'StreakDays', 'streakdays')) + ' ngày'}
          />
          <TopLearnerCard
            title="Theo chuỗi ngày học"
            criteria={criteria.streak || 'Xếp theo chuỗi ngày học hiện tại.'}
            items={safeStats.topLearnersByStreak || []}
            metric={(item) => formatNumber(getField(item, 'StreakDays', 'streakdays')) + ' ngày'}
            helper={(item) => formatNumber(getField(item, 'Exp', 'exp')) + ' EXP'}
          />
          <TopLearnerCard
            title="Theo thời gian học"
            criteria={criteria.studyTime30d || 'Xếp theo tổng thời gian học 30 ngày.'}
            items={safeStats.topLearnersByStudyTime30d || []}
            metric={(item) => formatMinutes(getField(item, 'ActiveSeconds', 'activeseconds'))}
            helper={(item) => formatNumber(getField(item, 'ActiveDays', 'activedays')) + ' ngày có học'}
          />
          <TopLearnerCard
            title="Theo nhiệm vụ"
            criteria={criteria.dailyTasks30d || 'Xếp theo nhiệm vụ hằng ngày hoàn thành trong 30 ngày.'}
            items={safeStats.topLearnersByDailyTasks30d || []}
            metric={(item) => formatNumber(getField(item, 'CompletedTasks', 'completedtasks')) + ' nhiệm vụ'}
            helper={(item) => '+' + formatNumber(getField(item, 'EarnedExp', 'earnedexp')) + ' EXP từ nhiệm vụ'}
          />
        </div>
      </section>


      <section className="admin-dashboard-grid admin-dashboard-grid-wide">
        <article className="admin-panel admin-attention-panel">
          <div className="admin-panel-head">
            <h2>Học viên cần chú ý</h2>
          </div>
          <div className="admin-attention-list">
            {(safeStats.learnersNeedingAttention || []).length > 0 ? (safeStats.learnersNeedingAttention || []).map((item, index) => {
              const id = learnerId(item);
              return (
                <Link key={id || index} to={id ? '/admin/users/' + id : '/admin/users'} className="admin-attention-row">
                  <span className="admin-rank-number">{index + 1}</span>
                  <span>
                    <strong>{learnerName(item)}</strong>
                    <small>{getField(item, 'Reason', 'reason')}</small>
                  </span>
                  <span className="admin-attention-meta">
                    <b>{formatMinutes(getField(item, 'ActiveSeconds30d', 'activeseconds30d'))}</b>
                    <small>{formatNumber(getField(item, 'CompletedTasks30d', 'completedtasks30d'))} nhiệm vụ / 30 ngày</small>
                  </span>
                </Link>
              );
            }) : <div className="admin-empty-inline">Không có học viên cần chú ý theo tiêu chí hiện tại.</div>}
          </div>
        </article>

        <aside className="admin-panel admin-criteria-panel">
          <div className="admin-panel-head">
            <h2>Tiêu chí xếp hạng</h2>
          </div>
          <div className="admin-criteria-list">
            <p><strong>EXP:</strong> {criteria.exp}</p>
            <p><strong>Streak:</strong> {criteria.streak}</p>
            <p><strong>Thời gian học:</strong> {criteria.studyTime30d}</p>
            <p><strong>Nhiệm vụ:</strong> {criteria.dailyTasks30d}</p>
            <p><strong>Cần chú ý:</strong> {criteria.attention}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default AdminDashboard;
