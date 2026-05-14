// ============================================
// Games Page - Arcade set list and level map
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiCheck, FiChevronRight, FiClock,
  FiLock, FiPlay, FiStar, FiTarget, FiZap
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';

const typeMeta = {
  matching: {
    label: 'Nối từ',
    accent: '#8a4b35',
    surface: '#fff7f1',
    icon: '🔗'
  },
  listening: {
    label: 'Nghe chọn',
    accent: '#8a4b35',
    surface: '#fff7f1',
    icon: '🎧'
  },
  sentence: {
    label: 'Xếp câu',
    accent: '#c2185b',
    surface: '#fff4f7',
    icon: '🎵'
  },
  mixed: {
    label: 'Hỗn hợp',
    accent: '#8a4b35',
    surface: '#fff7f1',
    icon: '🎮'
  }
};

function Games() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sets, setSets] = useState([]);
  const [levels, setLevels] = useState([]);
  const [activeSet, setActiveSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const typeFilter = searchParams.get('type');

  useEffect(() => {
    gameApi.getSets()
      .then(res => {
        let loadedSets = res.data || [];
        if (typeFilter) loadedSets = loadedSets.filter(s => s.GameType === typeFilter);
        setSets(loadedSets);
      })
      .catch(() => setSets([]))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const loadLevels = async (set) => {
    setActiveSet(set);
    setLoadingLevels(true);
    try {
      const res = await gameApi.getLevels(set.Id);
      setLevels(res.data || []);
    } catch {
      setLevels([]);
    } finally {
      setLoadingLevels(false);
    }
  };

  const goBack = () => {
    setActiveSet(null);
    setLevels([]);
  };

  const playLevel = (level) => {
    if (!level.IsLocked) navigate(`/games/play/${level.Id}`);
  };

  if (loading) return <Loading />;

  if (activeSet) {
    const meta = typeMeta[activeSet.GameType] || typeMeta.mixed;

    return (
      <div className="game-shell game-shell-map">
        <button className="btn btn-ghost btn-sm game-back-btn" onClick={goBack}>
          <FiArrowLeft /> Quay lại
        </button>

        <section className="game-map-hero" style={{ '--game-accent': meta.accent }}>
          <div className="game-map-icon">{activeSet.Icon || meta.icon}</div>
          <div>
            <span className="game-kicker">Bản đồ thử thách</span>
            <h1>{activeSet.Name}</h1>
            <p>{activeSet.Description}</p>
          </div>
        </section>

        {loadingLevels ? (
          <Loading />
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
                  transition={{ delay: index * 0.06 }}
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
                        {[1, 2, 3].map(star => (
                          <FiStar key={star} className={star <= stars ? 'is-lit' : ''} />
                        ))}
                        {level.UserScore > 0 && <span>{level.UserScore}%</span>}
                      </span>
                    )}
                  </span>

                  <span className="game-difficulty">{difficulty}</span>
                  {!locked && <span className="game-level-play"><FiPlay /></span>}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="game-shell">
      <section className="game-hero">
        <div>
          <span className="game-kicker">Arcade học từ vựng</span>
          <h1>Mini Games</h1>
          <p>Nối từ, nghe chọn, nghe xếp câu và đúng/sai trong một khu luyện tập nhanh, có cấp độ và điểm thưởng.</p>
        </div>
        <div className="game-hero-panel">
          <FiZap />
          <strong>Chơi nhanh</strong>
          <span>Hoàn thành level để nhận EXP và sao.</span>
        </div>
      </section>

      {sets.length === 0 && (
        <div className="game-empty">
          <FiLock />
          <p>Chưa có game nào.</p>
        </div>
      )}

      <div className="game-set-grid">
        {sets.map((set, index) => {
          const meta = typeMeta[set.GameType] || typeMeta.mixed;
          const completedLevels = set.CompletedLevels || 0;
          const totalLevels = set.LevelCount || 0;
          const totalStars = set.TotalStars || 0;
          const maxStars = set.MaxStars || totalLevels * 3;
          const progressPct = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

          return (
            <motion.button
              key={set.Id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              onClick={() => loadLevels(set)}
              className="game-set-card"
              style={{ '--game-accent': meta.accent, '--game-surface': meta.surface }}
            >
              <span className="game-set-badge">{meta.label}</span>
              {set.IsSetCompleted && <span className="game-complete-badge"><FiCheck /> Hoàn thành</span>}

              <span className="game-set-icon">{set.Icon || meta.icon}</span>
              <span className="game-set-title">{set.Name}</span>
              <span className="game-set-desc">{set.Description}</span>

              <span className="game-progress-row">
                <span>{completedLevels}/{totalLevels} cấp độ</span>
                <span>{totalStars}/{maxStars} sao</span>
              </span>
              <span className="game-progress-track">
                <span style={{ width: `${progressPct}%` }} />
              </span>

              <span className="game-card-footer">
                <span>{progressPct}% hoàn thành</span>
                <FiChevronRight />
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default Games;
