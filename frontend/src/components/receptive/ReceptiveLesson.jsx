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

import { receptiveApi } from '../../api/receptiveApi';
import Loading from '../common/Loading';
import VocabularyGate from '../common/VocabularyGate';
import QuestionNavigator from '../common/QuestionNavigator';
import ExpReward from '../common/ExpReward';
import { receptiveSkillMeta } from './receptiveMeta';
import {
  LearningLayout,
  LessonCard,
  LessonHeader,
  PrimaryButton,
  QuestionCard,
  SecondaryButton
} from '../common/learning';
import { hasSpeechSupport, speakText, speakTextQueue, stopAllPlayback } from '../../utils/audioControl';

const PASS_SCORE = 70;
const getInitialListeningVoice = () => localStorage.getItem('listening_voice') || '';
const getLessonId = (lesson) => lesson?.id ?? lesson?.Id;
const getNextLesson = (lessons, currentId) => {
  const index = lessons.findIndex((lesson) => String(getLessonId(lesson)) === String(currentId));
  return index >= 0 ? lessons[index + 1] || null : null;
};

const normalizeAnswer = (value) => {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ');
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSpeechText = (lesson, skill) => {
  if (skill === 'listening') {
    return lesson.transcript.map((line) => line.text).join(' ');
  }

  return lesson.paragraphs.join(' ');
};

const FEMALE_VOICE_HINTS = ['aria', 'jenny', 'zira', 'sara', 'samantha', 'susan', 'victoria', 'alice', 'ava', 'emma', 'michelle', 'female'];
const MALE_VOICE_HINTS = ['guy', 'david', 'mark', 'alex', 'daniel', 'george', 'fred', 'tom', 'male'];

const getVoiceKey = (voice) => voice?.voiceURI || voice?.name || '';

const getSpeakerKey = (speaker) => String(speaker?.id || speaker?.name || '').toLowerCase();

const findUnusedVoice = (items, usedVoiceKeys) => (
  items.find((voice) => !usedVoiceKeys.has(getVoiceKey(voice))) || items[0] || null
);

const pickSpeakerVoice = (speaker, voices, usedVoiceKeys = new Set()) => {
  if (!speaker || !voices.length) return null;
  const byUri = speaker.voiceURI ? findUnusedVoice(voices.filter((voice) => voice.voiceURI === speaker.voiceURI), usedVoiceKeys) : null;
  if (byUri) return byUri;

  const byName = speaker.voiceName
    ? findUnusedVoice(voices.filter((voice) => voice.name.toLowerCase().includes(speaker.voiceName.toLowerCase())), usedVoiceKeys)
    : null;
  if (byName) return byName;

  const hints = speaker.gender === 'male' ? MALE_VOICE_HINTS : speaker.gender === 'female' ? FEMALE_VOICE_HINTS : [];
  const byGender = voices.filter((voice) => {
    const name = voice.name.toLowerCase();
    return hints.some((hint) => name.includes(hint));
  });
  if (byGender.length) return findUnusedVoice(byGender, usedVoiceKeys);

  return voices.find((voice) => !usedVoiceKeys.has(getVoiceKey(voice))) || voices[0] || null;
};

const getSpeakerSpeechOptions = (speaker, voices, assignedVoice = null) => {
  return {
    lang: 'en-US',
    voice: assignedVoice || pickSpeakerVoice(speaker, voices)
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

const HighlightedText = ({ text, vocabulary }) => {
  const words = vocabulary
    .reduce((items, item) => {
      if (item.word) items.push(item.word);
      return items;
    }, [])
    .sort((a, b) => b.length - a.length);

  if (!words.length) return text;

  const pattern = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
  let cursor = 0;
  return text.split(pattern).map((part) => {
    const key = `${cursor}:${part}`;
    cursor += part.length;
    const matched = words.find((word) => normalizeAnswer(word) === normalizeAnswer(part));

    if (!matched) return <Fragment key={key}>{part}</Fragment>;

    return <mark key={key} className="receptive-highlight">{part}</mark>;
  });
};

const ReceptiveLesson = ({ skill }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meta = receptiveSkillMeta[skill];
  const SkillIcon = skill === 'listening' ? FiHeadphones : FiBookOpen;

  const [lesson, setLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(getInitialListeningVoice);
  const [listeningStartIndex, setListeningStartIndex] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(null);
  const [vocabPassed, setVocabPassed] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [expReward, setExpReward] = useState(null);

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
    setShowCompletion(false);
    setExpReward(null);

    Promise.all([
      receptiveApi.getLessonDetails(skill, id),
      receptiveApi.getLessons(skill).catch(() => null)
    ])
      .then(([lessonRes, lessonsRes]) => {
        if (cancelled) return;
        const apiLesson = lessonRes.data?.lesson;
        if (!apiLesson) throw new Error('Lesson not found');

        setLesson(apiLesson);

        const lessons = lessonsRes?.data?.lessons || [];
        setNextLesson(getNextLesson(lessons, id));
      })
      .catch(() => {
        if (cancelled) return;
        setLesson(null);
        setNextLesson(null);
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

  const speakerVoiceMap = useMemo(() => {
    const map = new Map();
    const usedVoiceKeys = new Set();
    const sourceSpeakers = lesson?.speakers?.length
      ? lesson.speakers
      : (lesson?.transcript || []).map((line) => line.speakerProfile).filter(Boolean);

    sourceSpeakers.forEach((speaker) => {
      const key = getSpeakerKey(speaker);
      if (!key || map.has(key)) return;
      const voice = pickSpeakerVoice(speaker, voices, usedVoiceKeys);
      if (voice) {
        map.set(key, voice);
        usedVoiceKeys.add(getVoiceKey(voice));
      }
    });

    return map;
  }, [lesson, voices]);

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
        confirmOnExit
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

    setLoading(true);
    const correctCount = lesson.questions.filter((question) => isQuestionCorrect(question, answers[question.id])).length;
    const score = Math.round((correctCount / lesson.questions.length) * 100);
    const isCompleted = score >= PASS_SCORE;

    try {
      const res = await receptiveApi.saveProgress(skill, {
        lessonId: lesson.id,
        score,
        completed: isCompleted
      });

      setResult({ correctCount, score });
      setExpReward(res.data?.expReward || null);

      if (isCompleted) {
        const lessonsRes = await receptiveApi.getLessons(skill).catch(() => null);
        const lessons = lessonsRes?.data?.lessons || [];
        setNextLesson(getNextLesson(lessons, lesson.id));
        setActiveQuestionIndex(Math.max(lesson.questions.length - 1, 0));
        toast.success('Đã hoàn thành bài học!');
      } else {
        toast('Bạn nên luyện lại bài này để đạt ít nhất 70%.');
      }
    } catch (err) {
      toast.error('Lỗi lưu tiến độ bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    stopSpeech();
    setAnswers({});
    setResult(null);
    setShowTranscript(false);
    setActiveQuestionIndex(0);
    setShowCompletion(false);
    setExpReward(null);
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

  const speakListeningLesson = (rateOrEvent = speechRate) => {
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt chưa hỗ trợ đọc audio.');
      return;
    }

    const rate = typeof rateOrEvent === 'number' ? rateOrEvent : speechRate;
    const transcript = lesson.transcript || [];
    const startIndex = Math.min(listeningStartIndex, Math.max(transcript.length - 1, 0));
    const queue = transcript.slice(startIndex).map((line, offset) => {
      const lineIndex = startIndex + offset;
      const assignedVoice = speakerVoiceMap.get(getSpeakerKey(line.speakerProfile)) || null;
      const voiceOpts = (skill === 'listening')
        ? getSpeakerSpeechOptions(line.speakerProfile, voices, assignedVoice)
        : (selectedVoice ? { voice: selectedVoice } : getSpeakerSpeechOptions(line.speakerProfile, voices));
      return {
        text: line.text,
        ...voiceOpts,
        rate: rate,
        volume: skill === 'listening' ? 1 : speechVolume,
        onstart: () => {
          setActiveLineIndex(lineIndex);
          setListeningStartIndex(lineIndex);
        },
        onend: () => {
          if (lineIndex === transcript.length - 1) setActiveLineIndex(null);
        }
      };
    });

    speakTextQueue(queue, { lang: 'en-US', rate: rate, volume: skill === 'listening' ? 1 : speechVolume });
  };

  const speakTranscriptLine = (line, rate = speechRate) => {
    const lineIndex = lesson.transcript.indexOf(line);
    if (lineIndex >= 0) setListeningStartIndex(lineIndex);
    const assignedVoice = speakerVoiceMap.get(getSpeakerKey(line.speakerProfile)) || null;
    const voiceOpts = (skill === 'listening')
      ? getSpeakerSpeechOptions(line.speakerProfile, voices, assignedVoice)
      : (selectedVoice ? { voice: selectedVoice } : getSpeakerSpeechOptions(line.speakerProfile, voices));
    speak(line.text, {
      ...voiceOpts,
      rate: rate,
      volume: skill === 'listening' ? 1 : speechVolume,
      onstart: () => {
        if (lineIndex >= 0) setActiveLineIndex(lineIndex);
      },
      onend: () => setActiveLineIndex(null)
    });
  };

  const handleSpeedChange = (newRate) => {
    setSpeechRate(newRate);
    if (activeLineIndex !== null) {
      stopSpeech();
      setTimeout(() => {
        speakListeningLesson(newRate);
      }, 50);
    }
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

  const totalQuestions = lesson.questions.length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const scoreLabel = result ? `${result.score}%` : '--';
  const skillLabel = skill === 'listening' ? 'Listening' : 'Reading';

  const navigator = (
    <QuestionNavigator
      total={totalQuestions}
      current={activeQuestionIndex}
      onSelect={setActiveQuestionIndex}
      getStatus={getQuestionStatus}
      title="Câu"
      summary={`${answeredCount}/${totalQuestions}`}
    />
  );

  const sourcePanel = skill === 'listening' ? (
    <LessonCard
      className="listening-player-card"
      title="Audio"
      action={allAnswered ? (
        <SecondaryButton onClick={() => setShowTranscript((current) => !current)}>
          {showTranscript ? <FiEyeOff /> : <FiEye />}
          {showTranscript ? 'Ẩn' : 'Text'}
        </SecondaryButton>
      ) : null}
    >
      <div className="listening-player-top">
        <button type="button" className="audio-play-button" onClick={() => speakListeningLesson()} aria-label="Play lesson audio">
          <FiVolume2 />
        </button>
        <div className="audio-player-copy">
          <strong>Đoạn {seekValue + 1}</strong>
          <span>{lesson.transcript?.[seekValue]?.text || ''}</span>
        </div>
      </div>

      <div className="audio-progress-row">
        <span>{seekValue + 1}</span>
        <input
          aria-label="Tua đến đoạn muốn nghe"
          type="range"
          min="0"
          max={seekMax}
          step="1"
          value={seekValue}
          onChange={(event) => handleSeekChange(event.target.value)}
        />
        <span>{seekMax + 1}</span>
      </div>

      <div className="audio-control-grid">
        <SecondaryButton onClick={handleStopListening}>
          <FiStopCircle /> Dừng
        </SecondaryButton>
        <label>
          Tốc độ
          <select aria-label="Playback speed" value={speechRate} onChange={(event) => handleSpeedChange(Number(event.target.value))}>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.15}>1.15x</option>
            <option value={1.3}>1.3x</option>
          </select>
        </label>
      </div>

      {showTranscript && (
        <div className="transcript-chat">
          {lesson.transcript.map((line, index) => (
            <div key={`${line.speaker}-${index}`} className={`transcript-bubble-row ${activeLineIndex === index ? 'is-active' : ''}`}>
              <span className="transcript-speaker-mark">{String(line.speaker || '?').slice(0, 1)}</span>
              <div className="transcript-bubble">
                <button type="button" onClick={() => speakTranscriptLine(line)} aria-label={`Nghe câu ${index + 1}`}>
                  <FiVolume2 /> {line.speaker}
                </button>
                <p>{line.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </LessonCard>
  ) : (
    <LessonCard
      className="reading-passage-card"
      title={lesson.passageTitle || lesson.title}
      action={(
        <SecondaryButton onClick={() => speak(speechText, { rate: speechRate })}>
          <FiVolume2 /> Nghe
        </SecondaryButton>
      )}
    >
      <article className="learning-reading-passage">
        {lesson.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <HighlightedText text={paragraph} vocabulary={lesson.vocabulary} />
          </p>
        ))}
      </article>
    </LessonCard>
  );

  const questionFooter = (
    <div className="learning-footer-actions">
      <div>
        <SecondaryButton onClick={() => setActiveQuestionIndex((index) => index - 1)} disabled={!canGoPrevious}>
          <FiArrowLeft /> Trước
        </SecondaryButton>
        <SecondaryButton onClick={() => setActiveQuestionIndex((index) => index + 1)} disabled={!canGoNext}>
          Tiếp <FiArrowRight />
        </SecondaryButton>
      </div>
      <div>
        {!result ? (
          <PrimaryButton onClick={handleSubmit} disabled={!allAnswered}>
            Chấm
          </PrimaryButton>
        ) : (
          <>
            <div className={`receptive-result ${result.score >= PASS_SCORE ? 'is-pass' : 'is-fail'}`}>
              <strong>{result.score}%</strong>
              <span>{result.correctCount}/{totalQuestions} câu đúng</span>
            </div>
            <SecondaryButton onClick={handleRetry}>
              <FiRefreshCw /> Làm lại
            </SecondaryButton>
            {result.score >= PASS_SCORE && (
              <PrimaryButton onClick={() => setShowCompletion(true)}>
                Hoàn thành <FiCheckCircle />
              </PrimaryButton>
            )}
          </>
        )}
      </div>
    </div>
  );

  const questionPanel = activeQuestion ? (
    <motion.div
      key={activeQuestion.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <QuestionCard
        badge={`${activeQuestionIndex + 1}/${totalQuestions}`}
        prompt={activeQuestion.prompt}
        status={checked ? (activeCorrect ? 'correct' : 'wrong') : ''}
        icon={checked && (activeCorrect ? <FiCheckCircle /> : <FiXCircle />)}
        footer={questionFooter}
      >
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
          <input
            aria-label="Trường nhập đáp án"
            className="receptive-fill-input"
            value={activeAnswer || ''}
            placeholder="Nhập đáp án…"
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
      </QuestionCard>
    </motion.div>
  ) : null;

  if (showCompletion) {
    const completionTitle = `Hoàn thành chủ đề ${skill === 'listening' ? 'Listening' : 'Reading'}`;

    return (
      <div className="receptive-page fade-in" style={{ '--receptive-accent': '#2563eb' }}>
        <section className="receptive-panel speaking-completion-panel">
          <div className="speaking-completion-head">
            <FiCheckCircle />
            <div>
              <span>{completionTitle}</span>
              <h1>{lesson.title}</h1>
            </div>
          </div>

          <ExpReward reward={expReward} />

          <div className="speaking-summary-grid">
            {lesson.questions.map((question, index) => {
              const isCorrect = isQuestionCorrect(question, answers[question.id]);
              return (
                <div key={question.id || index} className="speaking-summary-item">
                  <span>Câu {index + 1}</span>
                  <strong style={{ color: isCorrect ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
                    {isCorrect ? 'Đúng' : 'Sai'}
                  </strong>
                  <p>{question.prompt}</p>
                  <p className="speaking-question-translation" style={{ fontSize: '12px', color: 'var(--admin-muted)', marginTop: 4 }}>
                    Đáp án đúng: {question.type === 'true_false' ? String(question.answer) : question.answer}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="receptive-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(meta.listPath)}>
              <FiArrowLeft /> Về danh sách
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleRetry}>
              <FiRefreshCw /> Làm lại
            </button>
            {nextLesson && (
              <button type="button" className="btn btn-primary" onClick={() => navigate(`/${skill}/lessons/${getLessonId(nextLesson)}`)}>
                Bài tiếp theo <FiArrowRight />
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <LearningLayout
      accent="#2563EB"
      className={`learning-session-${skill} fade-in`}
      header={(
        <LessonHeader
          title={lesson.title}
          level={lesson.level || ''}
          topic={lesson.topic || ''}
          progress={progressPercent}
          answered={answeredCount}
          total={totalQuestions}
          score={scoreLabel}
          duration={lesson.duration || '--'}
          backLabel={meta.backLabel}
          onBack={() => navigate(meta.listPath)}
          confirmOnBack
        />
      )}
      leftPanel={sourcePanel}
      centerPanel={questionPanel}
      navigator={navigator}
    />
  );
};

export default ReceptiveLesson;
