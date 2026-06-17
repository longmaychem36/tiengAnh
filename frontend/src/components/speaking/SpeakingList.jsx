import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiLock,
  FiMic,
  FiPlay,
  FiTarget
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { speakingApi } from '../../api/speakingApi';
import Loading from '../common/Loading';

const SpeakingList = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    speakingApi.getLessons()
      .then((res) => setLessons(res.data.lessons || []))
      .catch((err) => {
        console.error(err);
        toast.error('Lỗi tải danh sách chủ đề nói');
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const completed = lessons.filter((lesson) => lesson.isCompleted).length;
    const questionCount = lessons.reduce((sum, lesson) => sum + Number(lesson.questionCount || 0), 0);
    return { completed, questionCount };
  }, [lessons]);

  if (loading) return <Loading />;

  return (
    <div className="receptive-page fade-in" style={{ '--receptive-accent': '#2563eb' }}>
      <button type="button" className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate('/speaking/options')}>
        <FiArrowLeft /> Về lựa chọn nói
      </button>

      <section className="receptive-hero">
        <div>
          <span className="receptive-eyebrow">Khóa luyện nói</span>
          <h1>Luyện nói theo lộ trình</h1>
          <div className="receptive-hero-stats">
            <span><FiTarget /> {lessons.length} chủ đề</span>
            <span><FiCheck /> {summary.completed} đã hoàn thành</span>
            <span><FiMic /> {summary.questionCount} câu luyện nói</span>
          </div>
        </div>
        <div className="receptive-hero-mark">
          <FiMic />
        </div>
      </section>

      <section className="receptive-section">
        <div className="receptive-section-title">
          <div>
            <h2>Lộ trình chủ đề</h2>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="receptive-empty">
            <FiMic />
            <h2>Chưa có chủ đề nào</h2>
            <p>Quản trị viên cần thêm dữ liệu Speaking trước khi người học bắt đầu.</p>
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
                  onClick={() => navigate(`/speaking/lessons/${lesson.id}`)}
                >
                  <span className="receptive-level">{lesson.level || 'Chưa đặt cấp độ'}</span>
                  <div className="receptive-card-top">
                    <span className="receptive-card-index">
                      {isLocked ? <FiLock /> : isCompleted ? <FiCheck /> : index + 1}
                    </span>
                    <span className="receptive-topic">Nói</span>
                  </div>

                  <h3>{lesson.title}</h3>
                  <p>{lesson.description || 'Chưa có mô tả trong database.'}</p>

                  <div className="receptive-card-meta">
                    <span><FiClock /> {lesson.duration || 'Chưa đặt thời lượng'}</span>
                    <span>{lesson.questionCount} câu luyện tập</span>
                  </div>

                  <div className="receptive-card-footer">
                    <span>{isLocked ? 'Cần hoàn thành bài trước' : isCompleted ? 'Đã hoàn thành' : 'Bắt đầu luyện nói'}</span>
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

export default SpeakingList;
