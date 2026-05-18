import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiXCircle, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { writingApi } from '../../api/writingApi';
import ProgressBar from '../speaking/ProgressBar';
import Loading from '../common/Loading';
import ExpReward from '../common/ExpReward';

const WRITING_PASS_SCORE = 80;

const lockedTextProps = {
  onCopy: (e) => e.preventDefault(),
  onCut: (e) => e.preventDefault(),
  onContextMenu: (e) => e.preventDefault(),
  onDragStart: (e) => e.preventDefault(),
  style: {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none'
  }
};

const canPassWriting = (result) => Number(result?.score || 0) > WRITING_PASS_SCORE;

const getPassageParts = (text, highlights) => {
  const source = text || '';
  const lowerSource = source.toLowerCase();
  const cleanHighlights = highlights
    .filter(Boolean)
    .map(item => item.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  const parts = [];
  let cursor = 0;

  while (cursor < source.length) {
    let next = null;

    cleanHighlights.forEach(highlight => {
      const index = lowerSource.indexOf(highlight.toLowerCase(), cursor);
      if (index !== -1 && (!next || index < next.index || (index === next.index && highlight.length > next.text.length))) {
        next = { index, text: source.slice(index, index + highlight.length) };
      }
    });

    if (!next) {
      parts.push({ text: source.slice(cursor), highlighted: false });
      break;
    }

    if (next.index > cursor) {
      parts.push({ text: source.slice(cursor, next.index), highlighted: false });
    }

    parts.push({ text: next.text, highlighted: true });
    cursor = next.index + next.text.length;
  }

  return parts;
};

const WritingLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [nextLesson, setNextLesson] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userText, setUserText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [expReward, setExpReward] = useState(null);
  
  const [showVocab, setShowVocab] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLessonData(null);
    setExercises([]);
    setNextLesson(null);
    setCurrentIndex(0);
    setUserText('');
    setResult(null);
    setShowCompletion(false);
    setExpReward(null);
    setShowVocab(false);

    Promise.all([
      writingApi.getLessonDetails(id),
      writingApi.getLessons().catch(() => null)
    ])
      .then(([res, lessonsRes]) => {
        if (cancelled) return;
        setLessonData(res.data.lesson);
        setExercises(res.data.exercises || []);

        const lessons = lessonsRes?.data?.lessons || [];
        const currentLessonIndex = lessons.findIndex(lesson => String(lesson.id) === String(id));
        setNextLesson(currentLessonIndex >= 0 ? lessons[currentLessonIndex + 1] || null : null);
      })
      .catch(err => {
        toast.error('Lỗi tải bài viết');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
    if (!canPassWriting(result)) {
      toast.error(`Bạn cần đạt trên ${WRITING_PASS_SCORE}% để qua câu này.`);
      return;
    }

    setCurrentIndex(prevIndex => {
      if (prevIndex + 1 < exercises.length) {
        setResult(null);
        setUserText('');
        setShowVocab(false);
        return prevIndex + 1;
      } else {
        setLoading(true);
        writingApi.saveProgress({ lessonId: id, completed: true })
          .then((res) => {
            setExpReward(res.data?.expReward || null);
            toast.success('Chúc mừng! Bạn đã hoàn thành chủ đề viết!');
            setShowCompletion(true);
            setLoading(false);
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
  if (showCompletion) {
    const passageEN = lessonData?.passageEN || exercises.map(ex => ex.correctAnswerEN).filter(Boolean).join(' ');
    const passageVI = lessonData?.passageVI || exercises.map(ex => ex.contentVI).filter(Boolean).join(' ');
    const passageParts = getPassageParts(passageEN, exercises.map(ex => ex.correctAnswerEN));

    return (
      <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <FiCheckCircle size={32} style={{ color: '#047857', flexShrink: 0 }} />
            <div>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: 4 }}>Hoàn thành chủ đề</div>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, margin: 0 }}>{lessonData?.title}</h1>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Bài văn hoàn chỉnh</div>
            <p style={{ fontSize: 'var(--font-size-lg)', lineHeight: 1.8, margin: 0 }}>
              {passageParts.map((part, index) => part.highlighted ? (
                <mark key={index} style={{ background: '#bbf7d0', color: '#065f46', padding: '2px 4px', borderRadius: 4 }}>
                  {part.text}
                </mark>
              ) : (
                <React.Fragment key={index}>{part.text}</React.Fragment>
              ))}
            </p>
          </div>

          {passageVI && (
            <div style={{ padding: 'var(--space-4)', borderLeft: '4px solid var(--color-primary)', background: 'white' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 700, marginBottom: 6 }}>Bản dịch tiếng Việt</div>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{passageVI}</p>
            </div>
          )}

          <div>
            <div style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>Các câu quan trọng vừa luyện</div>
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <ExpReward reward={expReward} />
              {exercises.map((ex, index) => (
                <div key={ex.id} style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Câu {index + 1}</div>
                  <div style={{ fontWeight: 600 }}>{ex.correctAnswerEN}</div>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>{ex.contentVI}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/writing/lessons')}>
              <FiArrowLeft /> Về danh sách
            </button>
            {nextLesson && (
              <button className="btn btn-primary" onClick={() => navigate(`/writing/lessons/${nextLesson.id}`)}>
                Bài tiếp theo <FiArrowRight />
              </button>
            )}
            <button className="btn btn-primary" onClick={() => {
              setShowCompletion(false);
              setCurrentIndex(0);
              setUserText('');
              setResult(null);
              setShowVocab(false);
            }}>
              Luyện lại
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!currentExercise) return <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Bài học không có dữ liệu.</div>;

  const isWritingPassed = canPassWriting(result);

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/writing/lessons')} style={{ marginBottom: 'var(--space-4)', padding: 0 }}>
        <FiArrowLeft /> Thoát
      </button>

      <ProgressBar current={currentIndex + 1} total={exercises.length} />

      <div className="card" style={{ padding: 'var(--space-6)', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
        
        {/* Vietnamese Text */}
        <div
          {...lockedTextProps}
          style={{ ...lockedTextProps.style, marginBottom: 'var(--space-6)', textAlign: 'center' }}
        >
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
                else if (isWritingPassed) handleNext();
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
                  background: isWritingPassed ? '#d1fae5' : '#fee2e2',
                  border: `1px solid ${isWritingPassed ? '#34d399' : '#f87171'}`,
                  color: 'var(--color-text)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', color: isWritingPassed ? '#047857' : '#b91c1c', fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                    {isWritingPassed ? <FiCheckCircle size={24} /> : <FiXCircle size={24} />}
                    {result.feedback} ({result.score}%)
                  </div>
                  
                  <div
                    {...lockedTextProps}
                    style={{ ...lockedTextProps.style, background: 'rgba(255,255,255,0.7)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-3)' }}
                  >
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
                {!isWritingPassed ? (
                  <button className="btn btn-secondary" onClick={handleRetry} style={{ minWidth: 120 }}>
                    Thử lại
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    style={{ minWidth: 120 }}
                  >
                    Tiếp tục <FiArrowRight />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WritingLesson;
