import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlay, FiCheck, FiMic, FiHeadphones, FiEdit3, FiBookOpen, FiStar, FiLock } from 'react-icons/fi';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';

function SkillCourse() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [set, setSet] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const getIcon = () => {
    if (type === 'speaking') return <FiMic size={32} />;
    if (type === 'listening') return <FiHeadphones size={32} />;
    if (type === 'reading') return <FiBookOpen size={32} />;
    return <FiEdit3 size={32} />;
  };

  const getTitle = () => {
    if (type === 'speaking') return 'Khoá Học Luyện Nói';
    if (type === 'listening') return 'Khoá Học Luyện Nghe';
    if (type === 'reading') return 'Khoá Học Luyện Đọc';
    return 'Khoá Học Luyện Viết';
  };

  useEffect(() => {
    // We get sets, filter by type, then get levels of the first matching set.
    // In a full production system, we might have multiple sets per skill. For now, we take the first.
    gameApi.getSets()
      .then(async (res) => {
        const sets = res.data || [];
        const matchedSet = sets.find(s => s.GameType === type);
        if (matchedSet) {
          setSet(matchedSet);
          try {
            const levelRes = await gameApi.getLevels(matchedSet.Id);
            setLevels(levelRes.data || []);
          } catch (e) {
            setLevels([]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <Loading />;

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
        <FiArrowLeft /> Về Trung tâm Khoá học
      </button>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ marginBottom: 'var(--space-8)', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: 'var(--space-8)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
            {getIcon()}
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>{getTitle()}</h1>
            <p style={{ opacity: 0.9 }}>{set ? set.Description : 'Chưa có dữ liệu.'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)', opacity: 0.85 }}>
          <span>📚 {levels.length} Cấp độ phát âm</span>
          <span>👤 Giảng viên: Hệ thống AI</span>
        </div>
      </motion.div>

      {/* Syllabus List */}
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        Lộ Trình Học Tập
      </h2>
      
      {!set && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          Khoá học đang được cập nhật.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {levels.map((level, i) => {
          const locked = level.IsLocked;
          const completed = level.UserCompleted;

          return (
            <motion.div key={level.Id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div 
                className="card hover-scale" 
                onClick={() => { if (!locked) navigate(`/games/play/${level.Id}`) }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 'var(--space-5)', 
                  cursor: locked ? 'not-allowed' : 'pointer',
                  opacity: locked ? 0.6 : 1,
                  padding: 'var(--space-5)'
                }}
              >
                {/* Level Icon */}
                <div style={{
                  width: 50, height: 50, flexShrink: 0,
                  borderRadius: 'var(--radius-lg)',
                  background: completed ? '#10b981' : locked ? '#e2e8f0' : 'var(--color-primary-light)',
                  color: completed ? 'white' : locked ? '#94a3b8' : 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 'var(--font-size-lg)'
                }}>
                  {locked ? <FiLock size={20} /> : completed ? <FiCheck size={24} /> : i + 1}
                </div>
                
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', marginBottom: 4, color: locked ? 'var(--color-text-muted)' : 'inherit' }}>
                    {level.Name}
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    <span>{level.QuestionCount} bài tập</span>
                    {completed && <span style={{ color: '#10b981', fontWeight: 600 }}>• Đã hoàn thành</span>}
                  </div>
                </div>

                {/* Score / Action */}
                {!locked && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    {level.UserScore > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fef3c7', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: '#d97706', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                        <FiStar fill="#f59e0b" color="#f59e0b" /> {level.UserScore}%
                      </div>
                    )}
                    <FiPlay size={24} style={{ color: 'var(--color-primary)' }} />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}

export default SkillCourse;
