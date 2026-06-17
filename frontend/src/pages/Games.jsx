// ============================================
// Games Page - direct level map
// ============================================
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiLock,
  FiPlay,
  FiStar,
  FiTarget,
  FiZap
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';

const difficultyLabels = {
  easy: 'Dễ',
  medium: 'Vừa',
  hard: 'Khó'
};

function Games() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameApi.getLevels()
      .then((res) => setLevels(res.data || []))
      .catch(() => setLevels([]))
      .finally(() => setLoading(false));
  }, []);

  const playLevel = (level) => {
    if (!level.IsLocked) navigate(`/games/play/${level.Id}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="game-shell game-shell-map">
      <button type="button" className="btn btn-ghost btn-sm game-back-btn" onClick={() => navigate('/courses')}>
        <FiArrowLeft /> Về khóa học
      </button>

      <section className="game-map-hero" style={{ '--game-accent': '#8a4b35' }}>
        <div className="game-map-icon">🎮</div>
        <div>
          <span className="game-kicker">Mini game</span>
          <h1>Bản đồ thử thách</h1>
          <p>Luyện nhanh theo cấp độ, làm câu hỏi trực tiếp và nhận EXP sau mỗi màn.</p>
        </div>
      </section>

      {levels.length === 0 ? (
        <div className="game-empty">
          <FiLock />
          <p>Chưa có level mini game nào.</p>
        </div>
      ) : (
        <div className="game-level-track">
          <div className="game-level-line" />
          {levels.map((level, index) => {
            const locked = level.IsLocked;
            const completed = level.UserCompleted;
            const stars = level.UserStars || 0;
            const difficulty = level.Difficulty || 'easy';
            const difficultyAccent = difficulty === 'hard' ? '#c94a55' : difficulty === 'medium' ? '#c8851e' : '#8a5a2b';

            return (
              <motion.button
                key={level.Id}
                type="button"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`game-level-node ${locked ? 'is-locked' : ''} ${completed ? 'is-complete' : ''}`}
                style={{
                  '--level-accent': difficultyAccent,
                  marginLeft: index % 2 === 0 ? '-72px' : '72px'
                }}
                onClick={() => playLevel(level)}
              >
                <span className="game-level-number">
                  {locked ? <FiLock /> : completed ? <FiCheck /> : level.LevelNumber}
                </span>

                <span className="game-level-content">
                  <span className="game-level-title">{level.Name}</span>
                  <span className="game-level-meta">
                    <FiTarget /> {level.QuestionCount} câu
                    <FiClock /> {level.TimeLimit}s
                  </span>
                  {!locked && (
                    <span className="game-level-stars">
                      {[1, 2, 3].map((star) => (
                        <FiStar key={star} className={star <= stars ? 'is-lit' : ''} />
                      ))}
                      {level.UserScore > 0 && <span>{level.UserScore}%</span>}
                    </span>
                  )}
                </span>

                <span className="game-difficulty">{difficultyLabels[difficulty] || difficulty}</span>
                {!locked && <span className="game-level-play"><FiPlay /></span>}
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="game-hero-panel">
        <FiZap />
        <strong>Chơi nhanh</strong>
        <span>Mỗi level lấy trực tiếp câu hỏi từ ngân hàng mini game.</span>
      </div>
    </div>
  );
}

export default Games;
