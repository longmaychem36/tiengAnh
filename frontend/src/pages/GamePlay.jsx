// ============================================
// GamePlay - Mixed game engine
// ============================================
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiCheck, FiClock, FiRefreshCw,
  FiPlay, FiStar, FiVolume2, FiX, FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';

const TYPE_LABELS = {
  matching: { icon: '🔗', label: 'Nối từ', color: '#8a4b35' },
  listening: { icon: '🎧', label: 'Nghe & Chọn', color: '#8a4b35' },
  listenbuild: { icon: '🎵', label: 'Nghe xếp câu', color: '#8a4b35' },
  truefalse: { icon: '✅', label: 'Đúng hay Sai', color: '#8a4b35' }
};

function GamePlay() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const answersRef = useRef([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);

  const [wordBank, setWordBank] = useState([]);
  const [builtWords, setBuiltWords] = useState([]);
  const [buildChecked, setBuildChecked] = useState(false);
  const [buildCorrect, setBuildCorrect] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    gameApi.getQuestions(levelId)
      .then(res => {
        setLevelData(res.data);
        setTimeLeft(res.data.level.TimeLimit);
      })
      .catch(() => toast.error('Không thể tải dữ liệu game'))
      .finally(() => setLoading(false));
  }, [levelId]);

  useEffect(() => {
    if (gameStarted && !gameFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            clearInterval(timerRef.current);
            doSubmit();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameFinished]);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  const shuffle = (items) => {
    const list = [...items];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  const playTTS = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setAudioPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const initQuestion = (idx) => {
    if (!levelData) return;
    const question = levelData.questions[idx];
    if (!question) return;

    setShowFeedback(false);
    setLastCorrect(null);
    setBuildChecked(false);
    setBuildCorrect(null);
    setBuiltWords([]);

    if (question.QuestionType === 'matching') {
      const matchingQuestions = levelData.questions.filter(item => item.QuestionType === 'matching');
      const otherOptions = matchingQuestions
        .filter(item => item.Id !== question.Id)
        .slice(0, 3)
        .map(item => item.ContentVI);
      setWordBank(shuffle([question.ContentVI, ...otherOptions]));
    }

    if (question.QuestionType === 'listenbuild') {
      setWordBank(shuffle([...(question.Options || question.ContentEN.split(' '))]));
      setTimeout(() => playTTS(question.ContentEN), 500);
    }

    if (question.QuestionType === 'listening') {
      setTimeout(() => playTTS(question.ContentEN || question.CorrectAnswer), 500);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    startTimeRef.current = Date.now();
    initQuestion(0);
  };

  const recordAnswer = (questionId, answer) => {
    const updated = [
      ...answersRef.current.filter(item => item.questionId !== questionId),
      { questionId, answer }
    ];
    setAnswers(updated);
    answersRef.current = updated;
  };

  const doSubmit = async () => {
    if (gameFinished) return;
    clearInterval(timerRef.current);
    setGameFinished(true);

    const duration = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    try {
      const res = await gameApi.submit({ levelId, answers: answersRef.current, duration });
      setResult(res.data);
    } catch {
      toast.error('Lỗi gửi kết quả');
    }
  };

  const handleNext = () => {
    const nextIdx = currentQ + 1;
    if (nextIdx >= levelData.questions.length) {
      doSubmit();
      return;
    }
    setCurrentQ(nextIdx);
    initQuestion(nextIdx);
  };

  const handleMatchAnswer = (answer) => {
    if (showFeedback) return;
    const question = levelData.questions[currentQ];
    const correct = answer === question.ContentVI;
    recordAnswer(question.Id, answer);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  const handleListenAnswer = (answer) => {
    if (showFeedback) return;
    const question = levelData.questions[currentQ];
    const correct = answer.toLowerCase().trim() === question.CorrectAnswer.toLowerCase().trim();
    recordAnswer(question.Id, answer);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  const handleTrueFalse = (value) => {
    if (showFeedback) return;
    const question = levelData.questions[currentQ];
    const correct = value === question.CorrectAnswer;
    recordAnswer(question.Id, value);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  const addWord = (word, idx) => {
    setBuiltWords(prev => [...prev, word]);
    setWordBank(prev => prev.filter((_, i) => i !== idx));
  };

  const removeWord = (idx) => {
    const word = builtWords[idx];
    setBuiltWords(prev => prev.filter((_, i) => i !== idx));
    setWordBank(prev => [...prev, word]);
  };

  const checkBuild = () => {
    const question = levelData.questions[currentQ];
    const answer = builtWords.join(' ');
    const normalize = text => text.toLowerCase().replace(/[.,!?]/g, '').trim();
    const correct = normalize(answer) === normalize(question.CorrectAnswer);
    recordAnswer(question.Id, answer);
    setBuildCorrect(correct);
    setBuildChecked(true);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  if (loading) return <Loading />;
  if (!levelData) return <div className="game-empty">Không tìm thấy level</div>;

  const { level, questions } = levelData;

  if (gameFinished && result) {
    return (
      <div className="game-play-shell">
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="game-result-card"
        >
          <div className="game-result-icon">{result.score >= 90 ? '🏆' : result.score >= 70 ? '⭐' : result.score >= 50 ? '👍' : '💪'}</div>
          <span className="game-kicker">Kết quả level</span>
          <h1>{result.passed ? 'Xuất sắc!' : 'Cố gắng thêm nhé!'}</h1>

          <div className="game-result-score">{result.score}%</div>
          <div className="game-result-stars">
            {[1, 2, 3].map(star => (
              <motion.span
                key={star}
                initial={{ scale: 0, rotate: -120 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + star * 0.12 }}
              >
                <FiStar className={star <= result.stars ? 'is-lit' : ''} />
              </motion.span>
            ))}
          </div>

          <div className="game-result-stats">
            <span><FiCheck /> {result.correctCount}/{result.totalQuestions}</span>
            <span><FiClock /> {result.duration}s</span>
            <span><FiZap /> +{result.expEarned} EXP</span>
          </div>

          <div className="game-result-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/games')}><FiArrowLeft /> Quay lại</button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}><FiRefreshCw /> Chơi lại</button>
          </div>
        </motion.section>
      </div>
    );
  }

  if (!gameStarted) {
    const typeCounts = {};
    questions.forEach(question => {
      typeCounts[question.QuestionType] = (typeCounts[question.QuestionType] || 0) + 1;
    });

    return (
      <div className="game-play-shell">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-start-card"
        >
          <div className="game-start-icon">🎮</div>
          <span className="game-kicker">Sẵn sàng vào màn</span>
          <h1>{level.Name}</h1>

          <div className="game-type-pills">
            {Object.entries(typeCounts).map(([type, count]) => (
              <span key={type}>
                {TYPE_LABELS[type]?.icon} {TYPE_LABELS[type]?.label} ({count})
              </span>
            ))}
          </div>

          <div className="game-start-stats">
            <span><FiClock /> {level.TimeLimit}s</span>
            <span><FiZap /> {questions.length} câu</span>
            <span><FiStar /> Đạt {level.PassScore}%</span>
          </div>

          <button className="btn btn-primary btn-lg" onClick={startGame}>
            <FiPlay /> Bắt đầu chơi
          </button>
        </motion.section>
      </div>
    );
  }

  const question = questions[currentQ];
  const type = TYPE_LABELS[question.QuestionType] || TYPE_LABELS.matching;
  const timerPct = (timeLeft / level.TimeLimit) * 100;
  const timerColor = timerPct > 50 ? '#8a5a2b' : timerPct > 20 ? '#c8851e' : '#c94a55';
  const progressPct = ((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100;

  const selectedAnswer = answers.find(item => item.questionId === question.Id)?.answer;

  const TimerBar = () => (
    <div className="game-hud-card">
      <div className="game-hud-label">
        <span style={{ '--type-color': type.color }}>{type.icon}</span>
        <strong>{type.label}</strong>
      </div>
      <div className="game-hud-timer">
        <FiClock style={{ color: timerColor }} />
        <div className="game-time-track">
          <motion.div
            style={{ background: timerColor }}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
        <strong style={{ color: timerColor }}>{timeLeft}s</strong>
      </div>
      <div className="game-progress-label">Câu {currentQ + 1}/{questions.length}</div>
    </div>
  );

  const ProgressBar = () => (
    <div className="game-question-progress">
      <span style={{ width: `${progressPct}%` }} />
    </div>
  );

  const FeedbackBtn = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`game-feedback ${lastCorrect ? 'is-correct' : 'is-wrong'}`}
    >
      <div>
        {lastCorrect ? <FiCheck /> : <FiX />}
        <strong>{lastCorrect ? 'Đúng rồi!' : `Sai! Đáp án: ${question.CorrectAnswer}`}</strong>
      </div>
      <button className="btn btn-primary btn-sm" onClick={handleNext}>
        {currentQ + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp →'}
      </button>
    </motion.div>
  );

  const AnswerButton = ({ children, correct, wrong, disabled, onClick }) => (
    <button
      type="button"
      className={`game-answer-btn ${correct ? 'is-correct' : ''} ${wrong ? 'is-wrong' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="game-play-shell">
      <TimerBar />
      <ProgressBar />

      <motion.section
        key={currentQ}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        className="game-question-card"
        style={{ '--type-color': type.color }}
      >
        {question.QuestionType === 'matching' && (
          <>
            <p className="game-question-prompt">Chọn nghĩa tiếng Việt đúng cho từ:</p>
            <h1 className="game-question-word">{question.ContentEN}</h1>
            <div className="game-answer-grid">
              {wordBank.map((option, idx) => (
                <AnswerButton
                  key={idx}
                  disabled={showFeedback}
                  correct={showFeedback && option === question.ContentVI}
                  wrong={showFeedback && option !== question.ContentVI && selectedAnswer === option}
                  onClick={() => handleMatchAnswer(option)}
                >
                  {option}
                </AnswerButton>
              ))}
            </div>
          </>
        )}

        {question.QuestionType === 'listening' && (
          <>
            <p className="game-question-prompt">Nghe và chọn đáp án đúng</p>
            <button
              type="button"
              className={`game-sound-button ${audioPlaying ? 'is-playing' : ''}`}
              onClick={() => playTTS(question.ContentEN || question.CorrectAnswer)}
              disabled={audioPlaying}
            >
              <FiVolume2 />
            </button>
            <div className="game-answer-grid">
              {question.Options?.map((option, idx) => (
                <AnswerButton
                  key={idx}
                  disabled={showFeedback}
                  correct={showFeedback && option === question.CorrectAnswer}
                  wrong={showFeedback && option !== question.CorrectAnswer && selectedAnswer === option}
                  onClick={() => handleListenAnswer(option)}
                >
                  {option}
                </AnswerButton>
              ))}
            </div>
          </>
        )}

        {question.QuestionType === 'listenbuild' && (
          <>
            <p className="game-question-prompt">Nghe và xếp các từ thành câu hoàn chỉnh</p>
            {question.ContentVI && <p className="game-question-hint">({question.ContentVI})</p>}
            <button
              type="button"
              className={`game-sound-button is-small ${audioPlaying ? 'is-playing' : ''}`}
              onClick={() => playTTS(question.ContentEN)}
              disabled={audioPlaying || buildChecked}
            >
              <FiVolume2 />
            </button>

            <div className={`game-sentence-board ${buildChecked ? (buildCorrect ? 'is-correct' : 'is-wrong') : ''}`}>
              {builtWords.length === 0 && <span>Nhấn vào các từ để xếp câu...</span>}
              {builtWords.map((word, idx) => (
                <motion.button
                  key={`${word}-${idx}`}
                  type="button"
                  initial={{ scale: 0.88 }}
                  animate={{ scale: 1 }}
                  onClick={() => !buildChecked && removeWord(idx)}
                >
                  {word}
                </motion.button>
              ))}
            </div>

            {!buildChecked && (
              <div className="game-word-bank">
                {wordBank.map((word, idx) => (
                  <motion.button
                    key={`${word}-${idx}`}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => addWord(word, idx)}
                  >
                    {word}
                  </motion.button>
                ))}
              </div>
            )}

            {!buildChecked && builtWords.length > 0 && wordBank.length === 0 && (
              <button className="btn btn-primary" onClick={checkBuild}>Kiểm tra câu</button>
            )}
          </>
        )}

        {question.QuestionType === 'truefalse' && (
          <>
            <p className="game-question-prompt">Bản dịch này có chính xác không?</p>
            <div className="game-translation-card">
              <strong>{question.ContentEN}</strong>
              <span>= "{question.ContentVI}"</span>
            </div>
            <div className="game-truefalse-grid">
              {[
                { value: 'true', label: 'Đúng', icon: <FiCheck /> },
                { value: 'false', label: 'Sai', icon: <FiX /> }
              ].map(option => (
                <AnswerButton
                  key={option.value}
                  disabled={showFeedback}
                  correct={showFeedback && option.value === question.CorrectAnswer}
                  wrong={showFeedback && option.value !== question.CorrectAnswer && selectedAnswer === option.value}
                  onClick={() => handleTrueFalse(option.value)}
                >
                  {option.icon} {option.label}
                </AnswerButton>
              ))}
            </div>
          </>
        )}

        {!['matching', 'listening', 'listenbuild', 'truefalse'].includes(question.QuestionType) && (
          <div className="game-empty">Loại game "{question?.QuestionType}" chưa được hỗ trợ.</div>
        )}

        {showFeedback && <FeedbackBtn />}
      </motion.section>
    </div>
  );
}

export default GamePlay;
