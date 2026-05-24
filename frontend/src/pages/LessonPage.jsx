// ============================================
// Lesson Page
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiVolume2, FiCheck, FiArrowRight } from 'react-icons/fi';
import { lessonApi } from '../api/lessonApi';
import { progressApi } from '../api/progressApi';
import toast from 'react-hot-toast';
import Loading from '../components/common/Loading';
import ExpReward from '../components/common/ExpReward';
import { playTrackedAudio, stopAllPlayback } from '../utils/audioControl';

function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [expReward, setExpReward] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setCompleted(false);
    setExpReward(null);
    setLesson(null);
    setNextLesson(null);

    lessonApi.getById(id)
      .then(async (res) => {
        if (cancelled) return;
        const currentLesson = res.data;
        setLesson(currentLesson);

        if (currentLesson?.CourseId) {
          try {
            const courseRes = await lessonApi.getByCourse(currentLesson.CourseId);
            if (cancelled) return;
            const lessons = courseRes.data || [];
            const currentIndex = lessons.findIndex(item => String(item.Id) === String(id));
            setNextLesson(currentIndex >= 0 ? lessons[currentIndex + 1] || null : null);
          } catch {
            setNextLesson(null);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stopAllPlayback();
    };
  }, [id]);

  const handleComplete = async () => {
    try {
      const res = await progressApi.updateLesson({ lessonId: id, status: 'completed', score: 100 });
      setExpReward(res.data?.expReward || null);
      setCompleted(true);
      toast.success(res.data?.expReward ? `Hoàn thành bài học! +${res.data.expReward.amount} EXP` : 'Bài học đã hoàn thành');
    } catch {
      toast.error('Không thể cập nhật tiến độ');
    }
  };

  if (loading) return <Loading />;
  if (!lesson) return <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Không tìm thấy bài học.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="badge badge-primary" style={{ marginBottom: 'var(--space-2)' }}>
            {lesson.CourseTitle}
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>{lesson.Title}</h1>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
            Loại: {lesson.Type} {lesson.LevelName && `- ${lesson.LevelName}`}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div
            style={{ lineHeight: 1.8, fontSize: 'var(--font-size-base)' }}
            dangerouslySetInnerHTML={{ __html: lesson.Content?.replace(/\n/g, '<br/>') || 'Chưa có nội dung.' }}
          />
        </div>

        {lesson.media?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Tài nguyên</h2>
            <div className="grid grid-2">
              {lesson.media.map(m => (
                <div key={m.Id} className="card">
                  {m.MediaType === 'image' && <img src={m.MediaUrl} alt={m.Description} style={{ borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)' }} />}
                  {m.MediaType === 'audio' && <audio controls src={m.MediaUrl} style={{ width: '100%' }} />}
                  {m.Description && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{m.Description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {lesson.vocabulary?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              Từ vựng ({lesson.vocabulary.length} từ)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {lesson.vocabulary.map(v => (
                <div key={v.Id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{v.Word}</span>
                    <span style={{ color: 'var(--color-text-muted)', margin: '0 var(--space-2)' }}>-</span>
                    <span>{v.Meaning}</span>
                    {v.Example && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 4, fontStyle: 'italic' }}>"{v.Example}"</p>}
                  </div>
                  {v.AudioUrl && (
                    <button className="btn btn-icon btn-ghost" onClick={() => playTrackedAudio(v.AudioUrl)}>
                      <FiVolume2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <button className="btn btn-primary btn-lg w-full" onClick={handleComplete} disabled={completed}>
            <FiCheck size={20} />
            {completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
          </button>

          {completed && <ExpReward reward={expReward} />}

          {completed && nextLesson && (
            <button className="btn btn-secondary btn-lg w-full" onClick={() => navigate(`/lessons/${nextLesson.Id}`)}>
              Chuyển sang bài tiếp theo
              <FiArrowRight size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default LessonPage;
