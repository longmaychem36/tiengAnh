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
        alt={`${skill.subtitle} illustration`}
        onError={() => setExtensionIndex((index) => index + 1)}
      />
    </span>
  );
}

const skills = [
  {
    id: 'listening',
    name: 'Nghe',
    subtitle: 'Listening',
    icon: FiHeadphones,
    desc: 'Nghe hội thoại, đọc transcript và trả lời câu hỏi kiểm tra mức hiểu.',
    route: '/listening/lessons',
    color: '#0e7490',
    ready: true
  },
  {
    id: 'reading',
    name: 'Đọc',
    subtitle: 'Reading',
    icon: FiBookOpen,
    desc: 'Đọc đoạn văn theo chủ đề, học từ vựng trọng tâm và luyện đọc hiểu.',
    route: '/reading/lessons',
    color: '#7c3aed',
    ready: true
  },
  {
    id: 'speaking',
    name: 'Nói',
    subtitle: 'Speaking',
    icon: FiMic,
    desc: 'Ghi âm câu trả lời, nhận điểm phát âm và luyện phản xạ nói.',
    route: '/speaking/options',
    color: '#c2410c',
    ready: true
  },
  {
    id: 'writing',
    name: 'Viết',
    subtitle: 'Writing',
    icon: FiEdit3,
    desc: 'Ghép câu, sửa lỗi ngữ pháp và luyện viết đoạn văn ngắn.',
    route: '/writing/lessons',
    color: '#15803d',
    ready: true
  },
  {
    id: 'games',
    name: 'Mini Games',
    subtitle: 'Arcade',
    icon: FiZap,
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
          <span className="course-kicker">Learning paths</span>
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
          const Icon = skill.icon;

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
                <Icon />
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
