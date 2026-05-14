// ============================================
// Courses Hub - 4 Skills + Mini Games
// ============================================
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiEdit3, FiHeadphones, FiLock, FiMic, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

function CoursesHub() {
  const navigate = useNavigate();

  const skills = [
    { id: 'listening', name: 'Nghe', subtitle: 'Listening', icon: FiHeadphones, desc: 'Luyện nghe hiểu qua hội thoại và bài test.', color: '#0e7490', ready: false },
    { id: 'speaking', name: 'Nói', subtitle: 'Speaking', icon: FiMic, desc: 'Luyện phát âm, ghi âm và chấm điểm.', color: '#0f766e', ready: true },
    { id: 'reading', name: 'Đọc', subtitle: 'Reading', icon: FiBookOpen, desc: 'Mở rộng vốn từ và đọc hiểu.', color: '#0e7490', ready: false },
    { id: 'writing', name: 'Viết', subtitle: 'Writing', icon: FiEdit3, desc: 'Ghép câu, ngữ pháp và viết đoạn văn.', color: '#0f766e', ready: true },
    { id: 'games', name: 'Mini Games', subtitle: 'Arcade', icon: FiZap, desc: 'Ôn tập qua nối từ, nghe chọn và đúng/sai.', color: '#0e7490', ready: true }
  ];

  const handleSelectSkill = (skill) => {
    if (!skill.ready) {
      toast('Khóa học này đang được phát triển!', { icon: '🔒' });
      return;
    }
    if (skill.id === 'speaking') navigate('/speaking/options');
    else if (skill.id === 'writing') navigate('/writing/lessons');
    else if (skill.id === 'games') navigate('/games');
  };

  return (
    <div className="lingo-courses-page">
      <section className="lingo-section-title lingo-centered-title">
        <span className="lingo-eyebrow">Learning paths</span>
        <h1>Chọn kỹ năng muốn luyện</h1>
        <p>Giao diện web lấy cảm hứng từ app học ngôn ngữ: rõ ràng, thân thiện và nhiều điểm nhấn trực quan.</p>
      </section>

      <div className="lingo-skill-grid">
        {skills.map((skill, index) => (
          <motion.button
            key={skill.id}
            type="button"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`lingo-skill-card ${skill.ready ? '' : 'is-disabled'}`}
            style={{ '--skill-color': skill.color }}
            onClick={() => handleSelectSkill(skill)}
          >
            {!skill.ready && <span className="lingo-lock-badge"><FiLock /> Sắp ra mắt</span>}
            <span className="lingo-skill-icon"><skill.icon /></span>
            <span className="lingo-skill-subtitle">{skill.subtitle}</span>
            <strong>{skill.name}</strong>
            <p>{skill.desc}</p>
            {skill.ready && <span className="lingo-skill-cta">Bắt đầu →</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default CoursesHub;
