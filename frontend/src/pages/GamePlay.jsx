// ============================================
// GamePlay - Mixed game engine
// ============================================
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiCheck, FiClock, FiRefreshCw,
  FiArrowRight, FiAward, FiCheckSquare, FiHeadphones,
  FiLink, FiMusic, FiPlay, FiStar, FiVolume2, FiX, FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';
import ExpReward from '../components/common/ExpReward';
import CharacterSvg from '../components/common/CharacterSvg';
import Recorder from '../components/speaking/Recorder';
import { speakText, stopAllPlayback } from '../utils/audioControl';
import { confirmUnsavedProgressExit } from '../utils/confirmExit';

const TYPE_LABELS = {
  matching: { Icon: FiLink, label: 'Nối từ', color: '#2563eb' },
  listening: { Icon: FiHeadphones, label: 'Nghe và chọn', color: '#0f766e' },
  listenbuild: { Icon: FiMusic, label: 'Nghe xếp câu', color: '#7c3aed' },
  truefalse: { Icon: FiCheckSquare, label: 'Đúng hay sai', color: '#dc2626' },
  speakrepeat: { Icon: FiVolume2, label: 'Đọc câu', color: '#2563eb' }
};

const getSpeakingTarget = (question) => question?.CorrectAnswer || question?.ContentEN || '';
const getSpeakingPassScore = (question) => Number(question?.Options?.passScore || 70);
const getSpeakingMaxDuration = (question) => {
  const wordCount = getSpeakingTarget(question).trim().split(/\s+/).filter(Boolean).length;
  return Math.min(18, Math.max(8, Math.ceil(wordCount * 1.35)));
};

function TimerBar({ type, timerColor, timerPct, timeLeft, currentQ, totalQuestions, onExit }) {
  return (
    <div className="game-hud-card" style={{ '--type-color': type.color }}>
      <button type="button" className="game-exit-button" onClick={onExit} aria-label="Thoát">
        <FiX />
      </button>
      <div className="game-hud-timer">
        <div className="game-time-track">
          <motion.div
            className="game-time-fill"
            style={{ background: timerColor }}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>
      <div className="game-progress-label">
        <FiClock />
        <strong>{timeLeft}s</strong>
        <span>{currentQ + 1}/{totalQuestions}</span>
      </div>
    </div>
  );
}

function GameProgressBar({ progressPct }) {
  return (
    <div className="game-question-progress">
      <span style={{ width: `${progressPct}%` }} />
    </div>
  );
}

function FeedbackBtn({ lastCorrect, question, isLastQuestion, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`game-feedback ${lastCorrect ? 'is-correct' : 'is-wrong'}`}
    >
      <div>
        {lastCorrect ? <FiCheck /> : <FiX />}
        <strong>{lastCorrect ? 'Đúng rồi!' : `Sai! Đáp án: ${question.CorrectAnswer}`}</strong>
      </div>
      <button type="button" className="btn btn-primary btn-sm" onClick={onNext}>
        {isLastQuestion ? 'Xem kết quả' : 'Câu tiếp →'}
      </button>
    </motion.div>
  );
}

function AnswerButton({ children, correct, wrong, disabled, onClick }) {
  return (
    <button
      type="button"
      className={`game-answer-btn ${correct ? 'is-correct' : ''} ${wrong ? 'is-wrong' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function GamePlay() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [nextLevel, setNextLevel] = useState(null);
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
  const [analyzingQuestionId, setAnalyzingQuestionId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setGameStarted(false);
    setGameFinished(false);
    setResult(null);
    setNextLevel(null);
    setCurrentQ(0);
    setAnswers([]);
    answersRef.current = [];

    gameApi.getQuestions(levelId)
      .then(async (res) => {
        if (cancelled) return;
        setLevelData(res.data);
        setTimeLeft(res.data.level.TimeLimit);

        try {
          const levelsRes = await gameApi.getLevels();
          if (cancelled) return;
          const levels = levelsRes.data || [];
          const currentLevelIndex = levels.findIndex(level => String(level.Id) === String(levelId));
          setNextLevel(currentLevelIndex >= 0 ? levels[currentLevelIndex + 1] || null : null);
        } catch {
          setNextLevel(null);
        }
      })
      .catch(() => toast.error('Không thể tải dữ liệu game'))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stopAllPlayback();
    };
  }, [levelId]);

  useEffect(() => {
    if (!gameStarted || gameFinished) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      return undefined;
    }

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          doSubmit();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameFinished]);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    const resetAudioState = () => {
      if (document.hidden) setAudioPlaying(false);
    };

    document.addEventListener('visibilitychange', resetAudioState);
    return () => document.removeEventListener('visibilitychange', resetAudioState);
  }, []);

  const shuffle = (items) => {
    const list = [...items];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  };

  const playTTS = (text) => {
    setAudioPlaying(true);
    const utterance = speakText(text, {
      lang: 'en-US',
      onend: () => setAudioPlaying(false),
      onerror: () => setAudioPlaying(false)
    });
    if (!utterance) setAudioPlaying(false);
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
    setAnalyzingQuestionId(null);

    if (question.QuestionType === 'matching') {
      const matchingQuestions = levelData.questions.filter(item => item.QuestionType === 'matching');
      const otherOptions = matchingQuestions
        .filter(item => item.Id !== question.Id)
        .slice(0, 3)
        .map(item => item.ContentVI);
      const configuredOptions = Array.isArray(question.Options) ? question.Options : [];
      const seen = new Set();
      const options = [];

      const appendUniqueOption = (option) => {
        const value = String(option || '').trim();
        const key = value.toLocaleLowerCase('vi');
        if (!value || seen.has(key)) return;
        seen.add(key);
        options.push(value);
      };

      // Respect the exact choices configured in Admin. Legacy questions without
      // Options are supplemented from other matching questions in this level.
      [question.ContentVI, ...configuredOptions].forEach(appendUniqueOption);
      otherOptions.forEach((option) => {
        if (options.length < 4) appendUniqueOption(option);
      });

      setWordBank(shuffle(options.slice(0, 4)));
    }

    if (question.QuestionType === 'listenbuild') {
      setWordBank(shuffle([...(question.Options || question.ContentEN.split(' '))]));
      setTimeout(() => playTTS(question.ContentEN), 500);
    }

    if (question.QuestionType === 'listening') {
      setTimeout(() => playTTS(question.ContentEN || question.CorrectAnswer), 500);
    }

    if (question.QuestionType === 'speakrepeat') {
      setTimeout(() => playTTS(getSpeakingTarget(question)), 500);
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
      const questionIds = levelData?.questions?.map(question => question.Id) || [];
      const res = await gameApi.submit({ levelId, answers: answersRef.current, questionIds, duration });
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

  const handleSpeakingComplete = async (question, audioBlob) => {
    const targetText = getSpeakingTarget(question);
    if (!targetText) {
      toast.error('Câu đọc này chưa có nội dung mẫu.');
      return;
    }

    setAnalyzingQuestionId(question.Id);
    try {
      const res = await gameApi.transcribeAndAnalyze(audioBlob, [targetText], {
        questionId: question.Id,
        targetText,
        prompt: 'Read this sentence aloud',
        passThreshold: getSpeakingPassScore(question)
      });
      const data = res.data || {};
      const score = Number(data.score || 0);
      const answer = {
        kind: 'speaking',
        score,
        transcript: data.transcript || '',
        targetText,
        feedback: data.feedback || '',
        missingWords: data.missingWords || [],
        extraWords: data.extraWords || []
      };

      recordAnswer(question.Id, answer);
      setLastCorrect(score >= getSpeakingPassScore(question));
      setShowFeedback(true);

      if (!data.transcript) {
        toast.error('Không nhận diện được giọng nói. Bạn có thể thử lại ở màn sau.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Không thể chấm phần đọc.');
    } finally {
      setAnalyzingQuestionId(null);
    }
  };

  const skipSpeakingQuestion = (question) => {
    recordAnswer(question.Id, {
      kind: 'speaking',
      score: 0,
      transcript: '',
      targetText: getSpeakingTarget(question)
    });
    setLastCorrect(false);
    setShowFeedback(true);
  };

  const handleExitGame = async () => {
    if (!(await confirmUnsavedProgressExit())) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
    stopAllPlayback();
    navigate('/games');
  };

  if (loading) return <Loading />;
  if (!levelData) return <div className="game-empty">Không tìm thấy màn chơi</div>;

  const { level, questions } = levelData;

  if (gameFinished && result) {
    return (
      <div className="game-play-shell">
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="game-result-card"
        >
          <div className="game-result-icon"><FiAward /></div>
          <span className="game-kicker">Kết quả màn chơi</span>
          <h1>{result.passed ? 'Xuất sắc!' : 'Cố gắng thêm nhé!'}</h1>

          <div className="game-result-score">{result.score}%</div>
          <div className="game-result-stars">
            {[1, 2, 3].map(star => (
              <motion.span
                key={star}
                initial={{ scale: 0.95, opacity: 0, rotate: -120 }}
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

          <ExpReward reward={result.expReward} fallbackExp={result.expEarned} />

          <div className="game-result-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/games')}><FiArrowLeft /> Quay lại</button>
            {result.passed && nextLevel && (
              <button type="button" className="btn btn-primary" onClick={() => navigate(`/games/play/${nextLevel.Id}`)}>
                Màn tiếp theo <FiArrowRight />
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}><FiRefreshCw /> Chơi lại</button>
          </div>
        </motion.section>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="game-play-shell">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-start-card"
        >
          <button type="button" className="game-start-exit" onClick={() => navigate('/games')} aria-label="Thoát">
            <FiX />
          </button>
          <div className="game-start-icon"><FiPlay /></div>
          <span className="game-kicker">Sẵn sàng vào màn</span>
          <h1>{level.Name}</h1>

          <div className="game-start-stats">
            <span><FiClock /> {level.TimeLimit}s</span>
            <span><FiZap /> {questions.length} câu</span>
            <span><FiStar /> Đạt {level.PassScore}%</span>
          </div>

          <button type="button" className="btn btn-primary btn-lg" onClick={startGame}>
            <FiPlay /> Bắt đầu chơi
          </button>
        </motion.section>
      </div>
    );
  }

  const question = questions[currentQ];
  const type = TYPE_LABELS[question.QuestionType] || TYPE_LABELS.matching;
  const timerLimit = Math.max(1, Number(level.TimeLimit) || 1);
  const timerPct = Math.max(0, Math.min(100, (Number(timeLeft) / timerLimit) * 100));
  const timerColor = timerPct > 50 ? '#8a5a2b' : timerPct > 20 ? '#c8851e' : '#c94a55';
  const progressPct = ((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100;

  const selectedAnswer = answers.find(item => item.questionId === question.Id)?.answer;


  return (
    <div className="game-play-shell">
      <TimerBar
        type={type}
        timerColor={timerColor}
        timerPct={timerPct}
        timeLeft={timeLeft}
        currentQ={currentQ}
        totalQuestions={questions.length}
        onExit={handleExitGame}
      />
      <GameProgressBar progressPct={progressPct} />

      <motion.section
        key={currentQ}
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        className="game-question-card"
        style={{ '--type-color': type.color }}
      >
        <CharacterSvg className={`is-${question.QuestionType}`} width={96} aria-hidden="true" focusable="false" />
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
              <button type="button" className="btn btn-primary" onClick={checkBuild}>Kiểm tra câu</button>
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

        {question.QuestionType === 'speakrepeat' && (
          <div className="game-speaking-card">
            <p className="game-question-prompt">Đọc câu này</p>
            <div className="game-speak-target">
              <button
                type="button"
                className="game-speak-audio"
                onClick={() => playTTS(getSpeakingTarget(question))}
                disabled={audioPlaying || showFeedback}
              >
                <FiVolume2 />
              </button>
              <strong>{getSpeakingTarget(question)}</strong>
            </div>

            {!showFeedback && (
              <>
                <Recorder
                  onRecordingComplete={(audioBlob) => handleSpeakingComplete(question, audioBlob)}
                  isAnalyzing={analyzingQuestionId === question.Id}
                  maxDuration={getSpeakingMaxDuration(question)}
                />
                <button
                  type="button"
                  className="game-skip-speaking"
                  onClick={() => skipSpeakingQuestion(question)}
                  disabled={analyzingQuestionId === question.Id}
                >
                  Tạm thời không nói được
                </button>
              </>
            )}

            {showFeedback && selectedAnswer && typeof selectedAnswer === 'object' && (
              <div className={`game-speaking-result ${Number(selectedAnswer.score || 0) >= getSpeakingPassScore(question) ? 'is-pass' : 'is-fail'}`}>
                <strong>{Number(selectedAnswer.score || 0)}%</strong>
                <span>{selectedAnswer.transcript ? `Bạn đọc: ${selectedAnswer.transcript}` : 'Chưa có bản ghi đọc.'}</span>
              </div>
            )}
          </div>
        )}

        {!['matching', 'listening', 'listenbuild', 'truefalse', 'speakrepeat'].includes(question.QuestionType) && (
          <div className="game-empty">Loại game "{question?.QuestionType}" chưa được hỗ trợ.</div>
        )}

        {showFeedback && (
          <FeedbackBtn
            lastCorrect={lastCorrect}
            question={question}
            isLastQuestion={currentQ + 1 >= questions.length}
            onNext={handleNext}
          />
        )}
      </motion.section>
    </div>
  );
}

export default GamePlay;
