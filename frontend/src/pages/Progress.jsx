import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiBookOpen,
  FiClock,
  FiPlay,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import { gamificationApi } from '../api/progressApi';
import Loading from '../components/common/Loading';

function number(value) {
  return Number(value || 0);
}

function Progress() {
  const [gameStats, setGameStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      gamificationApi.getStats().catch(() => ({ data: null })),
      gamificationApi.getMyAchievements().catch(() => ({ data: [] }))
    ]).then(([statsRes, achieveRes]) => {
      setGameStats(statsRes.data);
      setAchievements(achieveRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const computed = useMemo(() => {
    const exp = number(gameStats?.Exp);
    const level = number(gameStats?.Level) || 1;
    const streak = number(gameStats?.StreakDays);
    const levelProgress = Math.max(0, Math.min(100, number(gameStats?.levelProgress)));
    const currentLevelExp = number(gameStats?.currentLevelExp);
    const requiredLevelExp = number(gameStats?.requiredLevelExp);

    return {
      exp,
      level,
      streak,
      levelProgress,
      currentLevelExp,
      requiredLevelExp,
      expToNextLevel: number(gameStats?.expToNextLevel)
    };
  }, [gameStats]);

  if (loading) return <Loading />;

  const summaryCards = [
    {
      icon: <FiStar />,
      label: 'Tổng EXP',
      value: computed.exp,
      helper: 'EXP nhận từ bài luyện và mini game',
      progress: computed.levelProgress
    },
    {
      icon: <FiTrendingUp />,
      label: 'Chuỗi ngày học',
      value: computed.streak,
      helper: 'Số ngày duy trì luyện tập',
      progress: null
    },
    {
      icon: <FiAward />,
      label: 'Huy hiệu',
      value: achievements.length,
      helper: 'Thành tích đã mở khóa',
      progress: null
    }
  ];

  return (
    <div className="progress-page">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="progress-hero">
        <div>
          <span className="progress-eyebrow">Tiến độ học tập</span>
          <h1>Theo dõi hành trình học của bạn</h1>
          <p>Xem EXP, cấp độ, chuỗi ngày học và các huy hiệu đã mở khóa trong hệ thống hiện tại.</p>
        </div>

        <div className="progress-level-card">
          <div className="progress-level-top">
            <span>Cấp độ hiện tại</span>
            <strong>Lv.{computed.level}</strong>
          </div>
          <div className="progress-level-ring" style={{ '--level-progress': `${computed.levelProgress}%` }}>
            <span>{computed.levelProgress}%</span>
          </div>
          <div className="progress-exp-row">
            <span>{computed.currentLevelExp}/{computed.requiredLevelExp} EXP</span>
            <span>Còn {computed.expToNextLevel} EXP</span>
          </div>
        </div>
      </motion.section>

      <section className="progress-focus-grid">
        <div className="progress-focus-card">
          <FiTrendingUp />
          <span>Chuỗi ngày</span>
          <strong>{computed.streak} ngày</strong>
        </div>
        <div className="progress-focus-card">
          <FiStar />
          <span>Tổng EXP</span>
          <strong>{computed.exp}</strong>
        </div>
        <div className="progress-focus-card">
          <FiAward />
          <span>Huy hiệu</span>
          <strong>{achievements.length}</strong>
        </div>
      </section>

      <section className="progress-section">
        <div className="progress-section-title">
          <h2>Tổng quan luyện tập</h2>
          <p>Các chỉ số này lấy từ EXP, cấp độ và thành tích của tài khoản.</p>
        </div>

        <div className="progress-summary-grid">
          {summaryCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="progress-summary-card"
            >
              <div className="progress-summary-icon">{item.icon}</div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.helper}</small>
              {item.progress !== null && (
                <div className="progress-warm-bar">
                  <span style={{ width: `${Math.max(0, Math.min(100, item.progress))}%` }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="progress-section progress-layout">
        <div className="progress-panel">
          <div className="progress-section-title is-compact">
            <h2>Gợi ý tiếp theo</h2>
            <p>Dựa trên hệ học hiện tại.</p>
          </div>

          <div className="progress-next-list">
            <NextItem icon={<FiBookOpen />} title="Hoàn thành thêm bài kỹ năng" text="Mỗi bài nghe, nói, đọc, viết giúp bạn duy trì nhịp luyện tập đều hơn." />
            <NextItem icon={<FiPlay />} title="Chơi mini game ngắn" text="Dùng mini game để ôn lại nhanh khi không có nhiều thời gian." />
            <NextItem icon={<FiClock />} title="Giữ chuỗi ngày học" text="Đăng nhập và luyện tập đều để giữ nhịp học hằng ngày." />
          </div>
        </div>
      </section>

      <section className="progress-section">
        <div className="progress-section-title">
          <h2>Huy hiệu đã mở khóa</h2>
          <p>{achievements.length} thành tích trong tài khoản của bạn.</p>
        </div>

        {achievements.length > 0 ? (
          <div className="progress-achievement-grid">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.Id || `${achievement.Name}-${index}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                className="progress-achievement-card"
              >
                <div className="progress-achievement-medal"><FiAward /></div>
                <h3>{achievement.Name}</h3>
                <p>{achievement.Description}</p>
                <span>Mở khóa: {achievement.UnlockedAt ? new Date(achievement.UnlockedAt).toLocaleDateString('vi-VN') : 'Chưa rõ'}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="progress-empty">
            <FiAward />
            <strong>Chưa có huy hiệu</strong>
            <p>Hoàn thành bài luyện và chơi mini game để mở khóa thành tích đầu tiên.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function NextItem({ icon, title, text }) {
  return (
    <div className="progress-next-item">
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Progress;
