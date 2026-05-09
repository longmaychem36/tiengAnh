// ============================================
// Games Page — Set List + Level Map (Candy Crush Style + Progress)
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiStar, FiChevronRight, FiArrowLeft, FiPlay, FiCheck } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';

function Games() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [levels, setLevels] = useState([]);
  const [activeSet, setActiveSet] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFilter = searchParams.get('type');

  useEffect(() => {
    gameApi.getSets()
      .then(res => {
        let loadedSets = res.data || [];
        if (typeFilter) {
          loadedSets = loadedSets.filter(s => s.GameType === typeFilter);
        }
        setSets(loadedSets);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const loadLevels = async (set) => {
    setActiveSet(set);
    try {
      const res = await gameApi.getLevels(set.Id);
      setLevels(res.data || []);
    } catch { setLevels([]); }
  };

  const goBack = () => { setActiveSet(null); setLevels([]); };
  const playLevel = (level) => { if (!level.IsLocked) navigate(`/games/play/${level.Id}`); };

  if (loading) return <Loading />;

  // ========== LEVEL MAP (Candy Crush) ==========
  if (activeSet) {
    const diffColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{activeSet.Icon}</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{activeSet.Name}</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{activeSet.Description}</p>
        </div>

        {/* Level Path */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)', position: 'relative', paddingBottom: 'var(--space-8)' }}>
          {/* Connecting line */}
          <div style={{ position: 'absolute', top: 40, bottom: 40, width: 3, background: 'var(--color-border)', zIndex: 0 }} />

          {levels.map((level, i) => {
            const locked = level.IsLocked;
            const completed = level.UserCompleted;
            const stars = level.UserStars || 0;
            const dc = diffColors[level.Difficulty] || '#6366f1';

            return (
              <motion.div
                key={level.Id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => playLevel(level)}
                style={{
                  position: 'relative', zIndex: 1,
                  width: 290, padding: 'var(--space-5)',
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: completed ? `2px solid ${dc}` : '2px solid var(--color-border)',
                  cursor: locked ? 'not-allowed' : 'pointer',
                  opacity: locked ? 0.45 : 1,
                  boxShadow: !locked ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  marginLeft: i % 2 === 0 ? '-70px' : '70px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      {locked ? (
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiLock size={16} style={{ color: '#94a3b8' }} />
                        </div>
                      ) : (
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: completed ? dc : 'var(--color-primary)',
                          color: 'white', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: 800, fontSize: 'var(--font-size-sm)'
                        }}>
                          {completed ? <FiCheck size={16} /> : level.LevelNumber}
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-size-base)', display: 'block' }}>{level.Name}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{level.QuestionCount} câu · {level.TimeLimit}s</span>
                      </div>
                    </div>

                    {/* Stars row */}
                    {!locked && (
                      <div style={{ display: 'flex', gap: 3, marginTop: 6, marginLeft: 44 }}>
                        {[1, 2, 3].map(s => (
                          <FiStar key={s} size={18} style={{ color: s <= stars ? '#f59e0b' : '#e2e8f0', fill: s <= stars ? '#f59e0b' : 'none' }} />
                        ))}
                        {level.UserScore > 0 && (
                          <span style={{ marginLeft: 8, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{level.UserScore}%</span>
                        )}
                      </div>
                    )}
                  </div>

                  {!locked && (
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: completed ? dc : 'var(--color-primary)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FiPlay size={16} />
                    </div>
                  )}
                </div>

                {/* Difficulty badge */}
                <div style={{
                  position: 'absolute', top: -10, right: 16,
                  padding: '2px 12px', borderRadius: 'var(--radius-full)',
                  background: dc, color: 'white',
                  fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase'
                }}>
                  {level.Difficulty}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ========== GAME SETS ==========
  const typeColors = {
    matching: { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', ring: '#c4b5fd' },
    listening: { bg: 'linear-gradient(135deg, #f59e0b, #ef4444)', ring: '#fcd34d' },
    sentence: { bg: 'linear-gradient(135deg, #ec4899, #8b5cf6)', ring: '#f9a8d4' }
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FiPlay style={{ color: 'var(--color-primary)' }} /> 
          {typeFilter === 'listening' ? 'Khoá Học Nghe' : 
           typeFilter === 'speaking' ? 'Khoá Học Nói' : 
           typeFilter === 'matching' ? 'Khoá Học Đọc' : 
           typeFilter === 'sentence' ? 'Khoá Học Viết' : 'Mini Games'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)', marginTop: 'var(--space-2)' }}>
          {typeFilter ? 'Hoàn thành các chặng đường để chinh phục kỹ năng.' : 'Hoàn thành các bộ game để nhận thật nhiều EXP và phần thưởng.'}
        </p>
      </div>

      {sets.length === 0 && <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>Chưa có game nào.</div>}

      <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
        {sets.map((set, i) => {
          const colors = typeColors[set.GameType] || typeColors.matching;
          const completedLevels = set.CompletedLevels || 0;
          const totalLevels = set.LevelCount || 0;
          const totalStars = set.TotalStars || 0;
          const maxStars = set.MaxStars || totalLevels * 3;
          const progressPct = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

          return (
            <motion.div
              key={set.Id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => loadLevels(set)}
              style={{ cursor: 'pointer', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'white', transition: 'transform 0.2s, box-shadow 0.2s' }}
            >
              {/* Header gradient */}
              <div style={{ background: colors.bg, padding: 'var(--space-8) var(--space-6)', textAlign: 'center', color: 'white', position: 'relative' }}>
                <div style={{ fontSize: 52, marginBottom: 8 }}>{set.Icon}</div>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 4 }}>{set.Name}</h2>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '3px 14px', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                  {set.GameType.toUpperCase()}
                </span>

                {/* Completion badge */}
                {set.IsSetCompleted && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: '#10b981', color: 'white', borderRadius: 'var(--radius-full)', padding: '4px 10px', fontSize: 'var(--font-size-xs)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiCheck size={12} /> Hoàn thành
                  </div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: 'var(--space-4) var(--space-6)' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>{set.Description}</p>

                {/* Progress bar */}
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                    <span>{completedLevels}/{totalLevels} cấp độ</span>
                    <span>{totalStars}/{maxStars} stars</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: progressPct === 100 ? '#10b981' : 'var(--color-primary)', borderRadius: 'var(--radius-full)', width: `${progressPct}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{totalLevels} cấp độ</span>
                  <FiChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Games;
