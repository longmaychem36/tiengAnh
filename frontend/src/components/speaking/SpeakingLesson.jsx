import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiMic,
  FiRefreshCw,
  FiSettings,
  FiVolume2,
  FiX,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { speakingApi } from '../../api/speakingApi';
import Recorder from './Recorder';
import Loading from '../common/Loading';
import ExpReward from '../common/ExpReward';
import QuestionNavigator from '../common/QuestionNavigator';
import {
  LearningLayout,
  LessonCard,
  LessonHeader,
  PrimaryButton,
  QuestionCard,
  SecondaryButton
} from '../common/learning';
import { hasSpeechSupport, speakText, stopAllPlayback } from '../../utils/audioControl';

const getInitialThreshold = () => parseInt(localStorage.getItem('speaking_threshold'), 10) || 60;
const getInitialVoice = () => localStorage.getItem('speaking_voice') || '';
const getLessonId = (lesson) => lesson?.id ?? lesson?.Id;
const getNextLesson = (lessons, currentId) => {
  const index = lessons.findIndex((lesson) => String(getLessonId(lesson)) === String(currentId));
  return index >= 0 ? lessons[index + 1] || null : null;
};

const getRecordDuration = (text = '') => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(34, Math.max(12, Math.ceil(wordCount * 1.45)));
};

const getAttemptKey = (item, index) => item?.id || index;

const SpeakingLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);
  const [sentences, setSentences] = useState([]);
  const [nextLesson, setNextLesson] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [expReward, setExpReward] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState({});
  const [firstAttempts, setFirstAttempts] = useState({});

  const [showSettings, setShowSettings] = useState(false);
  const [passThreshold, setPassThreshold] = useState(getInitialThreshold);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(getInitialVoice);

  useEffect(() => {
    const loadVoices = () => {
      if (!hasSpeechSupport()) {
        setVoices([]);
        return;
      }

      const availableVoices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang?.startsWith('en'));
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !localStorage.getItem('speaking_voice')) {
        setSelectedVoiceURI(availableVoices[0].voiceURI);
      }
    };

    loadVoices();
    if (hasSpeechSupport() && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (hasSpeechSupport()) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLessonData(null);
    setSentences([]);
    setNextLesson(null);
    setShowCompletion(false);
    setExpReward(null);
    setCurrentIndex(0);
    setSelectedOptionIndex(0);
    setResult(null);
    setAttempts({});
    setFirstAttempts({});

    const request = speakingApi.getLessonDetails(id);

    Promise.all([
      request,
      speakingApi.getLessons().catch(() => null)
    ])
      .then(([res, lessonsRes]) => {
        if (cancelled) return;
        setLessonData(res.data.lesson);
        setSentences(res.data.sentences || []);

        const lessons = lessonsRes?.data?.lessons || [];
        setNextLesson(getNextLesson(lessons, id));
      })
      .catch((err) => {
        toast.error('Lỗi tải chủ đề');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stopAllPlayback();
    };
  }, [id]);

  const currentSentence = sentences[currentIndex];
  const currentOptions = currentSentence?.options || [];
  const selectedOption = currentOptions[selectedOptionIndex] || currentOptions[0] || null;
  const recordDuration = getRecordDuration(selectedOption?.text);
  const answeredCount = useMemo(() => Object.keys(attempts).length, [attempts]);
  const passedCount = useMemo(() => (
    sentences.filter((sentence, index) => Number(attempts[getAttemptKey(sentence, index)]?.score || 0) >= passThreshold).length
  ), [attempts, passThreshold, sentences]);

  const playTTS = useCallback((text) => {
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt không hỗ trợ đọc tự động.');
      return;
    }

    let voice = null;
    if (selectedVoiceURI && voices.length > 0) {
      voice = voices.find((item) => item.voiceURI === selectedVoiceURI) || null;
    }

    speakText(text, { lang: 'en-US', voice });
  }, [selectedVoiceURI, voices]);

  useEffect(() => {
    if (currentSentence && !loading && !showSettings && !showCompletion) {
      const timer = setTimeout(() => playTTS(currentSentence.question), 450);
      return () => clearTimeout(timer);
    }
  }, [currentSentence, loading, playTTS, showCompletion, showSettings]);

  useEffect(() => {
    if (showCompletion) stopAllPlayback();
  }, [showCompletion]);

  const handleSaveSettings = () => {
    localStorage.setItem('speaking_threshold', passThreshold);
    localStorage.setItem('speaking_voice', selectedVoiceURI);
    setShowSettings(false);
    toast.success('Đã lưu cài đặt');
  };

  const handleRecordingComplete = async (audioBlob) => {
    if (!selectedOption) {
      toast.error('Vui lòng chọn một câu trả lời mẫu trước khi ghi âm.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const res = await speakingApi.transcribeAndAnalyze(audioBlob, [selectedOption.text], {
        lessonId: id || '',
        questionId: currentSentence.id || '',
        targetText: selectedOption.text,
        prompt: currentSentence.question,
        passThreshold
      });
      const data = res.data;

      if (!data.transcript || data.transcript.trim() === '') {
        toast.error('Không nhận diện được giọng nói. Vui lòng nói to và rõ ràng hơn.');
        return;
      }

      const newResult = {
        score: Number(data.score || 0),
        transcript: data.transcript,
        feedback: data.feedback,
        matchedText: data.matchedText,
        missingWords: data.missingWords || [],
        extraWords: data.extraWords || [],
        targetText: selectedOption.text,
        targetTranslation: selectedOption.translation || '',
        question: currentSentence.question,
        questionTranslation: currentSentence.translation || ''
      };

      setResult(newResult);
      setAttempts((current) => ({
        ...current,
        [currentSentence.id || currentIndex]: newResult
      }));
      const attemptKey = getAttemptKey(currentSentence, currentIndex);
      setFirstAttempts((current) => current[attemptKey] ? current : {
        ...current,
        [attemptKey]: newResult
      });
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi nhận diện giọng nói';
      toast.error(errorMsg);
      setResult({
        score: 0,
        transcript: '',
        feedback: 'Không thể phân tích, vui lòng thử lại.',
        targetText: selectedOption.text,
        targetTranslation: selectedOption.translation || '',
        question: currentSentence.question
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => setResult(null);

  const handleSelectQuestion = (index) => {
    const sentence = sentences[index];
    const previousAttempt = attempts[getAttemptKey(sentence, index)] || null;
    const optionIndex = sentence?.options?.findIndex((option) => option.text === previousAttempt?.targetText) ?? -1;

    setCurrentIndex(index);
    setSelectedOptionIndex(optionIndex >= 0 ? optionIndex : 0);
    setResult(previousAttempt);
  };

  const getAverageScore = (attemptMap) => {
    if (!sentences.length) return 0;
    const totalScore = sentences.reduce((sum, sentence, index) => (
      sum + Number(attemptMap[getAttemptKey(sentence, index)]?.score || 0)
    ), 0);
    return Math.round(totalScore / sentences.length);
  };

  const finishLesson = async (finalAttempts = attempts) => {
    stopAllPlayback();
    setLoading(true);
    const currentKey = getAttemptKey(currentSentence, currentIndex);
    const firstAttemptMap = firstAttempts[currentKey]
      ? firstAttempts
      : { ...firstAttempts, [currentKey]: finalAttempts[currentKey] };
    speakingApi.saveProgress({
      lessonId: id,
      completed: true,
      score: getAverageScore(firstAttemptMap),
      attemptId: crypto.randomUUID()
    })
      .then(async (res) => {
        setExpReward(res.data?.expReward || null);
        const lessonsRes = await speakingApi.getLessons().catch(() => null);
        const lessons = lessonsRes?.data?.lessons || [];
        setNextLesson(getNextLesson(lessons, id));
        toast.success('Bạn đã hoàn thành chủ đề Speaking.');
        setShowCompletion(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Lỗi lưu tiến độ');
      })
      .finally(() => setLoading(false));
  };

  const handleNext = async () => {
    if (!result || result.score < passThreshold) {
      toast.error(`Bạn cần đạt tối thiểu ${passThreshold}% để qua câu này.`);
      return;
    }

    const currentKey = getAttemptKey(currentSentence, currentIndex);
    const mergedAttempts = { ...attempts, [currentKey]: result };
    const nextIndex = sentences.findIndex((sentence, index) => (
      index !== currentIndex && Number(mergedAttempts[getAttemptKey(sentence, index)]?.score || 0) < passThreshold
    ));

    if (nextIndex >= 0) {
      handleSelectQuestion(nextIndex);
      return;
    }

    finishLesson(mergedAttempts);
  };

  if (loading) return <Loading />;

  if (showCompletion) {
    const completionTitle = 'Hoàn thành chủ đề Speaking';

    return (
      <div className="receptive-page fade-in" style={{ '--receptive-accent': '#2563eb' }}>
        <section className="receptive-panel speaking-completion-panel">
          <div className="speaking-completion-head">
            <FiCheckCircle />
            <div>
              <span>{completionTitle}</span>
              <h1>{lessonData?.title}</h1>
            </div>
          </div>

          <ExpReward reward={expReward} />

          <div className="speaking-summary-grid">
            {sentences.map((sentence, index) => {
              const attempt = attempts[sentence.id || index];
              return (
                <div key={sentence.id || index} className="speaking-summary-item">
                  <span>Câu {index + 1}</span>
                  <strong>{attempt ? `${attempt.score}%` : 'Chưa có điểm'}</strong>
                  <p>{sentence.question}</p>
                  {sentence.translation && <p className="speaking-question-translation">{sentence.translation}</p>}
                </div>
              );
            })}
          </div>

          <div className="receptive-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/speaking/options')}>
              <FiArrowLeft /> Thoát
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/speaking/lessons')}>
              Về danh sách
            </button>
            {nextLesson && (
              <button type="button" className="btn btn-primary" onClick={() => navigate(`/speaking/lessons/${getLessonId(nextLesson)}`)}>
                Bài tiếp theo <FiArrowRight />
              </button>
            )}
          </div>
        </section>
      </div>
    );
  }

  if (!currentSentence) {
    return <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Chủ đề không có dữ liệu.</div>;
  }

  const isPassed = result && result.score >= passThreshold;
  const getQuestionStatus = (index) => {
    const attempt = attempts[getAttemptKey(sentences[index], index)];
    if (!attempt) return 'todo';
    return Number(attempt.score || 0) >= passThreshold ? 'passed' : 'failed';
  };

  const totalQuestions = sentences.length;
  const progressPercent = totalQuestions > 0 ? (passedCount / totalQuestions) * 100 : 0;
  const passRate = totalQuestions > 0 ? `${Math.round((passedCount / totalQuestions) * 100)}%` : '--';
  const recordingStatus = result ? 'Xong' : isAnalyzing ? 'Chấm' : 'Sẵn sàng';
  const recordingStatusClass = result ? 'is-completed' : isAnalyzing ? 'is-processing' : '';
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
    <>
      <LearningLayout
        accent="#2563EB"
        className="learning-session-speaking fade-in"
        header={(
          <LessonHeader
            title={lessonData?.title || 'Chưa có tiêu đề'}
            level={lessonData?.level || ''}
            topic={lessonData?.topic}
            progress={progressPercent}
            answered={answeredCount}
            total={totalQuestions}
            score={passRate}
            duration={lessonData?.duration || `${recordDuration}s/câu`}
            backLabel="Thoát"
            onBack={() => navigate('/speaking/lessons')}
            confirmOnBack
            actions={(
              <SecondaryButton onClick={() => setShowSettings(true)}>
                <FiSettings /> Cài đặt
              </SecondaryButton>
            )}
          />
        )}
        leftPanel={(
          <QuestionCard
            className="speaking-question-card"
            badge={`${currentIndex + 1}/${totalQuestions}`}
            prompt={currentSentence.question}
            footer={(
              <SecondaryButton onClick={() => playTTS(currentSentence.question)}>
                <FiVolume2 /> Nghe
              </SecondaryButton>
            )}
          >
            {currentSentence.translation && (
              <p className="speaking-question-translation">{currentSentence.translation}</p>
            )}

            <div className="speaking-option-list">
              {currentOptions.map((option, index) => {
                const selected = selectedOptionIndex === index;
                return (
                  <button
                    key={`${option.text}-${index}`}
                    type="button"
                    className={`speaking-answer-option ${selected ? 'is-selected' : ''}`}
                    onClick={() => {
                      if (!result) setSelectedOptionIndex(index);
                    }}
                  >
                    <span>{index + 1}</span>
                    <div>
                      <strong>{option.text}</strong>
                      {option.translation && <p>{option.translation}</p>}
                    </div>
                    <FiVolume2
                      onClick={(event) => {
                        event.stopPropagation();
                        playTTS(option.text);
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </QuestionCard>
        )}
        centerPanel={(
          <LessonCard
            className="speaking-recording-card"
            title="Ghi âm"
            action={<span className={`learning-status-pill ${recordingStatusClass}`}>{recordingStatus}</span>}
          >
            <div className="recording-status-row">
              <span className="lesson-topic-tag">{recordDuration}s tối đa</span>
              <span className="lesson-topic-tag">{passThreshold}%</span>
            </div>

            {!result ? (
              <Recorder
                onRecordingComplete={handleRecordingComplete}
                isAnalyzing={isAnalyzing}
                maxDuration={recordDuration}
              />
            ) : (
              <motion.div className="speaking-feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`speaking-score speaking-accuracy-score ${isPassed ? 'is-pass' : 'is-fail'}`}>
                  {isPassed ? <FiCheckCircle /> : <FiXCircle />}
                  <strong>{result.score}%</strong>
                  <span>Độ chính xác</span>
                </div>

                <div className="speaking-feedback-grid">
                  <div>
                    <span>Bạn nói</span>
                    <p>{result.transcript || '…'}</p>
                  </div>
                  <div>
                    <span>Mẫu</span>
                    <p>{result.targetText}</p>
                  </div>
                </div>

                {result.feedback && <p className="speaking-feedback-note">{result.feedback}</p>}

                <div className="learning-footer-actions">
                  <div>
                    {!isPassed && (
                      <SecondaryButton onClick={handleRetry}>
                        <FiRefreshCw /> Thử lại
                      </SecondaryButton>
                    )}
                  </div>
                  <div>
                    {isPassed && (
                      <PrimaryButton onClick={handleNext}>
                        Tiếp tục <FiArrowRight />
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </LessonCard>
        )}
        navigator={navigator}
      />

      {showSettings && (
        <div className="productive-modal-backdrop">
          <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="productive-modal">
            <div className="productive-modal-head">
              <h3>Cài đặt phần nói</h3>
              <button type="button" className="learning-btn learning-btn-ghost btn-icon" onClick={() => setShowSettings(false)}>
                <FiX />
              </button>
            </div>

            <div className="productive-setting">
              <span>Yêu cầu độ chính xác ({passThreshold}%)</span>
              <input
                aria-label="Yêu cầu độ chính xác"
                type="range"
                min="50"
                max="100"
                step="5"
                value={passThreshold}
                onChange={(event) => setPassThreshold(parseInt(event.target.value, 10))}
              />
              <p>Đặt 60-70% để luyện thoải mái, hoặc 80-100% nếu muốn luyện chuẩn hơn.</p>
            </div>

            <div className="productive-setting">
              <span>Giọng đọc mẫu</span>
              <select aria-label="Chọn giọng đọc" value={selectedVoiceURI} onChange={(event) => setSelectedVoiceURI(event.target.value)}>
                {voices.length === 0 && <option value="">Đang tải giọng đọc…</option>}
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>
                ))}
              </select>
            </div>

            <PrimaryButton className="w-full" onClick={handleSaveSettings}>
              Lưu cài đặt
            </PrimaryButton>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SpeakingLesson;
