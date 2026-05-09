import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiCheck, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { writingApi } from '../../api/writingApi';
import Loading from '../common/Loading';

const WritingList = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    writingApi.getLessons()
      .then(res => setLessons(res.data.lessons || []))
      .catch(err => {
        console.error(err);
        toast.error('Lỗi tải danh sách chủ đề viết');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')} style={{ marginBottom: 'var(--space-4)', padding: 0 }}>
        <FiArrowLeft /> Về trang khóa học
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 'var(--space-8)', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: 'var(--space-8)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
            <FiEdit3 size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>Luyện Viết (Writing)</h1>
            <p style={{ opacity: 0.9 }}>Rèn luyện kỹ năng dịch và viết qua các chủ đề thông dụng</p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {lessons.map((lesson, i) => {
          const isLocked = lesson.isLocked;
          const isCompleted = lesson.isCompleted;

          return (
            <motion.div key={lesson.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div 
                className={`card ${!isLocked ? 'hover-scale' : ''}`}
                onClick={() => { if (!isLocked) navigate(`/writing/lessons/${lesson.id}`) }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 'var(--space-5)', 
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.6 : 1,
                  padding: 'var(--space-5)'
                }}
              >
                <div style={{
                  width: 48, height: 48, flexShrink: 0, borderRadius: 'var(--radius-full)',
                  background: isCompleted ? '#10b981' : isLocked ? '#e2e8f0' : '#d1fae5',
                  color: isCompleted ? 'white' : isLocked ? '#94a3b8' : '#059669',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 'var(--font-size-lg)'
                }}>
                  {isLocked ? <FiLock /> : isCompleted ? <FiCheck /> : i + 1}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', marginBottom: 4 }}>
                    {lesson.title}
                  </h3>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {lesson.description} • {lesson.exerciseCount} bài tập
                  </div>
                </div>

                {!isLocked && (
                  <div style={{ color: '#10b981' }}>
                    <FiEdit3 size={24} />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
        {lessons.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
            Chưa có chủ đề nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingList;
