import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiHeadphones,
  FiPlay,
  FiTarget
} from 'react-icons/fi';

import { receptiveApi } from '../../api/receptiveApi';
import Loading from '../common/Loading';
import { receptiveSkillMeta } from './receptiveMeta';

const normalizeLesson = (lesson, skill) => ({
  ...lesson,
  level: lesson.level || '',
  topic: lesson.topic || '',
  duration: lesson.duration || '',
  description: lesson.description || '',
  questionCount: lesson.questionCount ?? 0,
  sourceSkill: skill
});

const ReceptiveLessonList = ({ skill }) => {
  const navigate = useNavigate();
  const meta = receptiveSkillMeta[skill];
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const SkillIcon = skill === 'listening' ? FiHeadphones : FiBookOpen;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);

    receptiveApi.getLessons(skill)
      .then((res) => {
        if (cancelled) return;
        const apiLessons = res.data?.lessons || [];
        setLessons(apiLessons.map((lesson) => normalizeLesson(lesson, skill)));
      })
      .catch(() => {
        if (cancelled) return;
        setLessons([]);
        setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [skill]);

  const completedCount = lessons.filter((lesson) => lesson.isCompleted).length;

  if (loading) return <Loading />;

  return (
    <div className="receptive-page fade-in" style={{ '--receptive-accent': meta.accent }}>
      <button type="button" className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate('/courses')}>
        <FiArrowLeft /> Về trang khóa học
      </button>

      <section className="receptive-hero">
        <div>
          <span className="receptive-eyebrow">{meta.subtitle}</span>
          <h1>{meta.title}</h1>
          <div className="receptive-hero-stats">
            <span><FiTarget /> {lessons.length} bài học</span>
            <span><FiCheck /> {completedCount} đã hoàn thành</span>
          </div>
        </div>
        <div className="receptive-hero-mark">
          <SkillIcon />
        </div>
      </section>

      <section className="receptive-section">
        <div className="receptive-section-title">
          <div>
            <h2>Lộ trình gợi ý</h2>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="receptive-empty">
            <FiAlertCircle />
            <h3>{loadError ? 'Không tải được dữ liệu' : 'Chưa có bài học trong database'}</h3>
            <p>
              {loadError
                ? 'Kiểm tra API, token đăng nhập hoặc biến VITE_API_URL khi deploy.'
                : 'Hãy seed Listening/Reading vào PostgreSQL để trang này hiển thị bài học.'}
            </p>
          </div>
        ) : (
          <div className="receptive-lesson-grid">
            {lessons.map((lesson, index) => {
              const score = Number(lesson.score || 0);
              const completed = Boolean(lesson.isCompleted);
              const locked = Boolean(lesson.isLocked);

              return (
                <motion.button
                  key={lesson.id}
                  type="button"
                  className="receptive-lesson-card"
                  disabled={locked}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/${skill}/lessons/${lesson.id}`)}
                >
                  <span className="receptive-level">{lesson.level || 'Chưa đặt cấp độ'}</span>
                  <div className="receptive-card-top">
                    <span className="receptive-card-index">
                      {completed ? <FiCheck /> : index + 1}
                    </span>
                    <span className="receptive-topic">{lesson.topic || 'Chưa có chủ đề'}</span>
                  </div>

                  <h3>{lesson.title}</h3>
                  <p>{lesson.description || 'Chưa có mô tả trong database.'}</p>

                  <div className="receptive-card-meta">
                    <span><FiClock /> {lesson.duration || 'Chưa đặt thời lượng'}</span>
                    <span>{lesson.questionCount} câu hỏi</span>
                  </div>

                  <div className="receptive-card-footer">
                    <span>{locked ? 'Cần hoàn thành bài trước' : completed ? `Điểm tốt nhất: ${score}%` : 'Bắt đầu luyện tập'}</span>
                    {!locked && <FiPlay />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReceptiveLessonList;
