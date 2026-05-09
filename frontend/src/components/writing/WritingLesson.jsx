import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiXCircle, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { writingApi } from '../../api/writingApi';
import ProgressBar from '../speaking/ProgressBar'; // Reuse ProgressBar
import Loading from '../common/Loading';

const WritingLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);
  const [exercises, setExercises] = useState([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userText, setUserText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null); // { score, passed, feedback }
  
  const [showVocab, setShowVocab] = useState(false);

  useEffect(() => {
    writingApi.getLessonDetails(id)
      .then(res => {
        setLessonData(res.data.lesson);
        setExercises(res.data.exercises || []);
      })
      .catch(err => {
        toast.error('Lỗi tải bài viết');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const currentExercise = exercises[currentIndex];

  const handleCheck = async () => {
    if (!userText.trim()) {
      toast.error('Vui lòng nhập câu trả lời!');
      return;
    }
    
    setIsChecking(true);
    try {
      const res = await writingApi.checkWriting({
        userText: userText,
        targetText: currentExercise.correctAnswerEN
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kiểm tra bài viết');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
  };

  const handleNext = async () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex + 1 < exercises.length) {
        setResult(null);
        setUserText('');
        setShowVocab(false);
        return prevIndex + 1;
      } else {
        setLoading(true);
        writingApi.saveProgress({ lessonId: id, completed: true })
          .then(() => {
            toast.success('Chúc mừng! Bạn đã hoàn thành chủ đề viết!');
            navigate('/writing/lessons');
          })
          .catch(err => {
            toast.error('Lỗi lưu tiến độ');
            setLoading(false);
          });
        return prevIndex;
      }
    });
  };

  if (loading) return <Loading />;
  if (!currentExercise) return <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Bài học không có dữ liệu.</div>;

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/writing/lessons')} style={{ marginBottom: 'var(--space-4)', padding: 0 }}>
        <FiArrowLeft /> Thoát
      </button>

      <ProgressBar current={currentIndex + 1} total={exercises.length} />

      <div className="card" style={{ padding: 'var(--space-6)', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
        
        {/* Vietnamese Text */}
        <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <div style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Dịch sang Tiếng Anh:</div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text)' }}>
            "{currentExercise.contentVI}"
          </h2>
        </div>

        {/* Vocabulary Hints Toggle */}
        {currentExercise.vocab && currentExercise.vocab.length > 0 && !result && (
          <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            {!showVocab ? (
              <button className="btn btn-outline btn-sm" onClick={() => setShowVocab(true)} style={{ borderRadius: 'var(--radius-full)' }}>
                <FiBookOpen /> Xem gợi ý từ vựng
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Gợi ý từ vựng:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
                  {currentExercise.vocab.map((v, i) => (
                    <div key={i} style={{ background: 'white', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)' }}>
                      <strong style={{ color: 'var(--color-primary)' }}>{v.word}</strong>: {v.meaning}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            className="input"
            rows={4}
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            disabled={result != null || isChecking}
            placeholder="Nhập câu tiếng Anh của bạn vào đây..."
            style={{ width: '100%', resize: 'none', fontSize: 'var(--font-size-lg)', padding: 'var(--space-4)' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!result) handleCheck();
                else if (result.passed) handleNext();
                else handleRetry();
              }
            }}
          />

          {/* Results Area */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'var(--space-6)' }}>
                <div style={{ 
                  padding: 'var(--space-4)', 
                  borderRadius: 'var(--radius-lg)', 
                  background: result.passed ? '#d1fae5' : '#fee2e2',
                  border: `1px solid ${result.passed ? '#34d399' : '#f87171'}`,
                  color: 'var(--color-text)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', color: result.passed ? '#047857' : '#b91c1c', fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                    {result.passed ? <FiCheckCircle size={24} /> : <FiXCircle size={24} />}
                    {result.feedback} ({result.score}%)
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.7)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Đáp án đúng:</div>
                    <strong style={{ fontSize: 'var(--font-size-lg)', color: '#047857' }}>{currentExercise.correctAnswerEN}</strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
            {!result ? (
              <button 
                className="btn btn-primary" 
                onClick={handleCheck} 
                disabled={isChecking || !userText.trim()}
                style={{ minWidth: 160, padding: '12px 32px', fontSize: 'var(--font-size-lg)' }}
              >
                {isChecking ? 'Đang chấm...' : 'Kiểm tra'}
              </button>
            ) : (
              <>
                {!result.passed && (
                  <button className="btn btn-secondary" onClick={handleRetry} style={{ minWidth: 120 }}>
                    Thử lại
                  </button>
                )}
                <button 
                  className={result.passed ? "btn btn-primary" : "btn btn-outline"} 
                  onClick={handleNext}
                  style={{ minWidth: 120 }}
                >
                  {result.passed ? 'Tiếp tục' : 'Bỏ qua'} <FiArrowRight />
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WritingLesson;
