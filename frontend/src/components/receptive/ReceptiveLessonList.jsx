import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiHeadphones,
  FiPlay,
  FiTarget
} from 'react-icons/fi';

import { getReceptiveLessons, receptiveSkillMeta } from '../../data/receptiveLessons';
import { receptiveApi } from '../../api/receptiveApi';
import CourseGuide from '../common/CourseGuide';
import Loading from '../common/Loading';

const getStoredProgress = (skill) => {
  try {
    return JSON.parse(localStorage.getItem(`${skill}_lesson_progress`) || '{}');
  } catch {
    return {};
  }
};

const normalizeLesson = (lesson, skill) => ({
  ...lesson,
  level: lesson.level || 'A1',
  topic: lesson.topic || '',
  duration: lesson.duration || '8-12 phút',
  description: lesson.description || '',
  questionCount: lesson.questionCount ?? lesson.questions?.length ?? 0,
  sourceSkill: skill
});

const ReceptiveLessonList = ({ skill }) => {
  const navigate = useNavigate();
  const meta = receptiveSkillMeta[skill];
  const [lessons, setLessons] = useState([]);
  const [source, setSource] = useState('static');
  const [loading, setLoading] = useState(true);
  const progress = useMemo(() => getStoredProgress(skill), [skill]);
  const SkillIcon = skill === 'listening' ? FiHeadphones : FiBookOpen;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    receptiveApi.getLessons(skill)
      .then((res) => {
        if (cancelled) return;
        const apiLessons = res.data?.lessons || [];
        if (apiLessons.length > 0) {
          setLessons(apiLessons.map((lesson) => normalizeLesson(lesson, skill)));
          setSource('api');
        } else {
          setLessons(getReceptiveLessons(skill).map((lesson) => normalizeLesson(lesson, skill)));
          setSource('static');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLessons(getReceptiveLessons(skill).map((lesson) => normalizeLesson(lesson, skill)));
        setSource('static');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [skill]);

  const completedCount = lessons.filter((lesson) => (
    source === 'api' ? lesson.isCompleted : progress[lesson.id]?.completed
  )).length;

  const guideSteps = skill === 'listening'
    ? [
      'Nghe toàn bài trước khi mở transcript.',
      'Trả lời câu hỏi theo trí nhớ, sau đó mới xem giải thích.',
      'Mở transcript để nghe lại những câu khó và luyện lại nếu điểm dưới 70%.'
    ]
    : [
      'Đọc lướt bài một lần để nắm ý chính.',
      'Trả lời câu hỏi, ưu tiên tìm thông tin trong đoạn văn thay vì đoán.',
      'Xem lại từ vựng được đánh dấu và luyện lại nếu điểm dưới 70%.'
    ];

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
          <p>{meta.description}</p>
          <div className="receptive-hero-stats">
            <span><FiTarget /> {lessons.length} bài học</span>
            <span><FiCheck /> {completedCount} đã hoàn thành</span>
          </div>
        </div>
        <div className="receptive-hero-mark">
          <SkillIcon />
        </div>
      </section>

      <CourseGuide
        storageKey={`${skill}_course_guide_seen`}
        title={meta.title}
        description="Hướng dẫn này chỉ hiện một lần trên máy hiện tại. Khi vào từng bài, màn làm bài sẽ được tối giản để tập trung luyện tập."
        steps={guideSteps}
      />

      <section className="receptive-section">
        <div className="receptive-section-title">
          <div>
            <h2>Lộ trình gợi ý</h2>
            <p>Học lần lượt từ dễ đến khó, mỗi bài gồm từ vựng, nội dung chính và bài kiểm tra hiểu.</p>
          </div>
        </div>

        <div className="receptive-lesson-grid">
          {lessons.map((lesson, index) => {
            const saved = progress[lesson.id];
            const score = Number(source === 'api' ? lesson.score || 0 : saved?.score || 0);
            const completed = source === 'api' ? lesson.isCompleted : Boolean(saved?.completed);
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
                <span className="receptive-level">{lesson.level}</span>
                <div className="receptive-card-top">
                  <span className="receptive-card-index">
                    {completed ? <FiCheck /> : index + 1}
                  </span>
                  <span className="receptive-topic">{lesson.topic || skill}</span>
                </div>

                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>

                <div className="receptive-card-meta">
                  <span><FiClock /> {lesson.duration}</span>
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
      </section>
    </div>
  );
};

export default ReceptiveLessonList;
