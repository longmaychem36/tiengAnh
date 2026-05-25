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
import CourseGuide from '../common/CourseGuide';

const getLevelLabel = (index) => {
  if (index < 2) return 'A1';
  if (index < 4) return 'A2';
  if (index < 6) return 'B1';
  return 'B2';
};

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
        <FiArrowLeft /> Về lựa chọn Speaking
      </button>

      <section className="receptive-hero">
        <div>
          <span className="receptive-eyebrow">Speaking course</span>
          <h1>Luyện Nói Theo Lộ Trình</h1>
          <p>Chọn chủ đề, nghe câu hỏi mẫu, đọc một câu trả lời đã chọn và nhận phản hồi phát âm sau mỗi lượt ghi âm.</p>
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

      <CourseGuide
        storageKey="speaking_course_guide_seen"
        title="Luyện Nói"
        description="Hướng dẫn này chỉ hiện một lần. Trong bài học, hãy chọn câu mẫu rồi ghi âm trực tiếp để nhận phản hồi."
        steps={[
          'Nghe câu hỏi và chọn một câu trả lời mẫu bạn muốn luyện.',
          'Nghe mẫu câu trả lời nếu cần, sau đó bấm micro để ghi âm.',
          'Bấm lại để dừng, xem điểm và luyện lại đến khi đạt ngưỡng.'
        ]}
      />

      <section className="receptive-section">
        <div className="receptive-section-title">
          <div>
            <h2>Lộ trình chủ đề</h2>
            <p>Hoàn thành từng chủ đề để mở khóa bài tiếp theo. Bài đã khóa sẽ tự mở khi bạn hoàn thành bài trước đó.</p>
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
                  <span className="receptive-level">{getLevelLabel(index)}</span>
                  <div className="receptive-card-top">
                    <span className="receptive-card-index">
                      {isLocked ? <FiLock /> : isCompleted ? <FiCheck /> : index + 1}
                    </span>
                    <span className="receptive-topic">Speaking</span>
                  </div>

                  <h3>{lesson.title}</h3>
                  <p>Luyện trả lời câu hỏi theo chủ đề, nghe mẫu và ghi âm để hệ thống chấm độ khớp.</p>

                  <div className="receptive-card-meta">
                    <span><FiClock /> 8-12 phút</span>
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
