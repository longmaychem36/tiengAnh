// ============================================
// Progress Page
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';
import { gamificationApi } from '../api/progressApi';
import { dailyTaskApi } from '../api/dailyTaskApi';
import Loading from '../components/common/Loading';

function number(value) {
  return Number(value || 0);
}

const skillLabels = {
  writing: 'Writing',
  speaking: 'Speaking',
  grammar: 'Grammar',
  listening: 'Listening',
  reading: 'Reading',
  game: 'Mini Games',
  vocabulary: 'Vocabulary'
};

function Progress() {
  const [gameStats, setGameStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      gamificationApi.getStats().catch(() => ({ data: null })),
      gamificationApi.getMyAchievements().catch(() => ({ data: [] })),
      dailyTaskApi.getWeaknesses(8).catch(() => ({ data: { weaknesses: [] } }))
    ]).then(([statsRes, achieveRes, weaknessRes]) => {
      setGameStats(statsRes.data);
      setAchievements(achieveRes.data || []);
      setWeaknesses(weaknessRes.data?.weaknesses || []);
    }).finally(() => setLoading(false));
  }, []);

  const computed = useMemo(() => {
    const exp = number(gameStats?.Exp);
    const level = number(gameStats?.Level) || 1;
    const streak = number(gameStats?.StreakDays);
    const levelProgress = Math.max(0, Math.min(100, number(gameStats?.levelProgress)));
    const currentLevelExp = number(gameStats?.currentLevelExp);
    const requiredLevelExp = number(gameStats?.requiredLevelExp);
    const totalMistakes = weaknesses.reduce((sum, item) => sum + number(item.mistakeCount), 0);
    const topWeaknessWeight = weaknesses.reduce((max, item) => Math.max(max, number(item.weight)), 0);

    return {
      exp,
      level,
      streak,
      levelProgress,
      currentLevelExp,
      requiredLevelExp,
      expToNextLevel: number(gameStats?.expToNextLevel),
      totalMistakes,
      topWeaknessWeight
    };
  }, [gameStats, weaknesses]);

  const groupedWeaknesses = useMemo(() => summarizeWeaknesses(weaknesses).slice(0, 6), [weaknesses]);

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
      icon: <HiStreakIcon />,
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
    },
    {
      icon: <FiTarget />,
      label: 'Điểm yếu đang theo dõi',
      value: groupedWeaknesses.length,
      helper: `${computed.totalMistakes} lỗi sai đã ghi nhận`,
      progress: Math.min(100, computed.topWeaknessWeight)
    }
  ];

  return (
    <div className="progress-page">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="progress-hero">
        <div>
          <span className="progress-eyebrow">Tiến độ học tập</span>
          <h1>Theo dõi hành trình học của bạn</h1>
          <p>Xem EXP, cấp độ, chuỗi ngày học, điểm yếu và các huy hiệu đã mở khóa trong hệ thống hiện tại.</p>
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
          <HiStreakIcon />
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
          <h2>Điểm yếu cần cải thiện</h2>
          <p>Dựa trên lỗi sai từ bài viết, nói, ngữ pháp, nghe, đọc và mini game.</p>
        </div>

        {groupedWeaknesses.length > 0 ? (
          <div className="weakness-grid">
            {groupedWeaknesses.map((item, index) => (
              <motion.div
                key={item.key}
                className="weakness-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <div className="weakness-card-top">
                  <span>{skillLabels[item.skill] || item.skill}</span>
                  <FiBarChart2 />
                </div>
                <h3>{item.title}</h3>
                <p>{item.comment}</p>
                <small>
                  {item.mistakeCount} lần sai được ghi nhận ·{' '}
                  Gần nhất: {item.lastSeenAt ? new Date(item.lastSeenAt).toLocaleDateString('vi-VN') : 'chưa rõ'}
                </small>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="progress-empty">
            <FiTarget />
            <strong>Chưa có dữ liệu lỗi sai</strong>
            <p>Làm thêm bài viết, nói, nghe, đọc, grammar quiz hoặc mini game để hệ thống phân tích điểm yếu.</p>
          </div>
        )}
      </section>

      <section className="progress-section">
        <div className="progress-section-title">
          <h2>Tổng quan luyện tập</h2>
          <p>Các chỉ số này lấy từ EXP, thành tích và dữ liệu lỗi sai đang dùng trong hệ thống mới.</p>
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
            <h2>Phân bổ lỗi sai</h2>
            <p>Các nhóm kỹ năng đang cần tập trung hơn.</p>
          </div>

          <div className="progress-breakdown">
            {Object.entries(groupMistakesBySkill(weaknesses)).map(([skill, count]) => (
              <ProgressLine key={skill} label={skillLabels[skill] || skill} value={count} detail={`${count} lỗi`} />
            ))}
            {weaknesses.length === 0 && (
              <ProgressLine label="Chưa có lỗi sai" value={0} detail="0 lỗi" />
            )}
            <ProgressLine label="Cấp độ" value={computed.levelProgress} detail={`Lv.${computed.level}`} />
          </div>
        </div>

        <div className="progress-panel">
          <div className="progress-section-title is-compact">
            <h2>Gợi ý tiếp theo</h2>
            <p>Dựa trên hệ học hiện tại.</p>
          </div>

          <div className="progress-next-list">
            <NextItem icon={<FiBookOpen />} title="Hoàn thành thêm bài kỹ năng" text="Mỗi bài nghe, nói, đọc, viết giúp hệ thống có thêm dữ liệu để giao nhiệm vụ chính xác hơn." />
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

function groupMistakesBySkill(weaknesses) {
  const totals = {};

  weaknesses.forEach((item) => {
    totals[item.skill] = (totals[item.skill] || 0) + number(item.mistakeCount);
  });

  return totals;
}

function summarizeWeaknesses(weaknesses) {
  const groups = new Map();

  weaknesses.forEach((item) => {
    const skill = item.skill || 'general';
    const errorType = item.errorType || 'accuracy';
    const key = `${skill}-${errorType}`;
    const current = groups.get(key) || {
      key,
      skill,
      errorType,
      mistakeCount: 0,
      attemptCount: 0,
      weight: 0,
      lastSeenAt: null
    };

    current.mistakeCount += number(item.mistakeCount);
    current.attemptCount += number(item.attemptCount);
    current.weight += number(item.weight);
    if (!current.lastSeenAt || (item.lastSeenAt && new Date(item.lastSeenAt) > new Date(current.lastSeenAt))) {
      current.lastSeenAt = item.lastSeenAt;
    }

    groups.set(key, current);
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      title: getWeaknessTitle(group.skill, group.errorType),
      comment: getWeaknessComment(group)
    }))
    .sort((a, b) => b.weight - a.weight || b.mistakeCount - a.mistakeCount);
}

function getWeaknessTitle(skill, errorType) {
  if (skill === 'writing' && errorType === 'grammar') return 'Ngữ pháp trong bài viết';
  if (skill === 'writing') return 'Độ chính xác khi viết';
  if (skill === 'speaking') return 'Phát âm và độ khớp câu nói';
  if (skill === 'grammar') return 'Chủ điểm ngữ pháp';
  if (skill === 'listening') return `Nghe hiểu: ${getQuestionTypeLabel(errorType)}`;
  if (skill === 'reading') return `Đọc hiểu: ${getQuestionTypeLabel(errorType)}`;
  if (skill === 'game') return `Mini game: ${getQuestionTypeLabel(errorType)}`;
  if (skill === 'vocabulary') return 'Ôn lại từ vựng';

  return getQuestionTypeLabel(errorType);
}

function getQuestionTypeLabel(errorType) {
  const labels = {
    comprehension: 'hiểu nội dung',
    multiple_choice: 'chọn đáp án',
    true_false: 'đúng/sai',
    fill_blank: 'điền từ',
    matching: 'nối từ',
    listening: 'nghe chọn',
    listenbuild: 'nghe xếp câu',
    game_answer: 'trả lời trong game',
    grammar_topic: 'chủ điểm ngữ pháp',
    grammar: 'ngữ pháp',
    writing_accuracy: 'độ chính xác',
    speaking_accuracy: 'phát âm'
  };

  return labels[errorType] || String(errorType || 'nội dung luyện tập').replace(/_/g, ' ');
}

function getWeaknessComment(group) {
  const count = number(group.mistakeCount);
  const skillName = skillLabels[group.skill] || group.skill || 'kỹ năng này';

  if (count >= 8) {
    return `${skillName} đang sai lặp lại nhiều, nên ưu tiên luyện phần này trong vài ngày tới.`;
  }

  if (count >= 4) {
    return `${skillName} có nhiều lỗi hơn các phần khác, cần ôn lại và làm thêm bài cùng dạng.`;
  }

  return `${skillName} có dấu hiệu chưa chắc, nên luyện thêm để tránh lặp lại lỗi.`;
}

function ProgressLine({ label, value, detail }) {
  const safeValue = Math.max(0, Math.min(100, number(value)));

  return (
    <div className="progress-line">
      <div>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
      <div className="progress-warm-bar">
        <span style={{ width: `${safeValue}%` }} />
      </div>
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

function HiStreakIcon() {
  return <FiTrendingUp />;
}

export default Progress;
