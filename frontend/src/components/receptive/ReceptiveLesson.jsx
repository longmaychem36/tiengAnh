import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiHeadphones,
  FiRefreshCw,
  FiStopCircle,
  FiVolume2,
  FiXCircle
} from 'react-icons/fi';

import {
  getNextReceptiveLesson,
  getReceptiveLesson,
  receptiveSkillMeta
} from '../../data/receptiveLessons';
import { receptiveApi } from '../../api/receptiveApi';
import Loading from '../common/Loading';
import { hasSpeechSupport, speakText, stopAllPlayback } from '../../utils/audioControl';

const PASS_SCORE = 70;

const normalizeAnswer = (value) => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ');
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getStoredProgress = (skill) => {
  try {
    return JSON.parse(localStorage.getItem(`${skill}_lesson_progress`) || '{}');
  } catch {
    return {};
  }
};

const saveLessonProgress = (skill, lessonId, score) => {
  const key = `${skill}_lesson_progress`;
  const progress = getStoredProgress(skill);
  const previousScore = Number(progress[lessonId]?.score || 0);

  progress[lessonId] = {
    completed: score >= PASS_SCORE || Boolean(progress[lessonId]?.completed),
    score: Math.max(previousScore, score),
    lastScore: score,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(key, JSON.stringify(progress));
};

const buildSpeechText = (lesson, skill) => {
  if (skill === 'listening') {
    return lesson.transcript.map((line) => line.text).join(' ');
  }

  return lesson.paragraphs.join(' ');
};

const speak = (text, rate = 1) => {
  if (!hasSpeechSupport()) {
    toast.error('Trình duyệt chưa hỗ trợ đọc audio.');
    return;
  }

  speakText(text, { lang: 'en-US', rate, pitch: 1 });
};

const stopSpeech = () => {
  stopAllPlayback();
};

const isQuestionCorrect = (question, answer) => {
  if (question.type === 'true_false') return answer === question.answer;

  if (question.type === 'fill_blank') {
    const acceptedAnswers = question.acceptedAnswers || [question.answer];
    return acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalizeAnswer(answer));
  }

  return normalizeAnswer(answer) === normalizeAnswer(question.answer);
};

const renderHighlightedText = (text, vocabulary) => {
  const words = vocabulary
    .map((item) => item.word)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!words.length) return text;

  const pattern = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
  return text.split(pattern).map((part, index) => {
    const matched = words.find((word) => normalizeAnswer(word) === normalizeAnswer(part));

    if (!matched) return <Fragment key={index}>{part}</Fragment>;

    return <mark key={index} className="receptive-highlight">{part}</mark>;
  });
};

const ReceptiveLesson = ({ skill }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const staticLesson = getReceptiveLesson(skill, id);
  const staticNextLesson = getNextReceptiveLesson(skill, id);
  const meta = receptiveSkillMeta[skill];
  const SkillIcon = skill === 'listening' ? FiHeadphones : FiBookOpen;

  const [lesson, setLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [source, setSource] = useState('static');
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  useEffect(() => {
    let cancelled = false;
    stopAllPlayback();
    setLoading(true);
    setLesson(null);
    setNextLesson(null);
    setAnswers({});
    setResult(null);
    setShowTranscript(false);

    Promise.all([
      receptiveApi.getLessonDetails(skill, id),
      receptiveApi.getLessons(skill).catch(() => null)
    ])
      .then(([lessonRes, lessonsRes]) => {
        if (cancelled) return;
        const apiLesson = lessonRes.data?.lesson;
        if (!apiLesson) throw new Error('Lesson not found');

        setLesson(apiLesson);
        setSource('api');

        const lessons = lessonsRes?.data?.lessons || [];
        const index = lessons.findIndex((item) => String(item.id) === String(id));
        setNextLesson(index >= 0 ? lessons[index + 1] || null : null);
      })
      .catch(() => {
        if (cancelled) return;
        setLesson(staticLesson);
        setNextLesson(staticNextLesson);
        setSource('static');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stopAllPlayback();
    };
  }, [skill, id]);

  const allAnswered = useMemo(() => {
    if (!lesson) return false;
    return lesson.questions.every((question) => {
      const answer = answers[question.id];
      return question.type === 'true_false' ? answer !== undefined : String(answer || '').trim();
    });
  }, [answers, lesson]);

  if (loading) return <Loading />;

  if (!lesson) {
    return (
      <div className="receptive-page fade-in">
        <button className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate(meta.listPath)}>
          <FiArrowLeft /> {meta.backLabel}
        </button>
        <div className="receptive-empty">
          <SkillIcon />
          <h1>Không tìm thấy bài học</h1>
          <p>Bài học này không tồn tại hoặc đã được thay đổi mã.</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (questionId, value) => {
    if (result) return;
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      toast.error('Bạn cần trả lời đủ câu hỏi trước khi chấm điểm.');
      return;
    }

    const correctCount = lesson.questions.filter((question) => isQuestionCorrect(question, answers[question.id])).length;
    const score = Math.round((correctCount / lesson.questions.length) * 100);
    setResult({ correctCount, score });
    saveLessonProgress(skill, lesson.id, score);
    if (source === 'api') {
      receptiveApi.saveProgress(skill, {
        lessonId: lesson.id,
        score,
        completed: score >= PASS_SCORE
      }).catch(() => {});
    }

    if (score >= PASS_SCORE) toast.success('Đã hoàn thành bài học.');
    else toast('Bạn nên luyện lại bài này để đạt ít nhất 70%.');
  };

  const handleRetry = () => {
    stopSpeech();
    setAnswers({});
    setResult(null);
    setShowTranscript(false);
  };

  const speechText = buildSpeechText(lesson, skill);

  return (
    <div className="receptive-page receptive-practice-page fade-in" style={{ '--receptive-accent': meta.accent }}>
      <button className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate(meta.listPath)}>
        <FiArrowLeft /> {meta.backLabel}
      </button>

      <section className="practice-compact-header">
        <div>
          <span className="receptive-eyebrow">{lesson.level} · {lesson.topic}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.objective}</p>
        </div>
        <div className="practice-compact-meta">
          <span><SkillIcon /> {lesson.duration}</span>
          <strong>{lesson.questions.length} câu hỏi</strong>
        </div>
      </section>

      <div className="practice-vocab-strip">
        {lesson.vocabulary.map((item) => (
          <span key={item.word}><strong>{item.word}</strong> {item.meaning}</span>
        ))}
      </div>

      <div className="receptive-practice-layout is-compact">
        <main className="receptive-main-panel">
          {skill === 'listening' ? (
            <section className="receptive-panel practice-source-panel">
              <div className="receptive-panel-header">
                <div>
                  <h2>Nghe nội dung</h2>
                  <p>Nghe bài, rồi mở transcript khi cần kiểm tra lại.</p>
                </div>
              </div>

              <div className="receptive-listen-controls">
                <button className="btn btn-primary" onClick={() => speak(speechText, speechRate)}>
                  <FiVolume2 /> Nghe cả bài
                </button>
                <button className="btn btn-secondary" onClick={stopSpeech}>
                  <FiStopCircle /> Dừng
                </button>
                <label className="receptive-rate-control">
                  Tốc độ
                  <select value={speechRate} onChange={(event) => setSpeechRate(Number(event.target.value))}>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.15}>1.15x</option>
                    <option value={1.3}>1.3x</option>
                  </select>
                </label>
              </div>

              <button
                type="button"
                className="receptive-transcript-toggle"
                onClick={() => setShowTranscript((current) => !current)}
              >
                {showTranscript ? <FiEyeOff /> : <FiEye />}
                {showTranscript ? 'Ẩn transcript' : 'Hiện transcript'}
              </button>

              {showTranscript && (
                <div className="receptive-transcript">
                  {lesson.transcript.map((line, index) => (
                    <div key={`${line.speaker}-${index}`} className="receptive-transcript-line">
                      <button type="button" onClick={() => speak(line.text, speechRate)} aria-label={`Nghe câu ${index + 1}`}>
                        <FiVolume2 />
                      </button>
                      <div>
                        <strong>{line.speaker}</strong>
                        <p>{line.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="receptive-panel practice-source-panel">
              <div className="receptive-panel-header">
                <div>
                  <h2>{lesson.passageTitle}</h2>
                  <p>Đọc bài rồi trả lời câu hỏi bên cạnh.</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => speak(speechText, speechRate)}>
                  <FiVolume2 /> Nghe mẫu
                </button>
              </div>

              <article className="receptive-passage">
                {lesson.paragraphs.map((paragraph, index) => (
                  <p key={index}>{renderHighlightedText(paragraph, lesson.vocabulary)}</p>
                ))}
              </article>
            </section>
          )}

          <section className="receptive-panel practice-question-panel">
            <div className="receptive-panel-header">
              <div>
                <h2>Kiểm tra hiểu</h2>
                <p>Trả lời đủ câu hỏi rồi chấm điểm.</p>
              </div>
            </div>

            <div className="receptive-question-list">
              {lesson.questions.map((question, index) => {
                const answer = answers[question.id];
                const checked = Boolean(result);
                const correct = checked ? isQuestionCorrect(question, answer) : false;

                return (
                  <motion.div
                    key={question.id}
                    className={`receptive-question ${checked ? (correct ? 'is-correct' : 'is-wrong') : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <div className="receptive-question-top">
                      <span>Câu {index + 1}</span>
                      {checked && (correct ? <FiCheckCircle /> : <FiXCircle />)}
                    </div>
                    <h3>{question.prompt}</h3>

                    {question.type === 'multiple_choice' && (
                      <div className="receptive-options">
                        {question.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={answer === option ? 'is-selected' : ''}
                            onClick={() => handleAnswer(question.id, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {question.type === 'true_false' && (
                      <div className="receptive-options is-boolean">
                        <button
                          type="button"
                          className={answer === true ? 'is-selected' : ''}
                          onClick={() => handleAnswer(question.id, true)}
                        >
                          True
                        </button>
                        <button
                          type="button"
                          className={answer === false ? 'is-selected' : ''}
                          onClick={() => handleAnswer(question.id, false)}
                        >
                          False
                        </button>
                      </div>
                    )}

                    {question.type === 'fill_blank' && (
                      <input
                        className="receptive-fill-input"
                        value={answer || ''}
                        placeholder="Nhập đáp án..."
                        disabled={checked}
                        onChange={(event) => handleAnswer(question.id, event.target.value)}
                      />
                    )}

                    {checked && (
                      <div className="receptive-explanation">
                        <strong>Đáp án: {question.type === 'true_false' ? String(question.answer) : question.answer}</strong>
                        <p>{question.explanation}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="receptive-actions">
              {!result ? (
                <button className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered}>
                  Chấm điểm
                </button>
              ) : (
                <>
                  <div className={`receptive-result ${result.score >= PASS_SCORE ? 'is-pass' : 'is-fail'}`}>
                    <strong>{result.score}%</strong>
                    <span>{result.correctCount}/{lesson.questions.length} câu đúng</span>
                  </div>
                  <button className="btn btn-secondary" onClick={handleRetry}>
                    <FiRefreshCw /> Làm lại
                  </button>
                  {nextLesson && result.score >= PASS_SCORE && (
                    <button className="btn btn-primary" onClick={() => navigate(`/${skill}/lessons/${nextLesson.id}`)}>
                      Bài tiếp theo <FiArrowRight />
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ReceptiveLesson;
