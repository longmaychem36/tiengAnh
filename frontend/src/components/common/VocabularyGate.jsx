import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiRefreshCw,
  FiTarget,
  FiVolume2,
  FiXCircle
} from 'react-icons/fi';

import { hasSpeechSupport, speakText, stopAllPlayback } from '../../utils/audioControl';

const normalize = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[.,!?;:]/g, '')
  .replace(/\s+/g, ' ');

const dedupeVocabulary = (items = []) => {
  const seen = new Set();

  return items
    .map((item) => ({
      word: String(item.word || item.term || '').trim(),
      meaning: String(item.meaning || item.definition || item.translation || '').trim(),
      example: String(item.example || '').trim()
    }))
    .filter((item) => item.word && item.meaning)
    .filter((item) => {
      const key = `${normalize(item.word)}:${normalize(item.meaning)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const VocabularyGate = ({ items, title, skillLabel, gateKey, onPassed, onExit }) => {
  const vocabulary = useMemo(() => dedupeVocabulary(items), [items]);
  const [phase, setPhase] = useState('study');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const correctCount = vocabulary.filter((item, index) => normalize(answers[index]) === normalize(item.word)).length;
  const score = vocabulary.length ? Math.round((correctCount / vocabulary.length) * 100) : 100;
  const isComplete = vocabulary.every((_, index) => String(answers[index] || '').trim());
  const isPassed = submitted && score === 100;

  const playSound = (name) => {
    window.dispatchEvent(new CustomEvent('lingo:sound', { detail: { name } }));
  };

  const speakWord = (item) => {
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt chưa hỗ trợ đọc audio.');
      return;
    }

    stopAllPlayback();
    speakText(item.word, { lang: 'en-US', rate: 0.92 });
    playSound('tap');
  };

  const startTest = () => {
    setPhase('test');
    setSubmitted(false);
    setAnswers({});
    playSound('confirm');
  };

  const handleSubmit = () => {
    if (!isComplete) {
      toast.error('Bạn cần gõ lại tất cả từ trước khi kiểm tra.');
      playSound('error');
      return;
    }

    setSubmitted(true);
    playSound(score === 100 ? 'success' : 'error');
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    playSound('tap');
  };

  const handleBackToStudy = () => {
    setPhase('study');
    setAnswers({});
    setSubmitted(false);
    playSound('tap');
  };

  const handleContinue = () => {
    if (gateKey) localStorage.setItem(gateKey, 'passed');
    playSound('confirm');
    onPassed?.();
  };

  return (
    <div className="vocab-gate-page fade-in">
      <button type="button" className="btn btn-ghost btn-sm vocab-gate-back" onClick={onExit}>
        <FiArrowLeft /> Quay lại
      </button>

      <section className="vocab-gate-hero">
        <div>
          <span className="receptive-eyebrow">{skillLabel} · {phase === 'study' ? 'học từ' : 'kiểm tra'}</span>
          <h1>{phase === 'study' ? 'Học từ vựng trước khi vào bài' : 'Gõ lại từ đã học'}</h1>
          <p>{title}</p>
        </div>
        <div className="vocab-gate-score">
          <FiTarget />
          <strong>Pass 100%</strong>
          <span>{phase === 'study' ? `${vocabulary.length} từ cần học` : `${correctCount}/${vocabulary.length} từ đúng`}</span>
        </div>
      </section>

      {phase === 'study' ? (
        <section className="vocab-study-panel vocab-study-panel-wide">
          <div className="compact-panel-title">
            <h2>Từ cần học</h2>
            <span>Nghe và đọc nghĩa trước khi kiểm tra</span>
          </div>

          <div className="vocab-card-list vocab-study-grid">
            {vocabulary.map((item, index) => (
              <motion.article
                key={`${item.word}-${item.meaning}`}
                className="vocab-study-card is-large"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
              >
                <FiBookOpen />
                <div>
                  <strong>{item.word}</strong>
                  <span>{item.meaning}</span>
                  {item.example && <p>{item.example}</p>}
                </div>
                <button type="button" className="vocab-audio-btn" onClick={() => speakWord(item)} aria-label={`Nghe ${item.word}`}>
                  <FiVolume2 />
                </button>
              </motion.article>
            ))}
          </div>

          <div className="vocab-gate-actions">
            <button type="button" className="btn btn-primary" onClick={startTest}>
              Bắt đầu kiểm tra <FiArrowRight />
            </button>
          </div>
        </section>
      ) : (
        <section className="vocab-quiz-panel vocab-typing-panel">
          <div className="compact-panel-title">
            <h2>Gõ lại từ tiếng Anh</h2>
            {submitted && <span className={score === 100 ? 'is-pass' : 'is-fail'}>{score}%</span>}
          </div>

          <div className="vocab-question-list vocab-typing-list">
            {vocabulary.map((item, index) => {
              const checked = submitted;
              const isCorrect = normalize(answers[index]) === normalize(item.word);

              return (
                <article key={`${item.word}-${index}`} className={`vocab-question-card ${checked ? (isCorrect ? 'is-correct' : 'is-wrong') : ''}`}>
                  <div className="vocab-question-top">
                    <span>Từ {index + 1}</span>
                    {checked && (isCorrect ? <FiCheckCircle /> : <FiXCircle />)}
                  </div>
                  <h3>{item.meaning}</h3>
                  <input
                    className="vocab-type-input"
                    value={answers[index] || ''}
                    disabled={submitted}
                    placeholder="Gõ từ tiếng Anh..."
                    autoComplete="off"
                    onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))}
                  />
                  {checked && !isCorrect && (
                    <p className="vocab-correct-answer">Đáp án: <strong>{item.word}</strong></p>
                  )}
                </article>
              );
            })}
          </div>

          <div className="vocab-gate-actions">
            <button type="button" className="btn btn-secondary" onClick={handleBackToStudy}>
              <FiArrowLeft /> Xem lại từ
            </button>
            {!submitted && (
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Kiểm tra
              </button>
            )}
            {submitted && !isPassed && (
              <>
                <div className="vocab-gate-message is-fail">
                  Cần đúng 100% để mở bài học chính thức.
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleRetry}>
                  <FiRefreshCw /> Gõ lại
                </button>
              </>
            )}
            {isPassed && (
              <>
                <div className="vocab-gate-message is-pass">
                  Đã mở khóa bài học.
                </div>
                <button type="button" className="btn btn-primary" onClick={handleContinue}>
                  Vào làm bài <FiArrowRight />
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default VocabularyGate;
