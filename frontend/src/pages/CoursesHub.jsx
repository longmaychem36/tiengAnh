// ============================================
// Courses Hub — 4 Skills Overview
// ============================================
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeadphones, FiMic, FiBookOpen, FiEdit3, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

function CoursesHub() {
  const navigate = useNavigate();

  const skills = [
    { id: 'listening', name: 'Nghe (Listening)', icon: FiHeadphones, desc: 'Luyện nghe hiểu qua các đoạn hội thoại và bài test', color: '#3b82f6', ready: false },
    { id: 'speaking', name: 'Nói (Speaking)', icon: FiMic, desc: 'Luyện phát âm chuẩn AI theo cấp độ từ cơ bản đến nâng cao', color: '#10b981', ready: true },
    { id: 'reading', name: 'Đọc (Reading)', icon: FiBookOpen, desc: 'Nâng cao vốn từ vựng và khả năng đọc hiểu', color: '#f59e0b', ready: false },
    { id: 'writing', name: 'Viết (Writing)', icon: FiEdit3, desc: 'Luyện ghép câu, ngữ pháp và viết đoạn văn', color: '#ef4444', ready: true }
  ];

  const handleSelectSkill = (skill) => {
    if (!skill.ready) {
      toast('Khoá học này đang được phát triển!', { icon: '🔒' });
      return;
    }
    if (skill.id === 'speaking') {
      navigate('/speaking/lessons');
    } else if (skill.id === 'writing') {
      navigate('/writing/lessons');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)' }}>Khoá Học Tiếng Anh</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)', marginTop: 'var(--space-2)' }}>
          Phát triển toàn diện 4 kỹ năng
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', maxWidth: 1000, margin: '0 auto' }}>
        {skills.map((skill, idx) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card hover-scale"
            style={{
              cursor: skill.ready ? 'pointer' : 'default',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              padding: 'var(--space-8)', position: 'relative',
              opacity: skill.ready ? 1 : 0.55
            }}
            onClick={() => handleSelectSkill(skill)}
          >
            {/* Lock badge for coming soon */}
            {!skill.ready && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: '#f1f5f9', borderRadius: 'var(--radius-full)',
                padding: '4px 12px', fontSize: 'var(--font-size-xs)', fontWeight: 600,
                color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4
              }}>
                <FiLock size={12} /> Sắp ra mắt
              </div>
            )}

            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `${skill.color}20`, color: skill.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <skill.icon size={40} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{skill.name}</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{skill.desc}</p>

            {skill.ready && (
              <div style={{ marginTop: 'var(--space-4)' }}>
                <span className="btn btn-primary btn-sm" style={{ padding: '6px 20px' }}>Bắt đầu học →</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CoursesHub;
