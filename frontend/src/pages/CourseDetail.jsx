// ============================================
// Course Detail Page
// ============================================
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiClock, FiPlay } from 'react-icons/fi';
import { courseApi } from '../api/courseApi';
import Loading from '../components/common/Loading';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.getById(id)
      .then(res => setCourse(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!course) return <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Course not found.</div>;

  return (
    <div>
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ marginBottom: 'var(--space-6)', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none' }}
      >
        <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: 'var(--space-3)' }}>
          {course.LevelName || 'All levels'}
        </div>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
          {course.Title}
        </h1>
        <p style={{ opacity: 0.9, marginBottom: 'var(--space-4)' }}>{course.Description}</p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)', opacity: 0.85 }}>
          <span>📚 {course.lessons?.length || 0} lessons</span>
          <span>👤 {course.CreatorName || 'Admin'}</span>
        </div>
      </motion.div>

      {/* Lessons List */}
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        Lessons
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {course.lessons?.map((lesson, i) => (
          <motion.div key={lesson.Id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={`/lessons/${lesson.Id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', cursor: 'pointer' }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 'var(--font-size-sm)', flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, marginBottom: 2 }}>{lesson.Title}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    <span>{lesson.Type || 'reading'}</span>
                    {lesson.LevelName && <span>• {lesson.LevelName}</span>}
                  </div>
                </div>
                <FiPlay size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
            </Link>
          </motion.div>
        ))}
        {(!course.lessons || course.lessons.length === 0) && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            No lessons available yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
