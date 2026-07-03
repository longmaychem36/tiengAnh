// ============================================
// Overview Page
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiTarget,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { dashboardApi } from '../api/dashboardApi';
import Loading from '../components/common/Loading';

const learningTracks = [
  {
    icon: '/nav-icons/admin-listening.svg',
    label: 'Nghe',
    desc: 'Luyện nghe theo bài học hiện tại',
    to: '/listening/lessons',
    color: '#0e7490',
    plusOnly: true
  },
  {
    icon: '/nav-icons/admin-speaking.svg',
    label: 'Nói',
    desc: 'Luyện phát âm và phản xạ nói',
    to: '/speaking/options',
    color: '#f59e0b',
    plusOnly: true
  },
  {
    icon: '/nav-icons/admin-reading.svg',
    label: 'Đọc',
    desc: 'Đọc hiểu và trả lời câu hỏi',
    to: '/reading/lessons',
    color: '#7c3aed'
  },
  {
    icon: '/nav-icons/admin-writing.svg',
    label: 'Viết',
    desc: 'Viết câu, đoạn văn và nhận góp ý',
    to: '/writing/lessons',
    color: '#10b981'
  }
];

function number(value) {
  return Number(value || 0);
}

function formatHours(value) {
  const hours = number(value);
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

function getDisplayTaskReason(task) {
  const text = String(task.reason || task.description || '').trim();
  if (!text.includes('SM-2') && !text.includes('lịch ghi nhớ')) return text;
  return 'Đã đến lúc ôn lại để ghi nhớ tốt hơn.';
}

function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const dailyTasks = [];
  const dailyLocked = false;
  const handleCompleteTask = () => {};

  useEffect(() => {
    dashboardApi.getOverview()
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = overview?.stats || {};
  const study = overview?.study || {};
  const months = study.months || [];
  const currentMonthActiveDays = study.currentMonthActiveDays || 0;
  const monthlyLeaderboard = overview?.leaderboards?.monthly || [];
  const levelLeaderboard = overview?.leaderboards?.level || [];
  const maxMonthlyMinutes = useMemo(
    () => Math.max(1, ...months.map((month) => number(month.minutes))),
    [months]
  );
  const isPlus = Boolean(user?.isPlus || user?.plan === 'plus');

  if (loading) return <Loading />;

  const quickActions = [
    { icon: '/nav-icons/courses.svg', label: 'Khóa học', desc: 'Chọn kỹ năng cần luyện', to: '/courses', color: '#c2185b' },
    { icon: '/nav-icons/dictionary.svg', label: 'Từ điển', desc: 'Tra cứu và lưu từ mới', to: '/dictionary', color: '#8a4b35' },
    { icon: '/nav-icons/profile.svg', label: 'Hồ sơ', desc: 'Xem EXP và thông tin tài khoản', to: '/profile', color: '#8a4b35' }
  ];

  return (
    <div className="lingo-dashboard">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="lingo-hero">
        <div className="lingo-hero-copy">
          <span className="lingo-eyebrow">Tổng quan học tập</span>
          <h1>Xin chào, {user?.username || 'bạn'}!</h1>
          <div className="lingo-hero-actions">
            <Link className="btn btn-primary btn-lg" to="/courses">Bắt đầu học</Link>
          </div>
        </div>

        <div className="lingo-progress-phone">
          <div className="lingo-phone-top">
            <span>Tháng này</span>
            <strong>{formatHours(study.currentMonthHours)}</strong>
          </div>
          <div className="overview-phone-ring">
            <FiClock />
            <strong>{currentMonthActiveDays}</strong>
            <span>ngày học</span>
          </div>
          <div className="lingo-phone-row">
            <span><HiOutlineFire /> {stats?.StreakDays || 0} ngày</span>
            <span><FiTarget /> {stats?.Exp || 0} EXP</span>
          </div>
        </div>
      </motion.section>

      <section className="lingo-stat-grid overview-stat-grid">
        <div className="lingo-stat-card">
          <HiOutlineFire />
          <span>Chuỗi ngày</span>
          <strong>{stats?.StreakDays || 0}</strong>
        </div>
        <div className="lingo-stat-card">
          <FiTrendingUp />
          <span>Cấp độ</span>
          <strong>Lv.{stats?.Level || 1}</strong>
        </div>
        <div className="lingo-stat-card">
          <FiTarget />
          <span>Tổng EXP</span>
          <strong>{stats?.Exp || 0}</strong>
        </div>
        <div className="lingo-stat-card">
          <FiClock />
          <span>Giờ học tháng này</span>
          <strong>{formatHours(study.currentMonthHours)}</strong>
        </div>
      </section>

      <section className="lingo-section overview-study-grid">
        <div className="overview-hours-panel">
          <div className="lingo-section-title">
            <div>
              <h2>Giờ học theo tháng</h2>
            </div>
            <span className="overview-total-pill">{formatHours(study.totalHoursLast12Months)} / 12 tháng</span>
          </div>

          <div className="overview-month-bars">
            {months.map((month) => {
              const height = Math.max(8, Math.round((number(month.minutes) / maxMonthlyMinutes) * 100));
              return (
                <div className="overview-month-bar" key={month.monthKey}>
                  <span className="overview-month-fill" style={{ height: `${height}%` }} title={`${month.label}: ${formatHours(month.hours)}`} />
                  <small>{month.label}</small>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overview-month-card">
          <FiBarChart2 />
          <span>Tháng hiện tại</span>
          <strong>{formatHours(study.currentMonthHours)}</strong>
          <p>Đã học {currentMonthActiveDays} ngày trong {study.periodLabel || 'tháng này'}.</p>
        </div>
      </section>

      <section className="lingo-section overview-leaderboards">
        <div className="lingo-section-title">
          <div>
            <h2>Bảng xếp hạng</h2>
          </div>
          <FiUsers />
        </div>

        <div className="overview-leaderboard-grid">
          <Leaderboard
            title="Theo tháng"
            items={monthlyLeaderboard}
            emptyText="Chưa có hoạt động trong tháng này."
            metric={(item) => formatHours(item.hours)}
            helper={(item) => `${item.activeDays || 0} ngày học · Lv.${item.level || 1}`}
          />

          <Leaderboard
            title="Theo cấp độ"
            items={levelLeaderboard}
            emptyText="Chưa có dữ liệu xếp hạng cấp độ."
            metric={(item) => `Lv.${item.level || 1}`}
            helper={(item) => `${item.exp || 0} EXP · ${item.streakDays || 0} ngày`}
          />
        </div>
      </section>

      <section className="daily-dashboard-banner">
        <div>
          <span>Nhiệm vụ hằng ngày</span>
          <h2>Nhận EXP đăng nhập và hoàn thành kế hoạch học hôm nay.</h2>
        </div>
        <Link className="btn btn-primary" to="/daily-tasks">Mở nhiệm vụ</Link>
      </section>

      <section className="lingo-section daily-task-section">
        <div className="lingo-section-title">
          <h2>Nhiệm vụ hôm nay</h2>
        </div>

        {dailyLocked ? (
          <div className="daily-task-locked">
            <FiLock />
            <div>
              <strong>Nhiệm vụ AI dành cho tài khoản Plus</strong>
            </div>
            <Link className="btn btn-primary btn-sm" to="/profile">Xem gói Plus</Link>
          </div>
        ) : dailyTasks.length > 0 ? (
          <div className="daily-task-grid">
            {dailyTasks.map((task, index) => {
              const completed = task.status === 'completed';
              return (
                <motion.article
                  key={task.id}
                  className={`daily-task-card ${completed ? 'is-completed' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="daily-task-top">
                    <span>{task.skill}</span>
                    {completed && <FiCheckCircle />}
                  </div>
                  <h3>{task.title}</h3>
                  <div className="daily-task-actions">
                    <Link className="btn btn-primary btn-sm" to={task.url || '/dashboard'}>
                      Luyện ngay
                    </Link>
                    {!completed && (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleCompleteTask(task.id)}>
                        Đánh dấu xong
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="daily-task-empty">
            Hệ thống chưa có đủ dữ liệu để giao nhiệm vụ. Hãy hoàn thành thêm vài bài luyện.
          </div>
        )}
      </section>

      <section className="lingo-section">
        <div className="lingo-section-title">
          <h2>Lối tắt học tập</h2>
        </div>
        <div className="lingo-action-grid">
          {quickActions.map((action, index) => (
            <motion.div key={action.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Link to={action.to} className="lingo-action-card" style={{ '--action-color': action.color }}>
                <span><img src={action.icon} alt="" aria-hidden="true" /></span>
                <strong>{action.label}</strong>
                <small>{action.desc}</small>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="lingo-section">
        <div className="lingo-section-title">
          <h2>Khu vực luyện tập</h2>
          <Link to="/courses">Xem tất cả</Link>
        </div>

        <div className="grid grid-3">
          {learningTracks.map((track, index) => {
            const lockedByPlan = track.plusOnly && !isPlus;
            return (
              <motion.div key={track.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <Link to={lockedByPlan ? '/profile' : track.to} className={`lingo-course-card ${lockedByPlan ? 'is-plus-locked' : ''}`} style={{ '--action-color': track.color }}>
                  <span className="lingo-course-level"><img src={track.icon} alt="" aria-hidden="true" /></span>
                  <h3>{track.label}</h3>
                  <p>{track.desc}</p>
                  <small>{lockedByPlan ? 'Plus' : 'Đi tới luyện tập'}</small>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Leaderboard({ title, subtitle, items, emptyText, metric, helper }) {
  return (
    <div className="overview-leaderboard-card">
      <div className="overview-leaderboard-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      {items.length > 0 ? (
        <div className="overview-rank-list">
          {items.map((item) => (
            <div className={`overview-rank-row rank-${item.rank <= 3 ? item.rank : 'default'}`} key={`${title}-${item.userId}`}>
              <span className="overview-rank-badge">{item.rank}</span>
              <span className="overview-rank-avatar">
                {item.avatarUrl ? (
                  <img src={item.avatarUrl} alt={item.username} />
                ) : (
                  item.username?.charAt(0).toUpperCase() || 'U'
                )}
              </span>
              <div className="overview-rank-user">
                <strong>{item.username}</strong>
                <small>{helper(item)}</small>
              </div>
              <span className="overview-rank-metric">{metric(item)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="overview-rank-empty">{emptyText}</div>
      )}
    </div>
  );
}

export default Dashboard;
