import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiBookOpen,
  FiEdit3,
  FiHeadphones,
  FiLock,
  FiMic,
  FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const SKILL_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg'];

function SkillImage({ skill }) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const Icon = skill.icon;
  const imageSrc = `/skills/${skill.id}.${SKILL_IMAGE_EXTENSIONS[extensionIndex]}`;

  if (extensionIndex >= SKILL_IMAGE_EXTENSIONS.length) {
    return (
      <span className="course-skill-fallback" aria-hidden="true">
        <Icon />
      </span>
    );
  }

  return (
    <span className="course-skill-image">
      <img
        src={imageSrc}
        alt={`${skill.name} minh họa`}
        onError={() => setExtensionIndex((index) => index + 1)}
      />
    </span>
  );
}

const skills = [
  {
    id: 'listening',
    name: 'Nghe',
    subtitle: 'Kỹ năng nghe',
    icon: FiHeadphones,
    iconImage: '/nav-icons/admin-listening.svg',
    desc: 'Nghe hội thoại, đọc transcript và trả lời câu hỏi kiểm tra mức hiểu.',
    route: '/listening/lessons',
    color: '#0e7490',
    ready: true
  },
  {
    id: 'reading',
    name: 'Đọc',
    subtitle: 'Kỹ năng đọc',
    icon: FiBookOpen,
    iconImage: '/nav-icons/admin-reading.svg',
    desc: 'Đọc đoạn văn theo chủ đề, học từ vựng trọng tâm và luyện đọc hiểu.',
    route: '/reading/lessons',
    color: '#7c3aed',
    ready: true
  },
  {
    id: 'speaking',
    name: 'Nói',
    subtitle: 'Kỹ năng nói',
    icon: FiMic,
    iconImage: '/nav-icons/admin-speaking.svg',
    desc: 'Ghi âm câu trả lời, nhận điểm phát âm và luyện phản xạ nói.',
    route: '/speaking/options',
    color: '#c2410c',
    ready: true
  },
  {
    id: 'writing',
    name: 'Viết',
    subtitle: 'Kỹ năng viết',
    icon: FiEdit3,
    iconImage: '/nav-icons/admin-writing.svg',
    desc: 'Ghép câu, sửa lỗi ngữ pháp và luyện viết đoạn văn ngắn.',
    route: '/writing/lessons',
    color: '#15803d',
    ready: true
  },
  {
    id: 'games',
    name: 'Mini game',
    subtitle: 'Ôn tập nhanh',
    icon: FiZap,
    iconImage: '/nav-icons/admin-games.svg',
    desc: 'Ôn lại từ vựng và mẫu câu bằng bài chơi ngắn, nhịp nhanh.',
    route: '/games',
    color: '#b45309',
    ready: true
  }
];

function CoursesHub() {
  const navigate = useNavigate();

  const handleSelectSkill = (skill) => {
    if (!skill.ready) {
      toast('Khóa học này đang được phát triển!', { icon: '🔒' });
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
          <img src="/skills/listening.jpg" alt="" />
          <img src="/skills/speaking.png" alt="" />
          <img src="/skills/writing.png" alt="" />
        </div>
      </section>

      <section className="course-skill-board" aria-label="Danh sách kỹ năng">
        {skills.map((skill, index) => {
          return (
            <motion.button
              key={skill.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`course-skill-row ${skill.ready ? '' : 'is-disabled'}`}
              style={{ '--skill-color': skill.color }}
              onClick={() => handleSelectSkill(skill)}
            >
              {!skill.ready && (
                <span className="course-lock-badge">
                  <FiLock /> Sắp ra mắt
                </span>
              )}
              <SkillImage skill={skill} />
              <span className="course-skill-icon" aria-hidden="true">
                <img src={skill.iconImage} alt="" />
              </span>
              <span className="course-skill-copy">
                <span className="course-skill-meta">{skill.subtitle}</span>
                <strong>{skill.name}</strong>
                <span>{skill.desc}</span>
              </span>
              <span className="course-skill-action">
                Bắt đầu <FiArrowRight />
              </span>
            </motion.button>
          );
        })}
      </section>
    </div>
  );
}

export default CoursesHub;
