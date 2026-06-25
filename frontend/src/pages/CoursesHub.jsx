import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SoftIcon from '../components/common/SoftIcon';
import { useAuth } from '../hooks/useAuth';

const skills = [
  {
    id: 'listening',
    icon: 'listening',
    name: 'Nghe',
    subtitle: 'Kỹ năng nghe',
    desc: 'Nghe hội thoại, đọc transcript và trả lời câu hỏi kiểm tra mức hiểu.',
    route: '/listening/lessons',
    color: '#0e7490',
    ready: true,
    plusOnly: true
  },
  {
    id: 'reading',
    icon: 'reading',
    name: 'Đọc',
    subtitle: 'Kỹ năng đọc',
    desc: 'Đọc đoạn văn theo chủ đề, học từ vựng trọng tâm và luyện đọc hiểu.',
    route: '/reading/lessons',
    color: '#7c3aed',
    ready: true
  },
  {
    id: 'speaking',
    icon: 'speaking',
    name: 'Nói',
    subtitle: 'Kỹ năng nói',
    desc: 'Ghi âm câu trả lời, nhận điểm phát âm và luyện phản xạ nói.',
    route: '/speaking/options',
    color: '#c2410c',
    ready: true,
    plusOnly: true
  },
  {
    id: 'writing',
    icon: 'writing',
    name: 'Viết',
    subtitle: 'Kỹ năng viết',
    desc: 'Ghép câu, sửa lỗi ngữ pháp và luyện viết đoạn văn ngắn.',
    route: '/writing/lessons',
    color: '#15803d',
    ready: true
  },
  {
    id: 'games',
    icon: 'games',
    name: 'Mini game',
    subtitle: 'Ôn tập nhanh',
    desc: 'Ôn lại từ vựng và mẫu câu bằng bài chơi ngắn, nhịp nhanh.',
    route: '/games',
    color: '#b45309',
    ready: true
  }
];

const skillOrder = {
  games: 0,
  reading: 1,
  writing: 2,
  listening: 3,
  speaking: 4
};

function CoursesHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPlus = Boolean(user?.isPlus || user?.plan === 'plus');
  const orderedSkills = [...skills].sort((a, b) => skillOrder[a.id] - skillOrder[b.id]);

  const handleSelectSkill = (skill) => {
    if (!skill.ready) {
      toast('Khóa học này đang được phát triển!', { icon: '🔒' });
      return;
    }

    if (skill.plusOnly && !isPlus) {
      toast('Listening và Speaking là tính năng Plus.');
      navigate('/profile');
      return;
    }

    navigate(skill.route);
  };

  return (
    <div className="courses-redesign">
      <section className="courses-hero">
        <div>
          <span className="course-kicker">Lộ trình học</span>
          <h1>Lộ trình kỹ năng</h1>
          <p>
            Chọn phần luyện tập phù hợp với mục tiêu hiện tại và bắt đầu ngay.
          </p>
        </div>
        <div className="course-hero-media" aria-hidden="true">
          <img src="/landing/features/skill-lessons.png" alt="" />
        </div>
      </section>

      <section className="course-skill-board" aria-label="Danh sách kỹ năng">
          {orderedSkills.map((skill, index) => (
          <motion.button
            key={skill.id}
            type="button"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`course-skill-row ${skill.ready ? '' : 'is-disabled'} ${skill.plusOnly && !isPlus ? 'is-plus-locked' : ''}`}
            style={{ '--skill-color': skill.color }}
            onClick={() => handleSelectSkill(skill)}
          >
            {!skill.ready && (
              <span className="course-lock-badge">
                Sắp ra mắt
              </span>
            )}
            {skill.plusOnly && !isPlus && (
              <span className="course-lock-badge">
                Plus
              </span>
            )}
            <span className="course-skill-image course-skill-icon-tile">
              <SoftIcon name={skill.icon} className="course-soft-icon" />
            </span>
            <span className="course-skill-copy">
              <span className="course-skill-meta">{skill.subtitle}</span>
              <strong>{skill.name}</strong>
              <span>{skill.desc}</span>
            </span>
            <span className="course-skill-action">
              {skill.plusOnly && !isPlus ? 'Nâng cấp' : 'Bắt đầu'}
            </span>
          </motion.button>
        ))}
      </section>
    </div>
  );
}

export default CoursesHub;
