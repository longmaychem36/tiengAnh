import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiEdit3,
  FiRefreshCw,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { writingApi } from '../../api/writingApi';
import ProgressBar from '../speaking/ProgressBar';
import Loading from '../common/Loading';
import ExpReward from '../common/ExpReward';

const WRITING_PASS_SCORE = 80;

const normalizeText = (value) => {
  return String(value || '')
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const canPassWriting = (result) => Number(result?.score || 0) >= WRITING_PASS_SCORE;

const getPassageParts = (text, highlights) => {
  const source = text || '';
  const lowerSource = source.toLowerCase();
  const cleanHighlights = highlights
    .filter(Boolean)
    .map((item) => item.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  const parts = [];
  let cursor = 0;

  while (cursor < source.length) {
    let next = null;

    cleanHighlights.forEach((highlight) => {
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

const renderTargetDiff = (userText, targetText) => {
  const userWords = new Set(normalizeText(userText).split(' ').filter(Boolean));

  return targetText.split(/(\s+)/).map((part, index) => {
    if (!part.trim()) return <Fragment key={index}>{part}</Fragment>;
    const cleanPart = normalizeText(part);
    const matched = userWords.has(cleanPart);

    return (
      <mark key={index} className={matched ? 'writing-diff-hit' : 'writing-diff-miss'}>
        {part}
      </mark>
    );
  });
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
  const [attempts, setAttempts] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [expReward, setExpReward] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLessonData(null);
    setExercises([]);
    setNextLesson(null);
    setCurrentIndex(0);
    setUserText('');
    setResult(null);
    setAttempts({});
    setShowCompletion(false);
    setExpReward(null);

    Promise.all([
      writingApi.getLessonDetails(id),
      writingApi.getLessons().catch(() => null)
    ])
      .then(([res, lessonsRes]) => {
        if (cancelled) return;
        setLessonData(res.data.lesson);
        setExercises(res.data.exercises || []);

        const lessons = lessonsRes?.data?.lessons || [];
        const currentLessonIndex = lessons.findIndex((lesson) => String(lesson.id) === String(id));
        setNextLesson(currentLessonIndex >= 0 ? lessons[currentLessonIndex + 1] || null : null);
      })
      .catch((err) => {
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
  const currentAttempt = currentExercise ? attempts[currentExercise.id] : null;

  const handleCheck = async () => {
    if (!userText.trim()) {
      toast.error('Vui lòng nhập câu trả lời.');
      return;
    }

    setIsChecking(true);
    try {
      const res = await writingApi.checkWriting({
        userText,
        targetText: currentExercise.correctAnswerEN
      });
      const newResult = res.data;
      setResult(newResult);
      setAttempts((current) => ({
        ...current,
        [currentExercise.id]: {
          ...newResult,
          userText,
          targetText: currentExercise.correctAnswerEN,
          prompt: currentExercise.contentVI
        }
      }));
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kiểm tra bài viết');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetry = () => setResult(null);

  const handleNext = async () => {
    if (!canPassWriting(result)) {
      toast.error(`Bạn cần đạt từ ${WRITING_PASS_SCORE}% để qua câu này.`);
      return;
    }

    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((index) => index + 1);
      setUserText('');
      setResult(null);
      return;
    }

    setLoading(true);
    writingApi.saveProgress({ lessonId: id, completed: true })
      .then((res) => {
        setExpReward(res.data?.expReward || null);
        toast.success('Bạn đã hoàn thành chủ đề viết.');
        setShowCompletion(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Lỗi lưu tiến độ');
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <Loading />;

  if (showCompletion) {
    const passageEN = lessonData?.passageEN || exercises.map((exercise) => exercise.correctAnswerEN).filter(Boolean).join(' ');
    const passageVI = lessonData?.passageVI || exercises.map((exercise) => exercise.contentVI).filter(Boolean).join(' ');
    const passageParts = getPassageParts(passageEN, exercises.map((exercise) => exercise.correctAnswerEN));

    return (
      <div className="receptive-page fade-in" style={{ '--receptive-accent': '#059669' }}>
        <section className="receptive-panel writing-completion-panel">
          <div className="speaking-completion-head">
            <FiCheckCircle />
            <div>
              <span>Hoàn thành chủ đề Writing</span>
              <h1>{lessonData?.title}</h1>
            </div>
          </div>

          <ExpReward reward={expReward} />

          <div className="writing-final-passage">
            <span>Bài viết hoàn chỉnh</span>
            <p>
              {passageParts.map((part, index) => part.highlighted ? (
                <mark key={index}>{part.text}</mark>
              ) : (
                <Fragment key={index}>{part.text}</Fragment>
              ))}
            </p>
          </div>

          {passageVI && (
            <div className="writing-translation-box">
              <span>Bản dịch tiếng Việt</span>
              <p>{passageVI}</p>
            </div>
          )}

          <div className="speaking-summary-grid">
            {exercises.map((exercise, index) => {
              const attempt = attempts[exercise.id];
              return (
                <div key={exercise.id} className="speaking-summary-item">
                  <span>Câu {index + 1}</span>
                  <strong>{attempt ? `${attempt.score}%` : 'Chưa có điểm'}</strong>
                  <p>{exercise.correctAnswerEN}</p>
                </div>
              );
            })}
          </div>

          <div className="receptive-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/writing/lessons')}>
              <FiArrowLeft /> Về danh sách
            </button>
            {nextLesson && (
              <button className="btn btn-primary" onClick={() => navigate(`/writing/lessons/${nextLesson.id}`)}>
                Bài tiếp theo <FiArrowRight />
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowCompletion(false);
                setCurrentIndex(0);
                setUserText('');
                setResult(null);
              }}
            >
              <FiRefreshCw /> Luyện lại
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (!currentExercise) {
    return <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Bài học không có dữ liệu.</div>;
  }

  const isWritingPassed = canPassWriting(result);
  const currentVocab = currentExercise.vocab || [];

  return (
    <div className="receptive-page receptive-practice-page fade-in" style={{ '--receptive-accent': '#059669' }}>
      <button className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate('/writing/lessons')}>
        <FiArrowLeft /> Thoát
      </button>

      <ProgressBar current={currentIndex + 1} total={exercises.length} compact />

      <section className="practice-compact-header">
        <div>
          <span className="receptive-eyebrow">Writing practice</span>
          <h1>{lessonData?.title || 'Luyện viết'}</h1>
          <p>{lessonData?.description || 'Viết câu tiếng Anh tương đương và xem phản hồi ngay bên cạnh.'}</p>
        </div>
        <div className="practice-compact-meta">
          <span><FiEdit3 /> {currentIndex + 1}/{exercises.length} câu</span>
          <strong>Pass {WRITING_PASS_SCORE}%</strong>
        </div>
      </section>

      <div className="productive-compact-layout">
        <section className="receptive-panel writing-prompt-panel">
          <div className="compact-panel-title">
            <h2>Đề bài</h2>
          </div>

          <div className="writing-prompt-box">
            <span>Dịch sang tiếng Anh</span>
            <h3>{currentExercise.contentVI}</h3>
          </div>

          <div className="compact-vocab-box">
            <h3>Từ vựng</h3>
            {currentVocab.length > 0 ? (
              <div className="practice-vocab-strip is-inside">
                {currentVocab.map((item) => (
                  <span key={`${item.word}-${item.meaning}`}><strong>{item.word}</strong> {item.meaning}</span>
                ))}
              </div>
            ) : (
              <p className="productive-muted">Bài này không có từ vựng gợi ý riêng.</p>
            )}
          </div>
        </section>

        <section className="receptive-panel">
          <div className="compact-panel-title">
            <h2>Bài làm</h2>
            {!result && <span>Enter để kiểm tra</span>}
          </div>

          <textarea
            className="productive-textarea"
            rows={4}
            value={userText}
            onChange={(event) => setUserText(event.target.value)}
            disabled={result != null || isChecking}
            placeholder="Nhập câu tiếng Anh của bạn..."
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (!result) handleCheck();
                else if (isWritingPassed) handleNext();
                else handleRetry();
              }
            }}
          />

          {!result ? (
            <div className="receptive-actions">
              <button className="btn btn-primary" onClick={handleCheck} disabled={isChecking || !userText.trim()}>
                {isChecking ? 'Đang chấm...' : 'Kiểm tra'}
              </button>
            </div>
          ) : (
            <motion.div className="writing-feedback is-compact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`speaking-score ${isWritingPassed ? 'is-pass' : 'is-fail'}`}>
                {isWritingPassed ? <FiCheckCircle /> : <FiXCircle />}
                <strong>{result.score}%</strong>
                <span>{isWritingPassed ? 'Đạt yêu cầu' : 'Cần sửa thêm'}</span>
              </div>

              {result.feedback && <p className="speaking-feedback-note">{result.feedback}</p>}

              <div className="writing-review-grid">
                <div>
                  <span>Bài của bạn</span>
                  <p>{currentAttempt?.userText || userText}</p>
                </div>
                <div>
                  <span>Đáp án mẫu</span>
                  <p>{currentExercise.correctAnswerEN}</p>
                </div>
              </div>

              <div className="writing-diff-box">
                <span>Từ trong đáp án mẫu</span>
                <p>{renderTargetDiff(currentAttempt?.userText || userText, currentExercise.correctAnswerEN)}</p>
              </div>

              <div className="receptive-actions">
                {!isWritingPassed ? (
                  <button className="btn btn-secondary" onClick={handleRetry}>
                    <FiRefreshCw /> Sửa lại
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleNext}>
                    Tiếp tục <FiArrowRight />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default WritingLesson;
