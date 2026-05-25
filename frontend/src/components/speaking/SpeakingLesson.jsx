import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiMic,
  FiRefreshCw,
  FiSettings,
  FiVolume2,
  FiX,
  FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { speakingApi } from '../../api/speakingApi';
import ProgressBar from './ProgressBar';
import Recorder from './Recorder';
import Loading from '../common/Loading';
import ExpReward from '../common/ExpReward';
import { hasSpeechSupport, speakText, stopAllPlayback } from '../../utils/audioControl';

const getInitialThreshold = () => parseInt(localStorage.getItem('speaking_threshold'), 10) || 60;
const getInitialVoice = () => localStorage.getItem('speaking_voice') || '';

const getRecordDuration = (text = '') => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(24, Math.max(10, Math.ceil(wordCount * 1.25)));
};

const SpeakingLesson = () => {
  const { id, sessionId } = useParams();
  const navigate = useNavigate();
  const isPersonalized = Boolean(sessionId);

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
        .filter((voice) => voice.lang.startsWith('en'));
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

    const request = isPersonalized
      ? speakingApi.getPersonalizedLesson(sessionId)
      : speakingApi.getLessonDetails(id);

    Promise.all([
      request,
      isPersonalized ? Promise.resolve(null) : speakingApi.getLessons().catch(() => null)
    ])
      .then(([res, lessonsRes]) => {
        if (cancelled) return;
        setLessonData(res.data.lesson);
        setSentences(res.data.sentences || []);

        const lessons = lessonsRes?.data?.lessons || [];
        const currentLessonIndex = lessons.findIndex((lesson) => String(lesson.id) === String(id));
        setNextLesson(currentLessonIndex >= 0 ? lessons[currentLessonIndex + 1] || null : null);
      })
      .catch((err) => {
        toast.error(isPersonalized ? 'Bài luyện AI đã hết hạn hoặc không tồn tại' : 'Lỗi tải chủ đề');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stopAllPlayback();
    };
  }, [id, sessionId, isPersonalized]);

  const currentSentence = sentences[currentIndex];
  const currentOptions = currentSentence?.options || [];
  const selectedOption = currentOptions[selectedOptionIndex] || currentOptions[0] || null;
  const recordDuration = getRecordDuration(selectedOption?.text);
  const answeredCount = useMemo(() => Object.keys(attempts).length, [attempts]);

  const playTTS = (text) => {
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt không hỗ trợ đọc tự động.');
      return;
    }

    let voice = null;
    if (selectedVoiceURI && voices.length > 0) {
      voice = voices.find((item) => item.voiceURI === selectedVoiceURI) || null;
    }

    speakText(text, { lang: 'en-US', voice });
  };

  useEffect(() => {
    if (currentSentence && !loading && !showSettings) {
      const timer = setTimeout(() => playTTS(currentSentence.question), 450);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentSentence, loading, showSettings]);

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
        lessonId: id || sessionId || '',
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
        question: currentSentence.question
      };

      setResult(newResult);
      setAttempts((current) => ({
        ...current,
        [currentSentence.id || currentIndex]: newResult
      }));
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Lỗi nhận diện giọng nói';
      toast.error(errorMsg);
      setResult({
        score: 0,
        transcript: '',
        feedback: 'Không thể phân tích, vui lòng thử lại.',
        targetText: selectedOption.text,
        question: currentSentence.question
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => setResult(null);

  const handleNext = async () => {
    if (!result || result.score < passThreshold) {
      toast.error(`Bạn cần đạt tối thiểu ${passThreshold}% để qua câu này.`);
      return;
    }

    if (currentIndex + 1 < sentences.length) {
      setCurrentIndex((index) => index + 1);
      setSelectedOptionIndex(0);
      setResult(null);
      return;
    }

    setLoading(true);
    if (isPersonalized) {
      toast.success('Bạn đã hoàn thành bài luyện nói AI.');
      setShowCompletion(true);
      setLoading(false);
      return;
    }

    speakingApi.saveProgress({ lessonId: id, completed: true })
      .then((res) => {
        setExpReward(res.data?.expReward || null);
        toast.success('Bạn đã hoàn thành chủ đề Speaking.');
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
    const completionTitle = isPersonalized ? 'Hoàn thành bài luyện nói AI' : 'Hoàn thành chủ đề Speaking';

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

          {!isPersonalized && <ExpReward reward={expReward} />}

          <div className="speaking-summary-grid">
            {sentences.map((sentence, index) => {
              const attempt = attempts[sentence.id || index];
              return (
                <div key={sentence.id || index} className="speaking-summary-item">
                  <span>Câu {index + 1}</span>
                  <strong>{attempt ? `${attempt.score}%` : 'Chưa có điểm'}</strong>
                  <p>{sentence.question}</p>
                </div>
              );
            })}
          </div>

          <div className="receptive-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/speaking/options')}>
              <FiArrowLeft /> Thoát
            </button>
            {isPersonalized && (
              <button type="button" className="btn btn-primary" onClick={() => navigate('/speaking/ai')}>
                <FiCpu /> Tạo bài nói khác
              </button>
            )}
            {!isPersonalized && (
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/speaking/lessons')}>
                Về danh sách
              </button>
            )}
            {!isPersonalized && nextLesson && (
              <button type="button" className="btn btn-primary" onClick={() => navigate(`/speaking/lessons/${nextLesson.id}`)}>
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

  return (
    <div className="receptive-page receptive-practice-page fade-in" style={{ '--receptive-accent': '#2563eb' }}>
      <div className="productive-topbar">
        <button type="button" className="btn btn-ghost btn-sm receptive-back-btn" onClick={() => navigate(isPersonalized ? '/speaking/options' : '/speaking/lessons')}>
          <FiArrowLeft /> Thoát
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowSettings(true)}>
          <FiSettings /> Cài đặt
        </button>
      </div>

      <ProgressBar current={currentIndex + 1} total={sentences.length} compact />

      <section className="practice-compact-header">
        <div>
          <span className="receptive-eyebrow">{isPersonalized ? 'AI speaking' : 'Speaking practice'}</span>
          <h1>{lessonData?.title || 'Luyện nói'}</h1>
          <p>Chọn câu mẫu, ghi âm và xem phản hồi ngay trong cùng một màn hình.</p>
        </div>
        <div className="practice-compact-meta">
          <span><FiMic /> {answeredCount}/{sentences.length} đã thử</span>
          <strong>Pass {passThreshold}%</strong>
        </div>
      </section>

      <div className="productive-compact-layout">
        <section className="receptive-panel speaking-question-panel">
          <div className="compact-panel-title">
            <h2>Câu hỏi</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => playTTS(currentSentence.question)}>
              <FiVolume2 /> Nghe
            </button>
          </div>

          <div className="speaking-question-box">
            <h3>{currentSentence.question}</h3>
            {currentSentence.translation && <p>{currentSentence.translation}</p>}
          </div>

          <div className="speaking-option-list is-compact">
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
        </section>

        <section className="receptive-panel speaking-practice-card">
          <div className="compact-panel-title">
            <h2>Ghi âm</h2>
            <span>{recordDuration}s tối đa</span>
          </div>

          {!result ? (
            <Recorder
              onRecordingComplete={handleRecordingComplete}
              isAnalyzing={isAnalyzing}
              maxDuration={recordDuration}
            />
          ) : (
            <motion.div className="speaking-feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`speaking-score ${isPassed ? 'is-pass' : 'is-fail'}`}>
                {isPassed ? <FiCheckCircle /> : <FiXCircle />}
                <strong>{result.score}%</strong>
                <span>{isPassed ? 'Đạt yêu cầu' : 'Cần luyện lại'}</span>
              </div>

              <div className="speaking-feedback-grid">
                <div>
                  <span>Hệ thống nghe được</span>
                  <p>{result.transcript || '...'}</p>
                </div>
                <div>
                  <span>Câu mục tiêu</span>
                  <p>{result.targetText}</p>
                </div>
              </div>

              {result.feedback && <p className="speaking-feedback-note">{result.feedback}</p>}

              {(result.missingWords?.length > 0 || result.extraWords?.length > 0) && (
                <div className="speaking-word-feedback">
                  {result.missingWords?.map((word) => <span key={`missing-${word}`}>Thiếu: {word}</span>)}
                  {result.extraWords?.map((word) => <span key={`extra-${word}`}>Thừa: {word}</span>)}
                </div>
              )}

              <div className="receptive-actions">
                {!isPassed && (
                  <button type="button" className="btn btn-secondary" onClick={handleRetry}>
                    <FiRefreshCw /> Thử lại
                  </button>
                )}
                {isPassed && (
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Tiếp tục <FiArrowRight />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </section>
      </div>

      {showSettings && (
        <div className="productive-modal-backdrop">
          <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="productive-modal">
            <div className="productive-modal-head">
              <h3>Cài đặt phần nói</h3>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowSettings(false)}>
                <FiX />
              </button>
            </div>

            <div className="productive-setting">
              <span>Yêu cầu độ chính xác ({passThreshold}%)</span>
              <input aria-label="Trường nhập"
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
              <select aria-label="Lựa chọn" value={selectedVoiceURI} onChange={(event) => setSelectedVoiceURI(event.target.value)}>
                {voices.length === 0 && <option value="">Đang tải giọng đọc...</option>}
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>
                ))}
              </select>
            </div>

            <button type="button" className="btn btn-primary w-full" onClick={handleSaveSettings}>
              Lưu cài đặt
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SpeakingLesson;
