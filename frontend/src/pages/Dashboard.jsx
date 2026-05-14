// ============================================
// Dashboard Page
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiBook, FiPlay, FiSearch, FiTarget, FiTrendingUp } from 'react-icons/fi';
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
          <p>Luyện nghe, nói, viết, từ vựng và mini game trong một không gian học tập nhẹ nhàng, rõ mục tiêu.</p>
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
          <div className="lingo-ring">
            <span>Lv.{stats?.Level || 1}</span>
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
          <h2>Khóa học gần đây</h2>
          <Link to="/courses/all">Xem tất cả →</Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-3">
            {courses.map((course, index) => (
              <motion.div key={course.Id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <Link to={`/courses/${course.Id}`} className="lingo-course-card">
                  <span className="lingo-course-level">{course.LevelName || 'All Levels'}</span>
                  <h3>{course.Title}</h3>
                  <p>{course.Description?.substring(0, 92)}...</p>
                  <small>{course.LessonCount || 0} bài học</small>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="lingo-empty-state">
            <FiBook />
            <p>Chưa có khóa học nào.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
