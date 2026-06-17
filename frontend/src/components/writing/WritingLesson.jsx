import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiRefreshCw,
  FiSave,
  FiSend,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { writingApi } from '../../api/writingApi';
import Loading from '../common/Loading';
import ExpReward from '../common/ExpReward';
import VocabularyGate from '../common/VocabularyGate';
import QuestionNavigator from '../common/QuestionNavigator';
import {
  LearningLayout,
  LessonCard,
  LessonHeader,
  PrimaryButton,
  SecondaryButton
} from '../common/learning';

const WRITING_PASS_SCORE = 80;

const normalizeText = (value) => {
  return String(value || '')
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const canPassWriting = (result) => Number(result?.score || 0) >= WRITING_PASS_SCORE;
const getExerciseKey = (item, index) => item?.id || index;
const joinExerciseField = (exercises, field) => exercises.reduce((parts, exercise) => {
  const value = exercise[field];
  if (value) parts.push(value);
  return parts;
}, []).join(' ');

const getPassageParts = (text, highlights) => {
  const source = text || '';
  const lowerSource = source.toLowerCase();
  const cleanHighlights = highlights
    .reduce((items, item) => {
      const value = item?.trim();
      if (value) items.push(value);
      return items;
    }, [])
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
      parts.push({ text: source.slice(cursor), highlighted: false, start: cursor });
      break;
    }

    if (next.index > cursor) {
      parts.push({ text: source.slice(cursor, next.index), highlighted: false, start: cursor });
    }

    parts.push({ text: next.text, highlighted: true, start: next.index });
    cursor = next.index + next.text.length;
  }

  return parts;
};

const TargetDiff = ({ userText, targetText }) => {
  const userWords = new Set(normalizeText(userText).split(' ').filter(Boolean));

  let cursor = 0;
  return targetText.split(/(\s+)/).map((part) => {
    const key = `${cursor}:${part}`;
    cursor += part.length;
    if (!part.trim()) return <Fragment key={key}>{part}</Fragment>;
    const cleanPart = normalizeText(part);
    const matched = userWords.has(cleanPart);

    return (
      <mark key={key} className={matched ? 'writing-diff-hit' : 'writing-diff-miss'}>
        {part}
      </mark>
    );
  });
};

const formatFeedbackText = (value, fallback) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(' ') || fallback;
  if (typeof value === 'string') return value || fallback;
  if (value && typeof value === 'object') {
    return Object.values(value).flat().filter(Boolean).join(' ') || fallback;
  }
  return value == null ? fallback : String(value);
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
  const [drafts, setDrafts] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [expReward, setExpReward] = useState(null);
  const [vocabPassed, setVocabPassed] = useState(false);

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
    setDrafts({});
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
  const currentExerciseKey = getExerciseKey(currentExercise, currentIndex);
  const currentAttempt = currentExercise ? attempts[currentExerciseKey] : null;
  const passedCount = useMemo(() => (
    exercises.filter((exercise, index) => canPassWriting(attempts[getExerciseKey(exercise, index)])).length
  ), [attempts, exercises]);
  const answeredCount = useMemo(() => (
    exercises.filter((exercise, index) => {
      const key = getExerciseKey(exercise, index);
      return attempts[key] || String(drafts[key] || '').trim();
    }).length
  ), [attempts, drafts, exercises]);
  const vocabularyItems = useMemo(() => {
    const seen = new Set();

    return exercises.reduce((items, exercise) => {
      (exercise.vocab || []).forEach((item) => {
        if (!item?.word || !item?.meaning) return;
        const key = `${String(item.word).trim().toLowerCase()}:${String(item.meaning).trim().toLowerCase()}`;
        if (seen.has(key)) return;
        seen.add(key);
        items.push(item);
      });
      return items;
    }, []);
  }, [exercises]);
  const vocabularyGateKey = `vocab_gate:writing:${lessonData?.id || id}`;

  useEffect(() => {
    if (loading) return;

    if (!vocabularyItems.length) {
      setVocabPassed(true);
      return;
    }

    setVocabPassed(localStorage.getItem(vocabularyGateKey) === 'passed');
  }, [loading, vocabularyGateKey, vocabularyItems.length]);

  const handleCheck = async () => {
    if (!userText.trim()) {
      toast.error('Vui lòng nhập câu trả lời.');
      return;
    }

    setIsChecking(true);
    try {
      const res = await writingApi.checkWriting({
        userText,
        targetText: currentExercise.correctAnswerEN,
        lessonId: id,
        exerciseId: currentExercise.id,
        prompt: currentExercise.contentVI
      });
      const newResult = res.data;
      setResult(newResult);
      setAttempts((current) => ({
        ...current,
        [currentExerciseKey]: {
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

  const handleUserTextChange = (value) => {
    setUserText(value);
    setDrafts((current) => ({ ...current, [currentExerciseKey]: value }));
  };

  const handleSaveDraft = () => {
    setDrafts((current) => ({ ...current, [currentExerciseKey]: userText }));
    toast.success('Đã lưu bản nháp');
  };

  const handleSelectQuestion = (index) => {
    const exercise = exercises[index];
    const key = getExerciseKey(exercise, index);
    const previousAttempt = attempts[key] || null;

    setCurrentIndex(index);
    setUserText(drafts[key] || previousAttempt?.userText || '');
    setResult(previousAttempt);
  };

  const handleNext = async () => {
    if (!canPassWriting(result)) {
      toast.error(`Bạn cần đạt từ ${WRITING_PASS_SCORE}% để qua câu này.`);
      return;
    }

    const mergedAttempts = { ...attempts, [currentExerciseKey]: { ...result, userText } };
    const nextIndex = exercises.findIndex((exercise, index) => (
      index !== currentIndex && !canPassWriting(mergedAttempts[getExerciseKey(exercise, index)])
    ));

    if (nextIndex >= 0) {
      handleSelectQuestion(nextIndex);
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
    const passageEN = lessonData?.passageEN || joinExerciseField(exercises, 'correctAnswerEN');
    const passageVI = lessonData?.passageVI || joinExerciseField(exercises, 'contentVI');
    const passageParts = getPassageParts(passageEN, exercises.map((exercise) => exercise.correctAnswerEN));

    return (
      <div className="receptive-page fade-in" style={{ '--receptive-accent': '#2563eb' }}>
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
              {passageParts.map((part) => part.highlighted ? (
                <mark key={`${part.start}:${part.text}`}>{part.text}</mark>
              ) : (
                <Fragment key={`${part.start}:${part.text}`}>{part.text}</Fragment>
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
              const attempt = attempts[getExerciseKey(exercise, index)];
              return (
                <div key={exercise.id || index} className="speaking-summary-item">
                  <span>Câu {index + 1}</span>
                  <strong>{attempt ? `${attempt.score}%` : 'Chưa có điểm'}</strong>
                  <p>{exercise.correctAnswerEN}</p>
                </div>
              );
            })}
          </div>

          <div className="receptive-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/writing/lessons')}>
              <FiArrowLeft /> Về danh sách
            </button>
            {nextLesson && (
              <button type="button" className="btn btn-primary" onClick={() => navigate(`/writing/lessons/${nextLesson.id}`)}>
                Bài tiếp theo <FiArrowRight />
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowCompletion(false);
                setCurrentIndex(0);
                setUserText('');
                setResult(null);
                setDrafts({});
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

  if (!vocabPassed && vocabularyItems.length > 0) {
    return (
      <VocabularyGate
        items={vocabularyItems}
        title={lessonData?.title || 'Chưa có tiêu đề'}
        skillLabel="Writing"
        gateKey={vocabularyGateKey}
        onPassed={() => setVocabPassed(true)}
        onExit={() => navigate('/writing/lessons')}
      />
    );
  }

  const totalQuestions = exercises.length;
  const isWritingPassed = canPassWriting(result);
  const progressPercent = totalQuestions > 0 ? (passedCount / totalQuestions) * 100 : 0;
  const passRate = totalQuestions > 0 ? `${Math.round((passedCount / totalQuestions) * 100)}%` : '--';
  const wordCount = userText.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = userText.length;
  const autosaveLabel = drafts[currentExerciseKey] !== undefined ? 'Đã lưu' : '';

  const getQuestionStatus = (index) => {
    const attempt = attempts[getExerciseKey(exercises[index], index)];
    if (attempt) return canPassWriting(attempt) ? 'passed' : 'failed';
    return drafts[getExerciseKey(exercises[index], index)] ? 'answered' : 'todo';
  };

  const navigator = (
    <QuestionNavigator
      total={totalQuestions}
      current={currentIndex}
      onSelect={handleSelectQuestion}
      getStatus={getQuestionStatus}
      title="Câu"
      summary={`${passedCount}/${totalQuestions}`}
    />
  );

  return (
    <LearningLayout
      accent="#2563EB"
      className="learning-session-writing fade-in"
      header={(
        <LessonHeader
          title={lessonData?.title || 'Chưa có tiêu đề'}
          level={lessonData?.level || ''}
          topic={lessonData?.topic || ''}
          progress={progressPercent}
          answered={answeredCount}
          total={totalQuestions}
          score={passRate}
          duration={lessonData?.duration || '--'}
          backLabel="Về khóa viết"
          onBack={() => navigate('/writing/lessons')}
        />
      )}
      leftPanel={(
        <LessonCard
          className="writing-prompt-card"
          title="Đề bài"
        >
          <div className="writing-prompt-box">
            <h3>{currentExercise.contentVI}</h3>
          </div>
        </LessonCard>
      )}
      centerPanel={(
        <LessonCard
          className="writing-editor-card"
          title="Bài làm"
          action={autosaveLabel && <span className="learning-status-pill">{autosaveLabel}</span>}
        >
          <textarea
            aria-label="Nội dung bài viết"
            className="productive-textarea"
            rows={10}
            value={userText}
            onChange={(event) => handleUserTextChange(event.target.value)}
            disabled={result != null || isChecking}
            placeholder="Nhập câu tiếng Anh của bạn…"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (!result) handleCheck();
                else if (isWritingPassed) handleNext();
                else handleRetry();
              }
            }}
          />

          <div className="writing-editor-meta">
            <div className="writing-stat-row">
              <div className="writing-stat-card">
                <span>Từ</span>
                <strong>{wordCount}</strong>
              </div>
              <div className="writing-stat-card">
                <span>Ký tự</span>
                <strong>{characterCount}</strong>
              </div>
            </div>
            {isChecking && <span className="lesson-topic-tag">Đang chấm</span>}
          </div>

          {result && (
            <motion.div className="writing-feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`speaking-score ${isWritingPassed ? 'is-pass' : 'is-fail'}`}>
                {isWritingPassed ? <FiCheckCircle /> : <FiXCircle />}
                <strong>{result.score}%</strong>
                <span>{isWritingPassed ? 'Đạt yêu cầu' : 'Cần sửa thêm'}</span>
              </div>

              <div className="writing-feedback-grid">
                <div>
                  <span>Ngữ pháp</span>
                  <p>{formatFeedbackText(result.grammar || result.feedback, 'So sánh với đáp án mẫu để chỉnh cấu trúc câu.')}</p>
                </div>
                <div>
                  <span>Chính tả</span>
                  <p>{formatFeedbackText(result.spelling, 'Kiểm tra lại các từ bị đánh dấu ở phần đối chiếu.')}</p>
                </div>
                <div>
                  <span>Gợi ý</span>
                  <p>{formatFeedbackText(result.suggestions, currentExercise.correctAnswerEN)}</p>
                </div>
              </div>

              <div className="writing-review-grid">
                <div>
                  <span>Bạn</span>
                  <p>{currentAttempt?.userText || userText}</p>
                </div>
                <div>
                  <span>Mẫu</span>
                  <p>{currentExercise.correctAnswerEN}</p>
                </div>
              </div>

              <div className="writing-diff-box">
                <span>Đối chiếu</span>
                <p>
                  <TargetDiff
                    userText={currentAttempt?.userText || userText}
                    targetText={currentExercise.correctAnswerEN}
                  />
                </p>
              </div>
            </motion.div>
          )}

          <div className="writing-editor-footer">
            <SecondaryButton onClick={handleSaveDraft}>
              <FiSave /> Lưu
            </SecondaryButton>
            <div>
              {result && !isWritingPassed && (
                <SecondaryButton onClick={handleRetry}>
                  <FiRefreshCw /> Sửa lại
                </SecondaryButton>
              )}
              <PrimaryButton onClick={handleCheck} disabled={isChecking || !userText.trim() || result != null}>
                <FiCheckCircle /> {isChecking ? 'Chấm…' : 'Chấm'}
              </PrimaryButton>
              <PrimaryButton onClick={handleNext} disabled={!isWritingPassed}>
                <FiSend /> Nộp
              </PrimaryButton>
            </div>
          </div>
        </LessonCard>
      )}
      navigator={navigator}
    />
  );
};

export default WritingLesson;
