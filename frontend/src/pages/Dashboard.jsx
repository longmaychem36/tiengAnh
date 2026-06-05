// ============================================
// Dashboard Page
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiBook,
  FiCheckCircle,
  FiEdit3,
  FiHeadphones,
  FiLock,
  FiMic,
  FiPlay,
  FiSearch,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { gamificationApi } from '../api/progressApi';
import Loading from '../components/common/Loading';

const learningTracks = [
  {
    icon: <FiHeadphones />,
    label: 'Listening',
    desc: 'Luyện nghe theo bài học hiện tại',
    to: '/listening/lessons',
    color: '#0e7490'
  },
  {
    icon: <FiMic />,
    label: 'Speaking',
    desc: 'Luyện phát âm và phản xạ nói',
    to: '/speaking/options',
    color: '#f59e0b'
  },
  {
    icon: <FiBook />,
    label: 'Reading',
    desc: 'Đọc hiểu và trả lời câu hỏi',
    to: '/reading/lessons',
    color: '#7c3aed'
  },
  {
    icon: <FiEdit3 />,
    label: 'Writing',
    desc: 'Viết câu, đoạn văn và nhận góp ý',
    to: '/writing/lessons',
    color: '#10b981'
  },
  {
    icon: <FiPlay />,
    label: 'Mini Games',
    desc: 'Ôn nhanh bằng trò chơi',
    to: '/games',
    color: '#c2185b'
  }
];

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const dailyTasks = [];
  const dailyLocked = false;
  const handleCompleteTask = () => {};

  useEffect(() => {
    gamificationApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const quickActions = [
    { icon: <FiBook />, label: 'Khóa học', desc: 'Chọn kỹ năng cần luyện', to: '/courses', color: '#c2185b' },
    { icon: <FiSearch />, label: 'Từ điển', desc: 'Tra cứu và lưu từ mới', to: '/dictionary', color: '#8a4b35' },
    { icon: <FiPlay />, label: 'Mini Games', desc: 'Ôn tập bằng trò chơi', to: '/games', color: '#c2185b' },
    { icon: <FiTrendingUp />, label: 'Tiến độ', desc: 'Xem EXP và thành tích', to: '/progress', color: '#8a4b35' }
  ];

  return (
    <div className="lingo-dashboard">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="lingo-hero">
        <div className="lingo-hero-copy">
          <span className="lingo-eyebrow">Học tiếng Anh mỗi ngày</span>
          <h1>Xin chào, {user?.username || 'bạn'}!</h1>
          <p>Luyện nghe, nói, đọc, viết, từ vựng và mini game trong một không gian học tập rõ mục tiêu.</p>
          <div className="lingo-hero-actions">
            <Link className="btn btn-primary btn-lg" to="/courses">Bắt đầu học</Link>
            <Link className="btn btn-secondary btn-lg" to="/games">Chơi mini game</Link>
          </div>
        </div>

        <div className="lingo-progress-phone">
          <div className="lingo-phone-top">
            <span>Today's goal</span>
            <strong>{stats?.levelProgress || 0}%</strong>
          </div>
          <div className="lingo-phone-row">
            <span><HiOutlineFire /> {stats?.StreakDays || 0} ngày</span>
            <span><FiTarget /> {stats?.Exp || 0} EXP</span>
          </div>
        </div>
      </motion.section>

      <section className="lingo-stat-grid">
        <div className="lingo-stat-card">
          <HiOutlineFire />
          <span>Chuỗi ngày</span>
          <strong>{stats?.StreakDays || 0}</strong>
        </div>
        <div className="lingo-stat-card">
          <FiAward />
          <span>Cấp độ</span>
          <strong>Lv.{stats?.Level || 1}</strong>
        </div>
        <div className="lingo-stat-card">
          <FiTarget />
          <span>Tổng EXP</span>
          <strong>{stats?.Exp || 0}</strong>
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
          <p>AI chọn 3 hoạt động dựa trên lỗi sai và thói quen học gần đây của bạn.</p>
        </div>

        {dailyLocked ? (
          <div className="daily-task-locked">
            <FiLock />
            <div>
              <strong>Nhiệm vụ AI dành cho tài khoản Plus</strong>
              <p>Nâng cấp để hệ thống tự theo dõi lỗi sai và giao bài luyện hằng ngày.</p>
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
                  <p>{task.reason || task.description}</p>
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
          <p>Chọn hoạt động phù hợp với thời gian của bạn.</p>
        </div>
        <div className="lingo-action-grid">
          {quickActions.map((action, index) => (
            <motion.div key={action.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Link to={action.to} className="lingo-action-card" style={{ '--action-color': action.color }}>
                <span>{action.icon}</span>
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
          <Link to="/courses">Xem tất cả →</Link>
        </div>

        <div className="grid grid-3">
          {learningTracks.map((track, index) => (
            <motion.div key={track.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Link to={track.to} className="lingo-course-card" style={{ '--action-color': track.color }}>
                <span className="lingo-course-level">{track.icon}</span>
                <h3>{track.label}</h3>
                <p>{track.desc}</p>
                <small>Đi tới luyện tập</small>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
