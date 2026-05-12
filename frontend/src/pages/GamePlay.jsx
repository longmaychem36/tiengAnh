// GamePlay — Mixed Game Engine (matching, listening, listenbuild, truefalse)
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiStar, FiVolume2, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';

const TYPE_LABELS = {
  matching: { icon: '🔗', label: 'Noi tu' },
  listening: { icon: '🎧', label: 'Nghe & Chon' },
  listenbuild: { icon: '🎵', label: 'Nghe xep cau' },
  truefalse: { icon: '✅', label: 'Dung hay Sai' },
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

  // Sequential question state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const answersRef = useRef([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);

  // Matching state
  const [matchCards, setMatchCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const matchedRef = useRef([]);

  // Listenbuild state
  const [wordBank, setWordBank] = useState([]);
  const [builtWords, setBuiltWords] = useState([]);
  const [buildChecked, setBuildChecked] = useState(false);
  const [buildCorrect, setBuildCorrect] = useState(null);

  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    gameApi.getQuestions(levelId)
      .then(res => { setLevelData(res.data); setTimeLeft(res.data.level.TimeLimit); })
      .catch(() => toast.error('Khong the tai du lieu game'))
      .finally(() => setLoading(false));
  }, [levelId]);

  useEffect(() => {
    if (gameStarted && !gameFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); doSubmit(); return 0; } return t - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameFinished]);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { matchedRef.current = matchedPairs; }, [matchedPairs]);

  const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const playTTS = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setAudioPlaying(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.onend = () => setAudioPlaying(false);
    u.onerror = () => setAudioPlaying(false);
    window.speechSynthesis.speak(u);
  };

  const startGame = () => {
    setGameStarted(true);
    startTimeRef.current = Date.now();
    initQuestion(0);
  };

  const initQuestion = (idx) => {
    if (!levelData) return;
    const q = levelData.questions[idx];
    if (!q) return;
    setShowFeedback(false);
    setLastCorrect(null);
    setBuildChecked(false);
    setBuildCorrect(null);
    setBuiltWords([]);
    setSelectedCards([]);

    if (q.QuestionType === 'matching') {
      // For matching, all match questions are shown together at set start
      // but here we treat them per-question style: show EN, pick VI from options
      // Generate fake options from nearby questions
      const qs = levelData.questions.filter(x => x.QuestionType === 'matching');
      const others = qs.filter(x => x.Id !== q.Id).slice(0, 3).map(x => x.ContentVI);
      const opts = shuffle([q.ContentVI, ...others]);
      setWordBank(opts);
    } else if (q.QuestionType === 'listenbuild') {
      const words = shuffle([...(q.Options || q.ContentEN.split(' '))]);
      setWordBank(words);
      setTimeout(() => playTTS(q.ContentEN), 600);
    } else if (q.QuestionType === 'listening') {
      setTimeout(() => playTTS(q.ContentEN || q.CorrectAnswer), 600);
    }
  };

  const recordAnswer = (questionId, answer) => {
    const updated = [...answersRef.current.filter(a => a.questionId !== questionId), { questionId, answer }];
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
    } catch { toast.error('Loi gui ket qua'); }
  };

  const handleNext = () => {
    const nextIdx = currentQ + 1;
    if (nextIdx >= levelData.questions.length) {
      doSubmit();
    } else {
      setCurrentQ(nextIdx);
      initQuestion(nextIdx);
    }
  };

  // ===== MATCHING: click VI answer =====
  const handleMatchAnswer = (answer) => {
    if (showFeedback) return;
    const q = levelData.questions[currentQ];
    const correct = answer === q.ContentVI;
    recordAnswer(q.Id, answer);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  // ===== LISTENING: click option =====
  const handleListenAnswer = (answer) => {
    if (showFeedback) return;
    const q = levelData.questions[currentQ];
    const correct = answer.toLowerCase().trim() === q.CorrectAnswer.toLowerCase().trim();
    recordAnswer(q.Id, answer);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  // ===== TRUEFALSE =====
  const handleTrueFalse = (val) => {
    if (showFeedback) return;
    const q = levelData.questions[currentQ];
    const correct = val === q.CorrectAnswer;
    recordAnswer(q.Id, val);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  // ===== LISTENBUILD =====
  const addWord = (word, idx) => {
    setBuiltWords(p => [...p, word]);
    setWordBank(p => p.filter((_, i) => i !== idx));
  };
  const removeWord = (idx) => {
    const word = builtWords[idx];
    setBuiltWords(p => p.filter((_, i) => i !== idx));
    setWordBank(p => [...p, word]);
  };
  const checkBuild = () => {
    const q = levelData.questions[currentQ];
    const answer = builtWords.join(' ');
    const correct = answer.toLowerCase().replace(/[.,!?]/g, '') === q.CorrectAnswer.toLowerCase().replace(/[.,!?]/g, '');
    recordAnswer(q.Id, answer);
    setBuildCorrect(correct);
    setBuildChecked(true);
    setLastCorrect(correct);
    setShowFeedback(true);
  };

  if (loading) return <Loading />;
  if (!levelData) return <div style={{ textAlign: 'center', padding: 40 }}>Khong tim thay level</div>;
  const { level, questions } = levelData;

  // RESULT SCREEN
  if (gameFinished && result) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ padding: 'var(--space-12)' }}>
          <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>{result.score >= 90 ? '🏆' : result.score >= 70 ? '⭐' : result.score >= 50 ? '👍' : '💪'}</div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{result.passed ? 'Xuat sac!' : 'Co gang them nhe!'}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: 'var(--space-4) 0' }}>
            {[1,2,3].map(s => <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + s * 0.2 }}><FiStar size={40} style={{ color: s <= result.stars ? '#f59e0b' : '#e2e8f0', fill: s <= result.stars ? '#f59e0b' : 'none' }} /></motion.div>)}
          </div>
          <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, color: 'var(--color-primary)' }}>{result.score}%</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 'var(--space-4) 0' }}>
            ✅ {result.correctCount}/{result.totalQuestions} &nbsp; ⏱️ {result.duration}s &nbsp; ✨ +{result.expEarned} EXP
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-6)' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/games')}><FiArrowLeft /> Quay lai</button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}><FiRefreshCw /> Choi lai</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // START SCREEN
  if (!gameStarted) {
    const typeCounts = {};
    questions.forEach(q => { typeCounts[q.QuestionType] = (typeCounts[q.QuestionType] || 0) + 1; });
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card" style={{ padding: 'var(--space-12)' }}>
          <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>🎮</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>{level.Name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            {Object.entries(typeCounts).map(([type, count]) => (
              <span key={type} style={{ background: 'var(--color-bg-secondary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                {TYPE_LABELS[type]?.icon} {TYPE_LABELS[type]?.label} ({count})
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-8)' }}>
            <span>⏱️ {level.TimeLimit}s</span><span>📝 {questions.length} cau</span><span>🎯 Dat {level.PassScore}%</span>
          </div>
          <button className="btn btn-primary" onClick={startGame} style={{ fontSize: 'var(--font-size-lg)', padding: '14px 40px' }}>Bat dau choi</button>
        </motion.div>
      </div>
    );
  }

  // PLAYING
  const q = questions[currentQ];
  const timerPct = (timeLeft / level.TimeLimit) * 100;
  const timerColor = timerPct > 50 ? '#10b981' : timerPct > 20 ? '#f59e0b' : '#ef4444';
  const progressPct = ((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100;

  const TimerBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <FiClock style={{ color: timerColor }} />
      <div style={{ flex: 1, height: 8, background: 'var(--color-bg-secondary)', borderRadius: 99, overflow: 'hidden' }}>
        <motion.div style={{ height: '100%', background: timerColor, borderRadius: 99 }} animate={{ width: `${timerPct}%` }} transition={{ duration: 0.3 }} />
      </div>
      <span style={{ fontWeight: 700, color: timerColor, minWidth: 40 }}>{timeLeft}s</span>
    </div>
  );

  const ProgressBar = () => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{TYPE_LABELS[q.QuestionType]?.icon} {TYPE_LABELS[q.QuestionType]?.label}</span>
        <span>Cau {currentQ + 1}/{questions.length}</span>
      </div>
      <div style={{ height: 6, background: 'var(--color-bg-secondary)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 99, width: `${progressPct}%`, transition: 'width 0.3s' }} />
      </div>
    </div>
  );

  const FeedbackBtn = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginTop: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: lastCorrect ? '#10b981' : '#ef4444', marginBottom: 12 }}>
        {lastCorrect ? '✅ Dung roi!' : `❌ Sai! Dap an: ${q.CorrectAnswer}`}
      </div>
      <button className="btn btn-primary btn-sm" onClick={handleNext}>
        {currentQ + 1 >= questions.length ? 'Xem ket qua' : 'Cau tiep →'}
      </button>
    </motion.div>
  );

  // ===== MATCHING ENGINE =====
  if (q.QuestionType === 'matching') {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <TimerBar /><ProgressBar />
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 8, fontSize: 'var(--font-size-sm)' }}>Chon nghia tieng Viet dung cho tu:</p>
          <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-6)' }}>{q.ContentEN}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {wordBank.map((opt, idx) => {
              let bg = 'white', border = 'var(--color-border)', color = 'var(--color-text)';
              if (showFeedback) {
                if (opt === q.ContentVI) { bg = 'rgba(16,185,129,0.1)'; border = '#10b981'; color = '#059669'; }
                else if (opt !== q.ContentVI && answers.find(a => a.questionId === q.Id)?.answer === opt) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; }
              }
              return <button key={idx} onClick={() => handleMatchAnswer(opt)} disabled={showFeedback} style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: `2px solid ${border}`, background: bg, color, fontWeight: 600, cursor: showFeedback ? 'default' : 'pointer', transition: 'all 0.15s' }}>{opt}</button>;
            })}
          </div>
          {showFeedback && <FeedbackBtn />}
        </motion.div>
      </div>
    );
  }

  // ===== LISTENING ENGINE =====
  if (q.QuestionType === 'listening') {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <TimerBar /><ProgressBar />
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 12, fontSize: 'var(--font-size-sm)' }}>Nghe va chon dap an dung</p>
          <button onClick={() => playTTS(q.ContentEN || q.CorrectAnswer)} disabled={audioPlaying} style={{ width: 80, height: 80, borderRadius: '50%', background: audioPlaying ? '#9ca3af' : 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
            <FiVolume2 size={32} />
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {q.Options?.map((opt, idx) => {
              let bg = 'white', border = 'var(--color-border)', color = 'var(--color-text)';
              if (showFeedback) {
                if (opt === q.CorrectAnswer) { bg = 'rgba(16,185,129,0.1)'; border = '#10b981'; color = '#059669'; }
                else if (opt !== q.CorrectAnswer && answers.find(a => a.questionId === q.Id)?.answer === opt) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; }
              }
              return <button key={idx} onClick={() => handleListenAnswer(opt)} disabled={showFeedback} style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: `2px solid ${border}`, background: bg, color, fontWeight: 600, cursor: showFeedback ? 'default' : 'pointer', transition: 'all 0.15s' }}>{opt}</button>;
            })}
          </div>
          {showFeedback && <FeedbackBtn />}
        </motion.div>
      </div>
    );
  }

  // ===== LISTENBUILD ENGINE =====
  if (q.QuestionType === 'listenbuild') {
    return (
      <div style={{ maxWidth: 650, margin: '0 auto' }}>
        <TimerBar /><ProgressBar />
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 8, fontSize: 'var(--font-size-sm)' }}>Nghe va xep cac tu thanh cau hoan chinh</p>
          {q.ContentVI && <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: 12 }}>({q.ContentVI})</p>}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <button onClick={() => playTTS(q.ContentEN)} disabled={audioPlaying || buildChecked} style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              <FiVolume2 size={24} />
            </button>
          </div>
          {/* Built sentence area */}
          <div style={{ minHeight: 52, padding: 12, marginBottom: 12, border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: builtWords.length ? 'white' : 'var(--color-bg-secondary)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: builtWords.length ? 'flex-start' : 'center' }}>
            {builtWords.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Nhan vao cac tu de xep cau...</span>}
            {builtWords.map((w, i) => (
              <motion.button key={`b${i}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={() => !buildChecked && removeWord(i)}
                style={{ padding: '6px 14px', borderRadius: 'var(--radius-lg)', background: buildChecked ? (buildCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)') : 'var(--color-primary)', color: buildChecked ? (buildCorrect ? '#059669' : '#ef4444') : 'white', border: 'none', fontWeight: 600, cursor: buildChecked ? 'default' : 'pointer' }}>{w}</motion.button>
            ))}
          </div>
          {/* Word bank */}
          {!buildChecked && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
              {wordBank.map((w, i) => (
                <motion.button key={`wk${i}`} whileTap={{ scale: 0.9 }} onClick={() => addWord(w, i)}
                  style={{ padding: '6px 14px', borderRadius: 'var(--radius-lg)', background: 'white', border: '2px solid var(--color-border)', fontWeight: 600, cursor: 'pointer' }}>{w}</motion.button>
              ))}
            </div>
          )}
          {!buildChecked && builtWords.length > 0 && wordBank.length === 0 && (
            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-primary" onClick={checkBuild}>Kiem tra cau</button>
            </div>
          )}
          {buildChecked && <FeedbackBtn />}
        </motion.div>
      </div>
    );
  }

  // ===== TRUEFALSE ENGINE =====
  if (q.QuestionType === 'truefalse') {
    const userAns = answers.find(a => a.questionId === q.Id)?.answer;
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <TimerBar /><ProgressBar />
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 12, fontSize: 'var(--font-size-sm)' }}>Ban dich nay co chinh xac khong?</p>
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 8 }}>{q.ContentEN}</div>
            <div style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>= "{q.ContentVI}"</div>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            {[{ val: 'true', label: '✅ Dung', color: '#10b981' }, { val: 'false', label: '❌ Sai', color: '#ef4444' }].map(({ val, label, color }) => {
              let bg = 'white', border = 'var(--color-border)', textColor = 'var(--color-text)';
              if (showFeedback) {
                if (val === q.CorrectAnswer) { bg = 'rgba(16,185,129,0.1)'; border = '#10b981'; textColor = '#059669'; }
                else if (val === userAns) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; textColor = '#ef4444'; }
              } else if (!showFeedback) {
                // hover hint
              }
              return (
                <button key={val} onClick={() => handleTrueFalse(val)} disabled={showFeedback}
                  style={{ flex: 1, maxWidth: 160, padding: '20px 0', borderRadius: 'var(--radius-xl)', border: `3px solid ${border}`, background: bg, color: textColor, fontSize: 'var(--font-size-xl)', fontWeight: 800, cursor: showFeedback ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                  {label}
                </button>
              );
            })}
          </div>
          {showFeedback && <FeedbackBtn />}
        </motion.div>
      </div>
    );
  }

  return <div style={{ textAlign: 'center', padding: 40 }}>Loai game "{q?.QuestionType}" chua duoc ho tro.</div>;
}

export default GamePlay;
