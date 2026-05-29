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
import VocabularyGate from '../common/VocabularyGate';
import QuestionNavigator from '../common/QuestionNavigator';
import { hasSpeechSupport, speakText, speakTextQueue, stopAllPlayback } from '../../utils/audioControl';

const PASS_SCORE = 70;
const getInitialListeningVoice = () => localStorage.getItem('listening_voice') || '';

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

const FEMALE_VOICE_HINTS = ['aria', 'jenny', 'zira', 'sara', 'samantha', 'susan', 'victoria', 'alice', 'ava', 'emma', 'michelle', 'female'];
const MALE_VOICE_HINTS = ['guy', 'david', 'mark', 'alex', 'daniel', 'george', 'fred', 'tom', 'male'];

const pickSpeakerVoice = (speaker, voices) => {
  if (!speaker || !voices.length) return null;
  const byUri = speaker.voiceURI ? voices.find((voice) => voice.voiceURI === speaker.voiceURI) : null;
  if (byUri) return byUri;

  const byName = speaker.voiceName
    ? voices.find((voice) => voice.name.toLowerCase().includes(speaker.voiceName.toLowerCase()))
    : null;
  if (byName) return byName;

  const hints = speaker.gender === 'male' ? MALE_VOICE_HINTS : speaker.gender === 'female' ? FEMALE_VOICE_HINTS : [];
  return voices.find((voice) => {
    const name = voice.name.toLowerCase();
    return hints.some((hint) => name.includes(hint));
  }) || voices[0] || null;
};

const getSpeakerSpeechOptions = (speaker, voices) => {
  return {
    lang: 'en-US',
    voice: pickSpeakerVoice(speaker, voices)
  };
};

const speak = (text, options = {}) => {
  if (!hasSpeechSupport()) {
    toast.error('Trình duyệt chưa hỗ trợ đọc audio.');
    return;
  }

  speakText(text, { lang: 'en-US', ...options });
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
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(getInitialListeningVoice);
  const [listeningStartIndex, setListeningStartIndex] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(null);
  const [vocabPassed, setVocabPassed] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    stopAllPlayback();
    setLoading(true);
    setLesson(null);
    setNextLesson(null);
    setAnswers({});
    setResult(null);
    setShowTranscript(false);
    setListeningStartIndex(0);
    setActiveLineIndex(null);
    setActiveQuestionIndex(0);

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

  useEffect(() => {
    if (!hasSpeechSupport()) return undefined;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices().filter((voice) => voice.lang?.startsWith('en'));
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !localStorage.getItem('listening_voice')) {
        setSelectedVoiceURI(availableVoices[0].voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const allAnswered = useMemo(() => {
    if (!lesson) return false;
    return lesson.questions.every((question) => {
      const answer = answers[question.id];
      return question.type === 'true_false' ? answer !== undefined : String(answer || '').trim();
    });
  }, [answers, lesson]);

  const answeredCount = useMemo(() => {
    if (!lesson) return 0;
    return lesson.questions.filter((question) => {
      const answer = answers[question.id];
      return question.type === 'true_false' ? answer !== undefined : String(answer || '').trim();
    }).length;
  }, [answers, lesson]);

  const vocabularyItems = useMemo(() => lesson?.vocabulary || [], [lesson]);
  const vocabularyGateKey = lesson ? `vocab_gate:${skill}:${lesson.id || id}` : '';

  useEffect(() => {
    if (!lesson) return;

    if (!vocabularyItems.length) {
      setVocabPassed(true);
      return;
    }

    setVocabPassed(localStorage.getItem(vocabularyGateKey) === 'passed');
  }, [lesson, vocabularyGateKey, vocabularyItems.length]);

  if (loading) return <Loading />;

  if (!lesson) {
    return (
      <div className="receptive-page fade-in">
        <button type="button" className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate(meta.listPath)}>
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

  if (!vocabPassed && vocabularyItems.length > 0) {
    return (
      <VocabularyGate
        items={vocabularyItems}
        title={lesson.title}
        skillLabel={skill === 'listening' ? 'Listening' : 'Reading'}
        gateKey={vocabularyGateKey}
        onPassed={() => setVocabPassed(true)}
        onExit={() => navigate(meta.listPath)}
      />
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
    setActiveQuestionIndex(0);
  };

  const speechText = buildSpeechText(lesson, skill);
  const selectedVoice = selectedVoiceURI && voices.length > 0
    ? voices.find((voice) => voice.voiceURI === selectedVoiceURI) || null
    : null;

  const handleVoiceChange = (value) => {
    setSelectedVoiceURI(value);
    localStorage.setItem('listening_voice', value);
  };

  const handleSeekChange = (value) => {
    const nextIndex = Number(value);
    stopSpeech();
    setListeningStartIndex(nextIndex);
    setActiveLineIndex(null);
  };

  const speakListeningLesson = () => {
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt chưa hỗ trợ đọc audio.');
      return;
    }

    const startIndex = Math.min(listeningStartIndex, Math.max(lesson.transcript.length - 1, 0));
    const queue = lesson.transcript.slice(startIndex).map((line, offset) => {
      const lineIndex = startIndex + offset;
      return {
        text: line.text,
        ...(selectedVoice ? { voice: selectedVoice } : getSpeakerSpeechOptions(line.speakerProfile, voices)),
        rate: speechRate,
        onstart: () => {
          setActiveLineIndex(lineIndex);
          setListeningStartIndex(lineIndex);
        },
        onend: () => {
          if (lineIndex === lesson.transcript.length - 1) setActiveLineIndex(null);
        }
      };
    });

    speakTextQueue(queue, { lang: 'en-US', rate: speechRate });
  };

  const speakTranscriptLine = (line) => {
    const lineIndex = lesson.transcript.indexOf(line);
    if (lineIndex >= 0) setListeningStartIndex(lineIndex);
    speak(line.text, {
      ...(selectedVoice ? { voice: selectedVoice } : getSpeakerSpeechOptions(line.speakerProfile, voices)),
      rate: speechRate,
      onstart: () => {
        if (lineIndex >= 0) setActiveLineIndex(lineIndex);
      },
      onend: () => setActiveLineIndex(null)
    });
  };

  const handleStopListening = () => {
    stopSpeech();
    setActiveLineIndex(null);
  };

  const seekValue = activeLineIndex ?? listeningStartIndex;
  const seekMax = Math.max((lesson.transcript?.length || 1) - 1, 0);
  const activeQuestion = lesson.questions[activeQuestionIndex] || lesson.questions[0];
  const activeAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;
  const checked = Boolean(result);
  const activeCorrect = checked && activeQuestion ? isQuestionCorrect(activeQuestion, activeAnswer) : false;
  const canGoPrevious = activeQuestionIndex > 0;
  const canGoNext = activeQuestionIndex + 1 < lesson.questions.length;

  const getQuestionStatus = (index) => {
    const question = lesson.questions[index];
    if (!question) return 'todo';
    const answer = answers[question.id];
    const answered = question.type === 'true_false' ? answer !== undefined : String(answer || '').trim();
    if (result) return isQuestionCorrect(question, answer) ? 'correct' : 'wrong';
    return answered ? 'answered' : 'todo';
  };

  return (
    <div className="receptive-page receptive-practice-page fade-in" style={{ '--receptive-accent': meta.accent }}>
      <button type="button" className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate(meta.listPath)}>
        <FiArrowLeft /> {meta.backLabel}
      </button>

      <section className="practice-compact-header">
        <div>
          <span className="receptive-eyebrow">{lesson.level} · {lesson.topic}</span>
          <h1>{lesson.title}</h1>
        </div>
        <div className="practice-compact-meta">
          <span><SkillIcon /> {lesson.duration}</span>
          <strong>{lesson.questions.length} câu hỏi</strong>
        </div>
      </section>

      <div className="receptive-practice-layout is-compact">
        <main className="receptive-main-panel has-question-navigator">
          {skill === 'listening' ? (
            <section className="receptive-panel practice-source-panel">
              <div className="receptive-panel-header">
                <div>
                  <h2>Nghe bài</h2>
                </div>
              </div>

              <div className="receptive-listen-controls">
                <button type="button" className="btn btn-primary" onClick={speakListeningLesson}>
                  <FiVolume2 /> Nghe cả bài
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleStopListening}>
                  <FiStopCircle /> Dừng
                </button>
                <label className="receptive-seek-control">
                  <span>Đoạn {seekValue + 1}/{seekMax + 1}</span>
                  <input
                    aria-label="Tua đến đoạn muốn nghe"
                    type="range"
                    min="0"
                    max={seekMax}
                    step="1"
                    value={seekValue}
                    onChange={(event) => handleSeekChange(event.target.value)}
                  />
                </label>
                <span className="receptive-rate-control">
                  Tốc độ
                  <select aria-label="Lựa chọn" value={speechRate} onChange={(event) => setSpeechRate(Number(event.target.value))}>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.15}>1.15x</option>
                    <option value={1.3}>1.3x</option>
                  </select>
                </span>
                <span className="receptive-rate-control receptive-voice-control">
                  Giọng
                  <select aria-label="Chọn giọng đọc" value={selectedVoiceURI} onChange={(event) => handleVoiceChange(event.target.value)}>
                    {voices.length === 0 && <option value="">Đang tải giọng đọc...</option>}
                    {voices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>
                    ))}
                  </select>
                </span>
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
                    <div key={`${line.speaker}-${index}`} className={`receptive-transcript-line ${activeLineIndex === index ? 'is-active' : ''}`}>
                      <button type="button" onClick={() => speakTranscriptLine(line)} aria-label={`Nghe câu ${index + 1}`}>
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
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => speak(speechText, { rate: speechRate })}>
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
                <h2>Câu {activeQuestionIndex + 1}</h2>
              </div>
              <span className="question-count-pill">{answeredCount}/{lesson.questions.length} đã làm</span>
            </div>

            <QuestionNavigator
              total={lesson.questions.length}
              current={activeQuestionIndex}
              onSelect={setActiveQuestionIndex}
              getStatus={getQuestionStatus}
              title="Bảng câu hỏi"
              summary={`${answeredCount}/${lesson.questions.length}`}
            />

            {activeQuestion && (
              <div className="receptive-question-list is-single">
                <motion.div
                  key={activeQuestion.id}
                  className={`receptive-question ${checked ? (activeCorrect ? 'is-correct' : 'is-wrong') : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="receptive-question-top">
                    <span>Câu {activeQuestionIndex + 1}/{lesson.questions.length}</span>
                    {checked && (activeCorrect ? <FiCheckCircle /> : <FiXCircle />)}
                  </div>
                  <h3>{activeQuestion.prompt}</h3>

                  {activeQuestion.type === 'multiple_choice' && (
                    <div className="receptive-options">
                      {activeQuestion.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={activeAnswer === option ? 'is-selected' : ''}
                          onClick={() => handleAnswer(activeQuestion.id, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeQuestion.type === 'true_false' && (
                    <div className="receptive-options is-boolean">
                      <button
                        type="button"
                        className={activeAnswer === true ? 'is-selected' : ''}
                        onClick={() => handleAnswer(activeQuestion.id, true)}
                      >
                        True
                      </button>
                      <button
                        type="button"
                        className={activeAnswer === false ? 'is-selected' : ''}
                        onClick={() => handleAnswer(activeQuestion.id, false)}
                      >
                        False
                      </button>
                    </div>
                  )}

                  {activeQuestion.type === 'fill_blank' && (
                    <input aria-label="Trường nhập"
                      className="receptive-fill-input"
                      value={activeAnswer || ''}
                      placeholder="Nhập đáp án..."
                      disabled={checked}
                      onChange={(event) => handleAnswer(activeQuestion.id, event.target.value)}
                    />
                  )}

                  {checked && (
                    <div className="receptive-explanation">
                      <strong>Đáp án: {activeQuestion.type === 'true_false' ? String(activeQuestion.answer) : activeQuestion.answer}</strong>
                      <p>{activeQuestion.explanation}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            )}

            <div className="receptive-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveQuestionIndex((index) => index - 1)} disabled={!canGoPrevious}>
                <FiArrowLeft /> Câu trước
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveQuestionIndex((index) => index + 1)} disabled={!canGoNext}>
                Câu tiếp <FiArrowRight />
              </button>
              {!result ? (
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered}>
                  Chấm điểm
                </button>
              ) : (
                <>
                  <div className={`receptive-result ${result.score >= PASS_SCORE ? 'is-pass' : 'is-fail'}`}>
                    <strong>{result.score}%</strong>
                    <span>{result.correctCount}/{lesson.questions.length} câu đúng</span>
                  </div>
                  <button type="button" className="btn btn-secondary" onClick={handleRetry}>
                    <FiRefreshCw /> Làm lại
                  </button>
                  {nextLesson && result.score >= PASS_SCORE && (
                    <button type="button" className="btn btn-primary" onClick={() => navigate(`/${skill}/lessons/${nextLesson.id}`)}>
                      Bài tiếp theo <FiArrowRight />
                    </button>
                  )}
                </>
              )}
            </div>
          </section>

          <QuestionNavigator
            total={lesson.questions.length}
            current={activeQuestionIndex}
            onSelect={setActiveQuestionIndex}
            getStatus={getQuestionStatus}
            title="Bảng câu hỏi"
            summary={`${answeredCount}/${lesson.questions.length}`}
          />
        </main>
      </div>
    </div>
  );
};

export default ReceptiveLesson;
