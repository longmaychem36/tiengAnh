import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiEdit3,
  FiHeadphones,
  FiLoader,
  FiMic,
  FiRefreshCw,
  FiSend,
  FiVolume2,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import QuestionNavigator from '../components/common/QuestionNavigator';
import Recorder from '../components/speaking/Recorder';
import {
  LearningLayout,
  LessonCard,
  LessonHeader,
  PrimaryButton,
  QuestionCard,
  SecondaryButton
} from '../components/common/learning';
import { onboardingApi } from '../api/onboardingApi';
import { speakingApi } from '../api/speakingApi';
import { writingApi } from '../api/writingApi';
import { useAuth } from '../hooks/useAuth';
import { hasSpeechSupport, speakText, stopAllPlayback } from '../utils/audioControl';

const surveyOptions = [
  {
    value: 'new',
    icon: '/nav-icons/learn.svg',
    title: 'Tôi mới học tiếng Anh',
    text: 'Bắt đầu từ các bài nền tảng về chào hỏi, câu đơn và từ quen thuộc.'
  },
  {
    value: 'basic',
    icon: '/nav-icons/admin-speaking.svg',
    title: 'Tôi có thể hiểu và giao tiếp cơ bản',
    text: 'Bỏ qua bài nền tảng và vào lộ trình chính.'
  },
  {
    value: 'unsure',
    icon: '/nav-icons/admin-placement.svg',
    title: 'Tôi không chắc',
    text: 'Làm bài đánh giá 4 kỹ năng để hệ thống xếp lộ trình phù hợp.'
  }
];

const skillMeta = {
  listening: {
    label: 'Nghe',
    title: 'Nghe và trả lời',
    icon: FiHeadphones,
    accent: '#0e7490'
  },
  speaking: {
    label: 'Nói',
    title: 'Chọn phản hồi tự nhiên',
    icon: FiMic,
    accent: '#c2410c'
  },
  reading: {
    label: 'Đọc',
    title: 'Đọc hiểu đoạn ngắn',
    icon: FiBookOpen,
    accent: '#7c3aed'
  },
  writing: {
    label: 'Viết',
    title: 'Viết câu tiếng Anh',
    icon: FiEdit3,
    accent: '#15803d'
  }
};

const skillOrder = ['listening', 'speaking', 'reading', 'writing'];
const sourceOrder = { foundation: 1, main: 2 };
const textQuestionTypes = new Set(['fill_blank', 'short_answer']);
const DEFAULT_SPEAKING_PASS_SCORE = 60;
const DEFAULT_WRITING_PASS_SCORE = 80;

const getRecordDuration = (text = '') => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(34, Math.max(12, Math.ceil(wordCount * 1.45)));
};

function mergePlacement(user, placement = {}) {
  return {
    ...user,
    onboardingCompleted: placement.onboardingCompleted ?? placement.placement?.onboardingCompleted ?? true,
    placementLevel: placement.placementLevel ?? placement.resultLevel ?? placement.placement?.placementLevel ?? user?.placementLevel,
    placementSource: placement.placementSource ?? placement.placement?.placementSource ?? user?.placementSource,
    placementCompletedAt: placement.placementCompletedAt ?? placement.placement?.placementCompletedAt ?? user?.placementCompletedAt
  };
}

function isAnswered(value) {
  if (value && typeof value === 'object') {
    if (value.kind === 'speaking' || value.kind === 'writing') {
      return Number.isFinite(Number(value.score));
    }
    return Object.keys(value).length > 0;
  }
  return String(value ?? '').trim().length > 0;
}

function getQuestionPayload(question) {
  return question?.payload && typeof question.payload === 'object' ? question.payload : {};
}

function getSpeakingOptions(question) {
  const payloadOptions = getQuestionPayload(question).options;
  if (Array.isArray(payloadOptions) && payloadOptions.length > 0) {
    return payloadOptions
      .filter((option) => option?.text)
      .map((option) => ({ text: option.text, translation: option.translation || '' }));
  }

  return (question?.options || []).map((text) => ({ text, translation: '' }));
}

function getPassScore(question) {
  const configured = Number(getQuestionPayload(question).passScore);
  if (Number.isFinite(configured)) return configured;
  if (question?.skill === 'writing') return DEFAULT_WRITING_PASS_SCORE;
  if (question?.skill === 'speaking') return DEFAULT_SPEAKING_PASS_SCORE;
  return 70;
}

function isPassingPlacementAnswer(question, answer) {
  if (!answer || typeof answer !== 'object') return false;
  return Number(answer.score || 0) >= getPassScore(question);
}

function sourceLabel(sourceType) {
  return sourceType === 'main' ? 'Lộ trình chính' : 'Nền tảng';
}

function sourceShortLabel(sourceType) {
  return sourceType === 'main' ? 'Bài chính' : 'Bài nền tảng';
}

function skillLabel(skill) {
  return skillMeta[skill]?.label || 'Tổng hợp';
}

function splitContext(contextText = '') {
  return String(contextText || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildPlacementParts(questions = []) {
  const grouped = new Map();

  questions.forEach((question) => {
    const skill = skillOrder.includes(question.skill) ? question.skill : 'reading';
    const sourceLessonType = question.sourceLessonType || (question.difficulty === 'hard' ? 'main' : 'foundation');
    const sourceLessonId = question.sourceLessonId || `${skill}-${sourceLessonType}`;
    const key = `${skill}:${sourceLessonType}:${sourceLessonId}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        skill,
        sourceLessonType,
        sourceLessonId,
        title: question.sourceLessonTitle || skillMeta[skill]?.title || 'Bài đánh giá',
        orderIndex: Number(question.orderIndex || 0),
        questions: []
      });
    }

    grouped.get(key).questions.push(question);
  });

  return Array.from(grouped.values())
    .map((part) => ({
      ...part,
      questions: [...part.questions].sort((a, b) => Number(a.orderIndex || 0) - Number(b.orderIndex || 0))
    }))
    .sort((a, b) => {
      const skillDiff = skillOrder.indexOf(a.skill) - skillOrder.indexOf(b.skill);
      if (skillDiff !== 0) return skillDiff;
      const sourceDiff = (sourceOrder[a.sourceLessonType] || 3) - (sourceOrder[b.sourceLessonType] || 3);
      if (sourceDiff !== 0) return sourceDiff;
      return a.orderIndex - b.orderIndex;
    });
}

function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showListeningText, setShowListeningText] = useState(false);
  const [speakingSelections, setSpeakingSelections] = useState({});
  const [writingDrafts, setWritingDrafts] = useState({});
  const [analyzingQuestionId, setAnalyzingQuestionId] = useState(null);
  const [checkingQuestionId, setCheckingQuestionId] = useState(null);

  useEffect(() => () => stopAllPlayback(), []);

  useEffect(() => {
    setActivePartIndex(0);
    setActiveQuestionIndex(0);
    setShowListeningText(false);
    setSpeakingSelections({});
    setWritingDrafts({});
    setAnalyzingQuestionId(null);
    setCheckingQuestionId(null);
  }, [attempt?.attemptId]);

  useEffect(() => {
    setActiveQuestionIndex(0);
    setShowListeningText(false);
    stopAllPlayback();
  }, [activePartIndex]);

  const parts = useMemo(() => buildPlacementParts(attempt?.questions || []), [attempt]);
  const currentPart = parts[activePartIndex] || null;
  const currentQuestions = currentPart?.questions || [];
  const currentQuestion = currentQuestions[activeQuestionIndex] || null;
  const totalQuestions = attempt?.questions?.length || 0;
  const answeredCount = useMemo(() => Object.values(answers).filter(isAnswered).length, [answers]);
  const partAnsweredCount = useMemo(
    () => currentQuestions.filter((question) => isAnswered(answers[question.id])).length,
    [answers, currentQuestions]
  );
  const partComplete = currentQuestions.length > 0 && partAnsweredCount === currentQuestions.length;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;
  const progressPercent = totalQuestions ? (answeredCount / totalQuestions) * 100 : 0;

  const finishWithPlacement = (payload) => {
    updateUser(mergePlacement(user, payload));
  };

  const handleSurvey = async (answer) => {
    setLoading(true);
    try {
      const res = await onboardingApi.submitSurvey(answer);
      if (res.data?.requiresTest) {
        const testRes = await onboardingApi.startTest();
        setAttempt(testRes.data);
        setAnswers({});
        setResult(null);
        return;
      }

      finishWithPlacement(res.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Không thể lưu khảo sát.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
  };

  const clearAnswer = (questionId) => {
    setAnswers((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const handleSpeakingOptionSelect = (questionId, optionIndex) => {
    setSpeakingSelections((current) => ({ ...current, [questionId]: optionIndex }));
    clearAnswer(questionId);
  };

  const handleSpeakingRecordingComplete = async (question, audioBlob) => {
    const options = getSpeakingOptions(question);
    const selectedIndex = speakingSelections[question.id] ?? 0;
    const selectedOption = options[selectedIndex] || options[0];

    if (!selectedOption?.text) {
      toast.error('Vui lòng chọn câu trả lời mẫu trước khi ghi âm.');
      return;
    }

    setAnalyzingQuestionId(question.id);
    try {
      const res = await speakingApi.transcribeAndAnalyze(audioBlob, [selectedOption.text], {
        lessonId: question.sourceLessonId || '',
        questionId: question.sourceQuestionId || question.id,
        targetText: selectedOption.text,
        prompt: question.prompt,
        passThreshold: getPassScore(question)
      });
      const data = res.data || {};

      if (!data.transcript || !String(data.transcript).trim()) {
        toast.error('Không nhận diện được giọng nói. Vui lòng thử lại.');
        return;
      }

      handleAnswer(question.id, {
        kind: 'speaking',
        score: Number(data.score || 0),
        transcript: data.transcript,
        feedback: data.feedback || '',
        matchedText: data.matchedText || selectedOption.text,
        targetText: selectedOption.text,
        targetTranslation: selectedOption.translation || '',
        selectedOptionIndex: selectedIndex
      });
    } catch (err) {
      toast.error(err.message || 'Không thể chấm phần nói.');
    } finally {
      setAnalyzingQuestionId(null);
    }
  };

  const handleWritingDraftChange = (questionId, value) => {
    setWritingDrafts((current) => ({ ...current, [questionId]: value }));
  };

  const handleWritingCheck = async (question) => {
    const payload = getQuestionPayload(question);
    const userText = String(writingDrafts[question.id] || '').trim();
    const targetText = payload.targetText || '';

    if (!userText) {
      toast.error('Vui lòng nhập câu trả lời.');
      return;
    }

    if (!targetText) {
      toast.error('Bài viết này chưa có đáp án mẫu để chấm.');
      return;
    }

    setCheckingQuestionId(question.id);
    try {
      const res = await writingApi.checkWriting({
        userText,
        targetText,
        lessonId: question.sourceLessonId || '',
        exerciseId: question.sourceQuestionId || '',
        prompt: question.prompt
      });
      const data = res.data || {};

      handleAnswer(question.id, {
        kind: 'writing',
        score: Number(data.score || 0),
        userText,
        targetText,
        feedback: data.feedback || '',
        correctedText: data.correctedText || '',
        source: data.source || ''
      });
    } catch (err) {
      toast.error(err.message || 'Không thể chấm phần viết.');
    } finally {
      setCheckingQuestionId(null);
    }
  };

  const playListeningText = () => {
    const text = currentPart?.questions?.[0]?.contextText || currentQuestion?.contextText || currentQuestion?.prompt;
    if (!text) return;
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt chưa hỗ trợ đọc audio.');
      return;
    }

    stopAllPlayback();
    speakText(text, { lang: 'en-US' });
  };

  const handleSubmitTest = async () => {
    if (!attempt || !allAnswered) {
      toast.error('Hãy trả lời đủ các câu trước khi nộp bài.');
      return;
    }

    setLoading(true);
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const res = await onboardingApi.submitTest(attempt.attemptId, payload);
      setResult(res.data);
      finishWithPlacement(res.data);
      stopAllPlayback();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Không thể nộp bài kiểm tra.');
    } finally {
      setLoading(false);
    }
  };

  const goPrevious = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((index) => index - 1);
      return;
    }

    if (activePartIndex > 0) {
      const previousPart = parts[activePartIndex - 1];
      setActivePartIndex((index) => index - 1);
      setActiveQuestionIndex(Math.max((previousPart?.questions?.length || 1) - 1, 0));
    }
  };

  const goNext = () => {
    if (!currentPart) return;

    if (activeQuestionIndex + 1 < currentQuestions.length) {
      setActiveQuestionIndex((index) => index + 1);
      return;
    }

    if (!partComplete) {
      toast.error('Hãy hoàn thành bài này trước khi sang bài tiếp theo.');
      return;
    }

    if (activePartIndex + 1 < parts.length) {
      setActivePartIndex((index) => index + 1);
      setActiveQuestionIndex(0);
      return;
    }

    handleSubmitTest();
  };

  const renderPlacementNavFooter = () => {
    if (!currentPart || !currentQuestion) return null;

    const canGoPrevious = activePartIndex > 0 || activeQuestionIndex > 0;
    const isLastQuestion = activeQuestionIndex + 1 >= currentQuestions.length;
    const isLastPart = activePartIndex + 1 >= parts.length;
    const nextLabel = isLastQuestion ? (isLastPart ? 'Nộp bài' : 'Sang bài tiếp theo') : 'Tiếp';

    return (
      <div className="learning-footer-actions placement-nav-footer">
        <div>
          <SecondaryButton onClick={goPrevious} disabled={!canGoPrevious || loading}>
            <FiArrowLeft /> Trước
          </SecondaryButton>
          <SecondaryButton onClick={goNext} disabled={loading || (isLastQuestion && !partComplete)}>
            {nextLabel} {loading ? <FiLoader className="spin" /> : <FiArrowRight />}
          </SecondaryButton>
        </div>
        <div className="placement-question-meta">
          <span>{sourceShortLabel(currentPart.sourceLessonType)}</span>
          <strong>x{Number(currentQuestion.weight || 1).toFixed(2)}</strong>
        </div>
      </div>
    );
  };

  const goDashboard = () => navigate('/dashboard', { replace: true });
  const resetToSurvey = () => {
    setAttempt(null);
    setAnswers({});
    setResult(null);
    setActivePartIndex(0);
    setActiveQuestionIndex(0);
    setSpeakingSelections({});
    setWritingDrafts({});
    setAnalyzingQuestionId(null);
    setCheckingQuestionId(null);
    stopAllPlayback();
  };

  const renderSourcePanel = () => {
    if (!currentPart) return null;

    const meta = skillMeta[currentPart.skill] || skillMeta.reading;
    const rawContext = currentPart.questions[0]?.contextText || '';
    const contextLines = currentPart.skill === 'speaking'
      ? splitContext(String(rawContext).split(/\n\s*\n/)[0] || rawContext)
      : splitContext(rawContext);

    if (currentPart.skill === 'listening') {
      return (
        <LessonCard
          className="listening-player-card placement-source-card"
          title="Audio"
          action={(
            <SecondaryButton onClick={() => setShowListeningText((current) => !current)}>
              <FiBookOpen /> {showListeningText ? 'Ẩn text' : 'Text'}
            </SecondaryButton>
          )}
        >
          <div className="listening-player-top">
            <button type="button" className="audio-play-button" onClick={playListeningText} aria-label="Nghe bài đánh giá">
              <FiVolume2 />
            </button>
            <div className="audio-player-copy">
              <strong>{sourceShortLabel(currentPart.sourceLessonType)}</strong>
              <span>{currentPart.title}</span>
            </div>
          </div>

          <div className="placement-part-summary">
            <span>{meta.label}</span>
            <strong>{partAnsweredCount}/{currentQuestions.length} câu</strong>
          </div>

          {showListeningText && (
            <div className="placement-context-lines">
              {contextLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
            </div>
          )}
        </LessonCard>
      );
    }

    if (currentPart.skill === 'reading') {
      return (
        <LessonCard
          className="reading-passage-card placement-source-card"
          title={currentPart.title}
          eyebrow={sourceLabel(currentPart.sourceLessonType)}
          action={(
            <SecondaryButton onClick={() => speakText(contextLines.join(' '), { lang: 'en-US' })}>
              <FiVolume2 /> Nghe
            </SecondaryButton>
          )}
        >
          <article className="learning-reading-passage">
            {contextLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
          </article>
        </LessonCard>
      );
    }

    if (currentPart.skill === 'speaking') {
      const options = getSpeakingOptions(currentQuestion);
      const selectedIndex = speakingSelections[currentQuestion.id] ?? 0;
      const currentAnswer = answers[currentQuestion.id];

      return (
        <QuestionCard
          className="speaking-question-card placement-source-card"
          badge={`${activeQuestionIndex + 1}/${currentQuestions.length}`}
          prompt={currentQuestion.prompt}
          status={currentAnswer ? (isPassingPlacementAnswer(currentQuestion, currentAnswer) ? 'correct' : 'wrong') : ''}
          footer={(
            <SecondaryButton onClick={() => speakText(currentQuestion.prompt, { lang: 'en-US' })}>
              <FiVolume2 /> Nghe
            </SecondaryButton>
          )}
        >
          {getQuestionPayload(currentQuestion).questionTranslation && (
            <p className="speaking-question-translation">{getQuestionPayload(currentQuestion).questionTranslation}</p>
          )}

          <div className="speaking-option-list">
            {options.map((option, index) => (
              <button
                key={`${option.text}-${index}`}
                type="button"
                className={`speaking-answer-option ${selectedIndex === index ? 'is-selected' : ''}`}
                onClick={() => handleSpeakingOptionSelect(currentQuestion.id, index)}
              >
                <span>{index + 1}</span>
                <div>
                  <strong>{option.text}</strong>
                  {option.translation && <p>{option.translation}</p>}
                </div>
                <FiVolume2
                  onClick={(event) => {
                    event.stopPropagation();
                    speakText(option.text, { lang: 'en-US' });
                  }}
                />
              </button>
            ))}
          </div>
        </QuestionCard>
      );
    }

    const writingAnswer = answers[currentQuestion.id];
    const writingPrompt = getQuestionPayload(currentQuestion).contentVI || currentQuestion.prompt;

    return (
      <LessonCard className="writing-prompt-card placement-source-card" title="Đề bài" eyebrow={sourceLabel(currentPart.sourceLessonType)}>
        <div className="writing-prompt-box">
          <h3>{writingPrompt}</h3>
        </div>
        {writingAnswer?.targetText && (
          <div className="placement-context-lines">
            <p>{writingAnswer.targetText}</p>
          </div>
        )}
      </LessonCard>
    );
  };

  const renderQuestionBody = () => {
    if (!currentQuestion) return null;

    const activeAnswer = answers[currentQuestion.id] ?? '';
    const type = currentQuestion.questionType;

    if (type === 'true_false') {
      return (
        <div className="receptive-options is-boolean">
          <button
            type="button"
            className={activeAnswer === 'true' ? 'is-selected' : ''}
            onClick={() => handleAnswer(currentQuestion.id, 'true')}
          >
            True
          </button>
          <button
            type="button"
            className={activeAnswer === 'false' ? 'is-selected' : ''}
            onClick={() => handleAnswer(currentQuestion.id, 'false')}
          >
            False
          </button>
        </div>
      );
    }

    if (textQuestionTypes.has(type) || currentQuestion.options.length === 0) {
      return (
        <textarea
          className="placement-text-answer"
          rows={currentQuestion.skill === 'writing' ? 4 : 2}
          value={activeAnswer}
          onChange={(event) => handleAnswer(currentQuestion.id, event.target.value)}
          placeholder={currentQuestion.skill === 'writing' ? 'Viết câu tiếng Anh...' : 'Nhập đáp án'}
        />
      );
    }

    return (
      <div className="receptive-options">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            type="button"
            className={activeAnswer === option ? 'is-selected' : ''}
            onClick={() => handleAnswer(currentQuestion.id, option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  const renderSpeakingWorkPanel = () => {
    const answer = answers[currentQuestion.id];
    const options = getSpeakingOptions(currentQuestion);
    const selectedIndex = speakingSelections[currentQuestion.id] ?? 0;
    const selectedOption = options[selectedIndex] || options[0];
    const recordDuration = getRecordDuration(selectedOption?.text || currentQuestion.prompt);
    const isAnalyzing = analyzingQuestionId === currentQuestion.id;
    const isPassed = isPassingPlacementAnswer(currentQuestion, answer);

    return (
      <LessonCard
        className="speaking-recording-card placement-work-card"
        title="Ghi âm"
        action={<span className={`learning-status-pill ${answer ? 'is-completed' : isAnalyzing ? 'is-processing' : ''}`}>{answer ? 'Xong' : isAnalyzing ? 'Chấm' : 'Sẵn sàng'}</span>}
      >
        <div className="recording-status-row">
          <span className="lesson-topic-tag">{recordDuration}s tối đa</span>
          <span className="lesson-topic-tag">{getPassScore(currentQuestion)}%</span>
        </div>

        {!answer ? (
          <Recorder
            onRecordingComplete={(audioBlob) => handleSpeakingRecordingComplete(currentQuestion, audioBlob)}
            isAnalyzing={isAnalyzing}
            maxDuration={recordDuration}
          />
        ) : (
          <motion.div className="speaking-feedback placement-speaking-feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`speaking-score speaking-accuracy-score ${isPassed ? 'is-pass' : 'is-fail'}`}>
              {isPassed ? <FiCheckCircle /> : <FiXCircle />}
              <strong>{answer.score}%</strong>
              <span>Độ chính xác</span>
            </div>

            <div className="speaking-feedback-grid">
              <div>
                <span>Bạn nói</span>
                <p>{answer.transcript || '...'}</p>
              </div>
              <div>
                <span>Mẫu</span>
                <p>{answer.targetText}</p>
              </div>
            </div>

            {answer.feedback && <p className="speaking-feedback-note">{answer.feedback}</p>}

            <div className="learning-footer-actions">
              <div>
                <SecondaryButton onClick={() => clearAnswer(currentQuestion.id)}>
                  <FiRefreshCw /> Thử lại
                </SecondaryButton>
              </div>
            </div>
          </motion.div>
        )}

        {renderPlacementNavFooter()}
      </LessonCard>
    );
  };

  const renderWritingWorkPanel = () => {
    const answer = answers[currentQuestion.id];
    const draft = writingDrafts[currentQuestion.id] ?? answer?.userText ?? '';
    const isChecking = checkingQuestionId === currentQuestion.id;
    const isPassed = isPassingPlacementAnswer(currentQuestion, answer);
    const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;
    const characterCount = draft.length;

    return (
      <LessonCard
        className="writing-editor-card placement-work-card"
        title="Bài làm"
        action={isChecking ? <span className="learning-status-pill is-processing">Đang chấm</span> : null}
      >
        <textarea
          aria-label="Nội dung bài viết"
          className="productive-textarea"
          rows={10}
          value={draft}
          onChange={(event) => handleWritingDraftChange(currentQuestion.id, event.target.value)}
          disabled={answer != null || isChecking}
          placeholder="Nhập câu tiếng Anh của bạn..."
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
        </div>

        {answer && (
          <motion.div className="writing-feedback placement-writing-feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`speaking-score ${isPassed ? 'is-pass' : 'is-fail'}`}>
              {isPassed ? <FiCheckCircle /> : <FiXCircle />}
              <strong>{answer.score}%</strong>
              <span>{isPassed ? 'Đạt yêu cầu' : 'Cần sửa thêm'}</span>
            </div>

            <div className="writing-review-grid">
              <div>
                <span>Bạn</span>
                <p>{answer.userText}</p>
              </div>
              <div>
                <span>Mẫu</span>
                <p>{answer.targetText}</p>
              </div>
            </div>

            {answer.feedback && <p className="speaking-feedback-note">{answer.feedback}</p>}
          </motion.div>
        )}

        <div className="writing-editor-footer">
          {answer && (
            <SecondaryButton onClick={() => clearAnswer(currentQuestion.id)}>
              <FiRefreshCw /> Sửa lại
            </SecondaryButton>
          )}
          <PrimaryButton onClick={() => handleWritingCheck(currentQuestion)} disabled={isChecking || !draft.trim() || answer != null}>
            {isChecking ? <FiLoader className="spin" /> : <FiSend />} Chấm
          </PrimaryButton>
        </div>

        {renderPlacementNavFooter()}
      </LessonCard>
    );
  };

  const renderPlacementSession = () => {
    if (!currentPart || !currentQuestion) return null;

    const meta = skillMeta[currentPart.skill] || skillMeta.reading;
    const Icon = meta.icon;
    const questionAnswered = isAnswered(answers[currentQuestion.id]);

    const navigator = (
      <QuestionNavigator
        total={currentQuestions.length}
        current={activeQuestionIndex}
        onSelect={setActiveQuestionIndex}
        getStatus={(index) => (isAnswered(answers[currentQuestions[index]?.id]) ? 'attempted' : 'todo')}
        title="Câu"
        summary={`${partAnsweredCount}/${currentQuestions.length}`}
      />
    );

    const questionFooter = renderPlacementNavFooter();

    const questionPanel = currentPart.skill === 'speaking' ? (
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {renderSpeakingWorkPanel()}
      </motion.div>
    ) : currentPart.skill === 'writing' ? (
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {renderWritingWorkPanel()}
      </motion.div>
    ) : (
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <QuestionCard
          badge={`${activeQuestionIndex + 1}/${currentQuestions.length}`}
          prompt={currentQuestion.prompt}
          status={questionAnswered ? 'attempted' : ''}
          footer={questionFooter}
        >
          {renderQuestionBody()}
        </QuestionCard>
      </motion.div>
    );

    return (
      <LearningLayout
        accent={meta.accent}
        className="placement-learning-session fade-in"
        header={(
          <LessonHeader
            title={currentPart.title}
            subtitle={`${meta.title} - ${sourceLabel(currentPart.sourceLessonType)}`}
            level={`${activePartIndex + 1}/${parts.length} bài`}
            topic={(
              <span className="placement-topic-label">
                <Icon /> {skillLabel(currentPart.skill)}
              </span>
            )}
            progress={progressPercent}
            answered={answeredCount}
            total={totalQuestions}
            score="--"
            duration="Đầu vào"
            backLabel="Khảo sát"
            onBack={resetToSurvey}
          />
        )}
        leftPanel={renderSourcePanel()}
        centerPanel={questionPanel}
        navigator={navigator}
      />
    );
  };

  return (
    <div className={`onboarding-page ${attempt && !result ? 'is-placement-session' : ''}`}>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`onboarding-shell ${attempt && !result ? 'is-placement-session' : ''}`}
      >
        {(!attempt || result) && (
          <div className="onboarding-brand">
            <span>L</span>
            <strong>LingoWeb</strong>
          </div>
        )}

        {!attempt && !result && (
          <>
            <section className="onboarding-head">
              <span>Thiết lập lộ trình</span>
              <h1>Bạn đang ở mức nào?</h1>
            </section>

            <div className="onboarding-choice-grid">
              {surveyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="onboarding-choice"
                  onClick={() => handleSurvey(option.value)}
                  disabled={loading}
                >
                  <span><img src={option.icon} alt="" aria-hidden="true" /></span>
                  <strong>{option.title}</strong>
                  <small>{option.text}</small>
                </button>
              ))}
            </div>
          </>
        )}

        {attempt && !result && renderPlacementSession()}

        {result && (
          <section className="onboarding-result">
            <FiCheckCircle />
            <span>Kết quả: {result.score}%</span>
            <h1>{result.resultLevel === 'basic' ? 'Bạn có thể bắt đầu từ lộ trình chính' : 'Bạn sẽ bắt đầu từ bài nền tảng'}</h1>
            <p>
              {result.correctCount}/{result.totalQuestions} câu đúng · {result.earnedWeight}/{result.totalWeight} điểm trọng số
            </p>
            {result.skillScores?.length > 0 && (
              <div className="placement-result-grid">
                {result.skillScores.map((item) => (
                  <div key={item.skill}>
                    <span>{skillLabel(item.skill)}</span>
                    <strong>{item.score}%</strong>
                    <small>{item.correctCount}/{item.totalQuestions} câu</small>
                  </div>
                ))}
              </div>
            )}
            <button type="button" className="btn btn-primary btn-lg" onClick={goDashboard}>
              Vào tổng quan <FiArrowRight />
            </button>
          </section>
        )}
      </motion.main>
    </div>
  );
}

export default Onboarding;
