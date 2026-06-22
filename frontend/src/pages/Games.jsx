import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiClock, FiLock, FiStar, FiTarget } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';
import CharacterSvg from '../components/common/CharacterSvg';
import { AlternatingLevelIcon, GameIcon } from '../components/game/LevelIcons';

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

  const currentLevelIndex = useMemo(() => {
    const nextLevel = levels.findIndex((level) => !level.IsLocked && !level.UserCompleted);
    if (nextLevel >= 0) return nextLevel;
    return Math.max(0, levels.findLastIndex((level) => !level.IsLocked));
  }, [levels]);

  const playLevel = (level) => {
    if (!level.IsLocked) navigate(`/games/play/${level.Id}`);
  };

  if (loading) return <Loading />;

  return (
    <main className="game-shell game-shell-map duo-level-map">
      <header className="duo-map-header">
        <button type="button" className="duo-map-back" onClick={() => navigate('/courses')}>
          <FiArrowLeft /> Khóa học
        </button>
        <div className="duo-map-heading">
          <span className="duo-map-heading-icon"><GameIcon size={54} /></span>
          <div>
            <span>Mini game</span>
            <h1>Bản đồ thử thách</h1>
            <p>Hoàn thành từng chặng để mở khóa level tiếp theo.</p>
          </div>
        </div>
      </header>

      {levels.length === 0 ? (
        <section className="game-empty duo-map-empty">
          <FiLock />
          <p>Chưa có level mini game nào.</p>
        </section>
      ) : (
        <section className="duo-path-stage" aria-label="Lộ trình mini game">
          <div className="duo-path-line" aria-hidden="true" />
          <CharacterSvg className="game-map-character" width={150} aria-hidden="true" focusable="false" />

          {levels.map((level, index) => {
            const locked = level.IsLocked;
            const completed = level.UserCompleted;
            const isCurrent = index === currentLevelIndex;
            const stars = Number(level.UserStars || 0);
            const position = ['is-center', 'is-left', 'is-center', 'is-right'][index % 4];

            return (
              <motion.article
                key={level.Id}
                className={`duo-path-step ${position} ${locked ? 'is-locked' : ''} ${completed ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`}
                initial={{ opacity: 0, y: 18, scale: .92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: Math.min(index * .06, .5), type: 'spring', stiffness: 210, damping: 18 }}
              >
                {isCurrent && <span className="duo-start-label">Bắt đầu</span>}

                <button
                  type="button"
                  className="duo-level-button"
                  onClick={() => playLevel(level)}
                  disabled={locked}
                  aria-label={locked ? `Level ${level.LevelNumber} đang khóa` : `Chơi level ${level.LevelNumber}: ${level.Name}`}
                >
                  <span className="duo-level-icon">
                    <AlternatingLevelIcon index={index} size={48} />
                  </span>
                  {(locked || completed) && (
                    <span className={`duo-level-status ${completed ? 'is-complete' : 'is-locked'}`} aria-hidden="true">
                      {completed ? <FiCheck /> : <FiLock />}
                    </span>
                  )}
                </button>

                <div className="duo-level-info">
                  <span className="duo-level-order">Level {level.LevelNumber} · {difficultyLabels[level.Difficulty] || level.Difficulty}</span>
                  <strong>{level.Name}</strong>
                  <span className="duo-level-meta">
                    <span><FiTarget /> {level.QuestionCount} câu</span>
                    <span><FiClock /> {level.TimeLimit}s</span>
                  </span>
                  {!locked && (
                    <span className="duo-level-stars" aria-label={`${stars} sao`}>
                      {[1, 2, 3].map((star) => <FiStar key={star} className={star <= stars ? 'is-lit' : ''} />)}
                      {level.UserScore > 0 && <b>{level.UserScore}%</b>}
                    </span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Games;
