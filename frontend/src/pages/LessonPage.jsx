// ============================================
// Lesson Page
// ============================================
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiVolume2, FiCheck } from 'react-icons/fi';
import { lessonApi } from '../api/lessonApi';
import { progressApi } from '../api/progressApi';
import toast from 'react-hot-toast';
import Loading from '../components/common/Loading';

function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lessonApi.getById(id)
      .then(res => setLesson(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleComplete = async () => {
    try {
      await progressApi.updateLesson({ lessonId: id, status: 'completed', score: 100 });
      toast.success('Lesson completed! +50 EXP 🎉');
    } catch {
      toast.error('Failed to update progress');
    }
  };

  if (loading) return <Loading />;
  if (!lesson) return <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Lesson not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div className="badge badge-primary" style={{ marginBottom: 'var(--space-2)' }}>
            {lesson.CourseTitle}
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>{lesson.Title}</h1>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
            Type: {lesson.Type} {lesson.LevelName && `• ${lesson.LevelName}`}
          </div>
        </div>

        {/* Content */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ lineHeight: 1.8, fontSize: 'var(--font-size-base)' }}
            dangerouslySetInnerHTML={{ __html: lesson.Content?.replace(/\n/g, '<br/>') || 'No content available.' }}
          />
        </div>

        {/* Media */}
        {lesson.media?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Media</h2>
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

        {/* Vocabulary */}
        {lesson.vocabulary?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              Vocabulary ({lesson.vocabulary.length} words)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {lesson.vocabulary.map(v => (
                <div key={v.Id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{v.Word}</span>
                    <span style={{ color: 'var(--color-text-muted)', margin: '0 var(--space-2)' }}>—</span>
                    <span>{v.Meaning}</span>
                    {v.Example && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 4, fontStyle: 'italic' }}>"{v.Example}"</p>}
                  </div>
                  {v.AudioUrl && (
                    <button className="btn btn-icon btn-ghost" onClick={() => new Audio(v.AudioUrl).play()}>
                      <FiVolume2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Button */}
        <button className="btn btn-primary btn-lg w-full" onClick={handleComplete}>
          <FiCheck size={20} />
          Mark as Completed
        </button>
      </motion.div>
    </div>
  );
}

export default LessonPage;
