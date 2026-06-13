import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiEdit3,
  FiLock,
  FiPlay,
  FiTarget
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { writingApi } from '../../api/writingApi';
import Loading from '../common/Loading';

const getLevelLabel = (index) => {
  if (index < 2) return 'A1';
  if (index < 4) return 'A2';
  if (index < 6) return 'B1';
  return 'B2';
};

const WritingList = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    writingApi.getLessons()
      .then((res) => setLessons(res.data.lessons || []))
      .catch((err) => {
        console.error(err);
        toast.error('Lỗi tải danh sách chủ đề viết');
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const completed = lessons.filter((lesson) => lesson.isCompleted).length;
    const exerciseCount = lessons.reduce((sum, lesson) => sum + Number(lesson.exerciseCount || 0), 0);
    return { completed, exerciseCount };
  }, [lessons]);

  if (loading) return <Loading />;

  return (
    <div className="receptive-page fade-in" style={{ '--receptive-accent': '#059669' }}>
      <button type="button" className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate('/courses')}>
        <FiArrowLeft /> Về trang khóa học
      </button>

      <section className="receptive-hero">
        <div>
          <span className="receptive-eyebrow">Khóa luyện viết</span>
          <h1>Luyện viết theo lộ trình</h1>
          <div className="receptive-hero-stats">
            <span><FiTarget /> {lessons.length} chủ đề</span>
            <span><FiCheck /> {summary.completed} đã hoàn thành</span>
            <span><FiEdit3 /> {summary.exerciseCount} bài tập viết</span>
          </div>
        </div>
        <div className="receptive-hero-mark">
          <FiEdit3 />
        </div>
      </section>

      <section className="receptive-section">
        <div className="receptive-section-title">
          <div>
            <h2>Lộ trình viết</h2>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="receptive-empty">
            <FiEdit3 />
            <h2>Chưa có chủ đề nào</h2>
            <p>Quản trị viên cần thêm dữ liệu Writing trước khi người học bắt đầu.</p>
          </div>
        ) : (
          <div className="receptive-lesson-grid">
            {lessons.map((lesson, index) => {
              const isLocked = lesson.isLocked;
              const isCompleted = lesson.isCompleted;

              return (
                <motion.button
                  key={lesson.id}
                  type="button"
                  className="receptive-lesson-card"
                  disabled={isLocked}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/writing/lessons/${lesson.id}`)}
                >
                  <span className="receptive-level">{getLevelLabel(index)}</span>
                  <div className="receptive-card-top">
                    <span className="receptive-card-index">
                      {isLocked ? <FiLock /> : isCompleted ? <FiCheck /> : index + 1}
                    </span>
                    <span className="receptive-topic">Viết</span>
                  </div>

                  <h3>{lesson.title}</h3>
                  <p>{lesson.description || 'Luyện viết câu theo ngữ cảnh và ghép thành đoạn hoàn chỉnh.'}</p>

                  <div className="receptive-card-meta">
                    <span><FiClock /> 10-15 phút</span>
                    <span>{lesson.exerciseCount} bài tập</span>
                  </div>

                  <div className="receptive-card-footer">
                    <span>{isLocked ? 'Cần hoàn thành bài trước' : isCompleted ? 'Đã hoàn thành' : 'Bắt đầu luyện viết'}</span>
                    {!isLocked && <FiPlay />}
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

export default WritingList;
