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
import { confirmUnsavedProgressExit } from '../../utils/confirmExit';

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

const VocabularyGate = ({
  items,
  title,
  skillLabel,
  gateKey,
  onPassed,
  onExit,
  confirmOnExit = false,
  allowStudy = true,
  passMessage = 'Đã mở khóa bài học.',
  continueLabel = 'Vào làm bài',
  oneByOne = false
}) => {
  const vocabulary = useMemo(() => dedupeVocabulary(items), [items]);
  const [phase, setPhase] = useState(allowStudy ? 'study' : 'test');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // oneByOne specific states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

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
    setCurrentIndex(0);
    setIsAnswerChecked(false);
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

  const handleCheckOneByOne = () => {
    const currentAnswer = String(answers[currentIndex] || '').trim();
    if (!currentAnswer) {
      toast.error('Vui lòng nhập từ tiếng Anh.');
      playSound('error');
      return;
    }

    setIsAnswerChecked(true);
    const item = vocabulary[currentIndex];
    const isCorrect = normalize(currentAnswer) === normalize(item.word);

    // Auto-speak word on check
    speakText(item.word, { lang: 'en-US', rate: 0.92 });
    playSound(isCorrect ? 'success' : 'error');
  };

  const handleNextOneByOne = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerChecked(false);
    } else {
      setSubmitted(true);
      const finalCorrectCount = vocabulary.filter((item, idx) => normalize(answers[idx]) === normalize(item.word)).length;
      const finalScore = vocabulary.length ? Math.round((finalCorrectCount / vocabulary.length) * 100) : 100;
      playSound(finalScore === 100 ? 'success' : 'error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isAnswerChecked) {
        handleCheckOneByOne();
      } else {
        handleNextOneByOne();
      }
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
    setIsAnswerChecked(false);
    playSound('tap');
  };

  const handleBackToStudy = () => {
    if (!allowStudy) return;
    setPhase('study');
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
    setIsAnswerChecked(false);
    playSound('tap');
  };

  const handleContinue = () => {
    if (gateKey) localStorage.setItem(gateKey, 'passed');
    playSound('confirm');
    onPassed?.();
  };

  const handleExit = async () => {
    if (confirmOnExit && !(await confirmUnsavedProgressExit())) return;
    onExit?.();
  };

  return (
    <div className="vocab-gate-page fade-in">
      <button type="button" className="btn btn-ghost btn-sm vocab-gate-back" onClick={handleExit}>
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
      ) : oneByOne ? (
        submitted ? (
          <section className="vocab-quiz-panel vocab-results-panel">
            <div className="vocab-results-summary">
              <div className={`vocab-results-score-circle ${score === 100 ? 'is-pass' : 'is-fail'}`}>
                <FiTarget />
                <h2>{score}%</h2>
                <span>Đúng {correctCount}/{vocabulary.length} từ</span>
              </div>
              
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginTop: 'var(--space-4)' }}>
                {score === 100 
                  ? 'Tuyệt vời! Bạn đã thuộc tất cả các từ!' 
                  : 'Hãy ôn lại các từ chưa chính xác nhé!'}
              </h3>
            </div>

            {score < 100 && (
              <div className="vocab-incorrect-list-container">
                <h4 style={{ fontWeight: 800, marginBottom: 'var(--space-2)' }}>Các từ cần ôn lại:</h4>
                <div className="vocab-incorrect-list">
                  {vocabulary.map((item, index) => {
                    const isCorrect = normalize(answers[index]) === normalize(item.word);
                    if (isCorrect) return null;
                    return (
                      <article key={`${item.word}-${index}`} className="vocab-incorrect-card">
                        <div className="vocab-incorrect-info">
                          <span className="meaning">{item.meaning}</span>
                          <span className="arrow">→</span>
                          <strong className="word">{item.word}</strong>
                        </div>
                        <span className="user-answer">Bạn đã gõ: "{answers[index] || '(trống)'}"</span>
                        <button type="button" className="btn btn-icon btn-ghost btn-sm speak-incorrect-btn" onClick={() => speakWord(item)} style={{ color: 'var(--color-primary)' }} aria-label={`Nghe ${item.word}`}>
                          <FiVolume2 />
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="vocab-gate-actions">
              {score < 100 ? (
                <button type="button" className="btn btn-secondary" onClick={handleRetry}>
                  <FiRefreshCw /> Thử lại
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleContinue}>
                  {continueLabel} <FiArrowRight />
                </button>
              )}
            </div>
          </section>
        ) : (
          <section className="vocab-quiz-panel vocab-typing-panel one-by-one-layout">
            <div className="vocab-progress-container">
              <div 
                className="vocab-progress-bar" 
                style={{ width: `${(currentIndex / vocabulary.length) * 100}%` }}
              />
            </div>

            <div className="vocab-flashcard-wrapper">
              <div className="vocab-flashcard-header">
                <span>Học phần: {title}</span>
                <span>Từ {currentIndex + 1} / {vocabulary.length}</span>
              </div>

              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="vocab-flashcard-body"
              >
                <div className="vocab-flashcard-meaning-box">
                  <span className="vocab-flashcard-label">Nghĩa tiếng Việt</span>
                  <h2 className="vocab-flashcard-meaning">{vocabulary[currentIndex]?.meaning}</h2>
                  {isAnswerChecked && vocabulary[currentIndex]?.example && (
                    <p className="vocab-flashcard-example">"{vocabulary[currentIndex]?.example}"</p>
                  )}
                </div>

                <div className="vocab-flashcard-input-box">
                  <input
                    type="text"
                    className="vocab-type-input centered-input"
                    value={answers[currentIndex] || ''}
                    disabled={isAnswerChecked}
                    placeholder="Gõ từ tiếng Anh..."
                    autoComplete="off"
                    autoFocus
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setAnswers((current) => ({ ...current, [currentIndex]: e.target.value }))}
                  />
                </div>
              </motion.div>
            </div>

            <div className={`vocab-feedback-bar ${isAnswerChecked ? (normalize(answers[currentIndex]) === normalize(vocabulary[currentIndex]?.word) ? 'is-correct' : 'is-wrong') : ''}`}>
              {!isAnswerChecked ? (
                <div className="vocab-feedback-actions-only">
                  <button type="button" className="btn btn-primary" onClick={handleCheckOneByOne}>
                    Kiểm tra
                  </button>
                </div>
              ) : (
                <div className="vocab-feedback-content">
                  <div className="vocab-feedback-status-group">
                    <button type="button" className="vocab-audio-btn-small" onClick={() => speakWord(vocabulary[currentIndex])} aria-label={`Nghe ${vocabulary[currentIndex]?.word}`}>
                      <FiVolume2 />
                    </button>
                    <div className="vocab-feedback-text">
                      {normalize(answers[currentIndex]) === normalize(vocabulary[currentIndex]?.word) ? (
                        <span className="feedback-title correct"><FiCheckCircle /> Chính xác!</span>
                      ) : (
                        <>
                          <span className="feedback-title wrong"><FiXCircle /> Chưa đúng</span>
                          <p className="feedback-answer">Đáp án đúng: <strong>{vocabulary[currentIndex]?.word}</strong></p>
                        </>
                      )}
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleNextOneByOne}>
                    Tiếp tục <FiArrowRight />
                  </button>
                </div>
              )}
            </div>
          </section>
        )
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
            {allowStudy && (
              <button type="button" className="btn btn-secondary" onClick={handleBackToStudy}>
                <FiArrowLeft /> Xem lại từ
              </button>
            )}
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
                  {passMessage}
                </div>
                <button type="button" className="btn btn-primary" onClick={handleContinue}>
                  {continueLabel} <FiArrowRight />
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
