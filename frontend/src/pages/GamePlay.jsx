// ============================================
// GamePlay Page — Game Engines: Matching, Listening, Sentence
// ============================================
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiStar, FiVolume2, FiCheck, FiX, FiRefreshCw, FiMic } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { gameApi } from '../api/gameApi';
import Loading from '../components/common/Loading';

function GamePlay() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [result, setResult] = useState(null);

  // Matching
  const [matchCards, setMatchCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const matchedPairsRef = useRef([]);

  // Listening
  const [currentQ, setCurrentQ] = useState(0);
  const [listenAnswers, setListenAnswers] = useState([]);
  const listenAnswersRef = useRef([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Sentence Builder
  const [sentenceWords, setSentenceWords] = useState([]);
  const [builtSentence, setBuiltSentence] = useState([]);
  const [sentenceAnswers, setSentenceAnswers] = useState([]);
  const sentenceAnswersRef = useRef([]);
  const [sentenceFeedback, setSentenceFeedback] = useState(null);

  // Speaking
  const [speakAnswers, setSpeakAnswers] = useState([]);
  const speakAnswersRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [lastAudioUrl, setLastAudioUrl] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => { matchedPairsRef.current = matchedPairs; }, [matchedPairs]);
  useEffect(() => { listenAnswersRef.current = listenAnswers; }, [listenAnswers]);
  useEffect(() => { sentenceAnswersRef.current = sentenceAnswers; }, [sentenceAnswers]);
  useEffect(() => { speakAnswersRef.current = speakAnswers; }, [speakAnswers]);

  useEffect(() => {
    gameApi.getQuestions(levelId)
      .then(res => { setLevelData(res.data); setTimeLeft(res.data.level.TimeLimit); })
      .catch(() => toast.error('Không thể tải dữ liệu game'))
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

  const startGame = () => {
    setGameStarted(true);
    startTimeRef.current = Date.now();
    const gt = levelData.level.GameType;
    if (gt === 'matching') initMatching();
    if (gt === 'sentence') initSentence(0);
    // Speaking setup uses MediaRecorder on demand now
  };

  // ========== UNIFIED SUBMIT ==========
  const doSubmit = async () => {
    if (gameFinished) return;
    clearInterval(timerRef.current);
    setGameFinished(true);
    const duration = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    const gt = levelData.level.GameType;
    let answers = [];

    if (gt === 'matching') {
      answers = levelData.questions.map((q, idx) => ({
        questionId: q.Id, answer: matchedPairsRef.current.includes(idx) ? q.CorrectAnswer : '__wrong__'
      }));
    } else if (gt === 'listening') {
      answers = [...listenAnswersRef.current];
      levelData.questions.forEach(q => { if (!answers.find(a => a.questionId === q.Id)) answers.push({ questionId: q.Id, answer: '__skip__' }); });
    } else if (gt === 'sentence') {
      answers = [...sentenceAnswersRef.current];
      levelData.questions.forEach(q => { if (!answers.find(a => a.questionId === q.Id)) answers.push({ questionId: q.Id, answer: '__skip__' }); });
    } else if (gt === 'speaking') {
      answers = [...speakAnswersRef.current];
      levelData.questions.forEach(q => { if (!answers.find(a => a.questionId === q.Id)) answers.push({ questionId: q.Id, answer: '__skip__' }); });
    }

    try {
      const res = await gameApi.submit({ levelId, answers, duration });
      setResult(res.data);
    } catch (err) { console.error(err); toast.error('Lỗi gửi kết quả'); }
  };

  // ========== MATCHING ==========
  const initMatching = () => {
    const qs = levelData.questions;
    const en = qs.map((q, i) => ({ id: `en-${i}`, text: q.ContentEN, pairId: i, type: 'en' }));
    const vi = qs.map((q, i) => ({ id: `vi-${i}`, text: q.ContentVI, pairId: i, type: 'vi' }));
    shuffle(en); shuffle(vi);
    setMatchCards([...en, ...vi]); setMatchedPairs([]); matchedPairsRef.current = []; setSelectedCards([]);
  };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } };
  const handleCardClick = card => {
    if (matchedPairsRef.current.includes(card.pairId) || selectedCards.length >= 2 || selectedCards.find(c => c.id === card.id)) return;
    const ns = [...selectedCards, card]; setSelectedCards(ns);
    if (ns.length === 2) {
      const [a, b] = ns;
      if (a.pairId === b.pairId && a.type !== b.type) {
        const nm = [...matchedPairsRef.current, a.pairId];
        setTimeout(() => { setMatchedPairs(nm); matchedPairsRef.current = nm; setSelectedCards([]); if (nm.length === levelData.questions.length) setTimeout(doSubmit, 500); }, 400);
      } else { setTimeout(() => setSelectedCards([]), 600); }
    }
  };

  // ========== LISTENING ==========
  const [audioPlaying, setAudioPlaying] = useState(false);
  const playTTS = (text) => {
    if (!window.speechSynthesis) {
        toast.error('❌ Trình duyệt không hỗ trợ phát âm thanh');
        return;
    }
    setAudioPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => {
        setAudioPlaying(false);
        toast.error('❌ Lỗi phát âm thanh tự động');
    };
    window.speechSynthesis.speak(utterance);
  };
  const playAudio = async (url, fallbackText) => { 
    if (!url) { 
      if (fallbackText) return playTTS(fallbackText);
      toast.error('❌ Không có file audio'); 
      return; 
    }
    try {
      setAudioPlaying(true);
      // Use backend proxy to avoid CORS issues
      const proxyUrl = `/api/v1/games/audio/proxy?url=${encodeURIComponent(url)}`;
      const audio = new Audio(proxyUrl);
      audio.crossOrigin = 'anonymous';
      
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => {
        setAudioPlaying(false);
        if (fallbackText) playTTS(fallbackText);
        else toast.error('❌ Lỗi phát audio từ máy chủ');
      };

      await audio.play();
    } catch (err) { 
      console.error('Audio error:', err);
      setAudioPlaying(false);
      if (fallbackText) playTTS(fallbackText);
      else toast.error('❌ Lỗi phát audio: ' + (err.message || 'Unknown error')); 
    }
  };
  const handleListenAnswer = answer => {
    if (showFeedback) return;
    setSelectedAnswer(answer); setShowFeedback(true);
    const q = levelData.questions[currentQ];
    const na = [...listenAnswersRef.current, { questionId: q.Id, answer }];
    setListenAnswers(na); listenAnswersRef.current = na;
  };
  const nextListenQ = () => {
    if (currentQ + 1 >= levelData.questions.length) { doSubmit(); return; }
    setCurrentQ(p => p + 1); setSelectedAnswer(null); setShowFeedback(false);
  };

  // ========== SENTENCE BUILDER ==========
  const initSentence = (qIdx) => {
    const q = levelData.questions[qIdx];
    if (!q || !q.Options) return;
    const words = [...q.Options];
    shuffle(words);
    setSentenceWords(words); setBuiltSentence([]); setSentenceFeedback(null);
  };
  const addWord = (word, idx) => {
    setBuiltSentence(p => [...p, word]);
    setSentenceWords(p => p.filter((_, i) => i !== idx));
  };
  const removeWord = idx => {
    const word = builtSentence[idx];
    setBuiltSentence(p => p.filter((_, i) => i !== idx));
    setSentenceWords(p => [...p, word]);
  };
  const checkSentence = () => {
    const q = levelData.questions[currentQ];
    const userSentence = builtSentence.join(' ');
    const isCorrect = userSentence === q.CorrectAnswer;
    setSentenceFeedback(isCorrect ? 'correct' : 'wrong');
    const na = [...sentenceAnswersRef.current, { questionId: q.Id, answer: userSentence }];
    setSentenceAnswers(na); sentenceAnswersRef.current = na;
  };
  const nextSentenceQ = () => {
    if (currentQ + 1 >= levelData.questions.length) { doSubmit(); return; }
    const next = currentQ + 1;
    setCurrentQ(next); initSentence(next);
  };

  if (loading) return <Loading />;
  if (!levelData) return <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Không tìm thấy level</div>;
  const { level, questions } = levelData;

  // ========== RESULT SCREEN ==========
  if (gameFinished && result) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ padding: 'var(--space-12)' }}>
          <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>{result.score >= 90 ? '🏆' : result.score >= 70 ? '⭐' : result.score >= 50 ? '👍' : '💪'}</div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{result.passed ? 'Xuất sắc!' : 'Cố gắng thêm nhé!'}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: 'var(--space-4) 0' }}>
            {[1, 2, 3].map(s => (
              <motion.div key={s} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + s * 0.2 }}>
                <FiStar size={40} style={{ color: s <= result.stars ? '#f59e0b' : '#e2e8f0', fill: s <= result.stars ? '#f59e0b' : 'none' }} />
              </motion.div>
            ))}
          </div>
          <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-2) 0' }}>{result.score}%</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 'var(--space-4) 0' }}>
            <span>✅ {result.correctCount}/{result.totalQuestions}</span>
            <span>⏱️ {result.duration}s</span>
            <span>✨ +{result.expEarned} EXP</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-6)' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/games')}><FiArrowLeft /> Quay lại</button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}><FiRefreshCw /> Chơi lại</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== START SCREEN ==========
  if (!gameStarted) {
    const icons = { matching: '🔗', listening: '🎧', sentence: '📝' };
    const labels = { matching: 'Nối từ', listening: 'Nghe & Chọn', sentence: 'Xếp câu' };
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card" style={{ padding: 'var(--space-12)' }}>
          <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>{icons[level.GameType] || '🎮'}</div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{level.Name}</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>{labels[level.GameType] || level.GameType}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', margin: 'var(--space-6) 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            <span>⏱️ {level.TimeLimit}s</span><span>📝 {questions.length} câu</span><span>🎯 Đạt {level.PassScore}%</span>
          </div>
          <button className="btn btn-primary" onClick={startGame} style={{ fontSize: 'var(--font-size-lg)', padding: '14px 40px' }}>Bắt đầu chơi</button>
        </motion.div>
      </div>
    );
  }

  // ========== TIMER BAR ==========
  const timerPct = (timeLeft / level.TimeLimit) * 100;
  const timerColor = timerPct > 50 ? '#10b981' : timerPct > 20 ? '#f59e0b' : '#ef4444';
  const TimerBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
      <FiClock style={{ color: timerColor }} />
      <div style={{ flex: 1, height: 8, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <motion.div style={{ height: '100%', background: timerColor, borderRadius: 'var(--radius-full)' }} animate={{ width: `${timerPct}%` }} transition={{ duration: 0.3 }} />
      </div>
      <span style={{ fontWeight: 700, color: timerColor, minWidth: 40, textAlign: 'right' }}>{timeLeft}s</span>
    </div>
  );

  const ProgressInfo = ({ label }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{label}</span>
      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Câu {currentQ + 1}/{questions.length}</span>
    </div>
  );

  const ProgressBar = () => (
    <div style={{ height: 6, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-6)', overflow: 'hidden' }}>
      <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 'var(--radius-full)', width: `${((currentQ + (showFeedback || sentenceFeedback ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
    </div>
  );

  // ===================== MATCHING GAME =====================
  if (level.GameType === 'matching') {
    const en = matchCards.filter(c => c.type === 'en');
    const vi = matchCards.filter(c => c.type === 'vi');
    const CardCol = ({ cards, label, flag, selColor }) => (
      <div>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)', fontWeight: 700, color: selColor }}>{flag} {label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {cards.map(card => {
            const matched = matchedPairs.includes(card.pairId);
            const selected = selectedCards.find(c => c.id === card.id);
            return (
              <motion.button key={card.id} onClick={() => !matched && handleCardClick(card)} whileTap={!matched ? { scale: 0.95 } : {}}
                style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: selected ? `2px solid ${selColor}` : '2px solid var(--color-border)',
                  background: matched ? 'rgba(16,185,129,0.15)' : selected ? `${selColor}15` : 'white', color: matched ? '#059669' : 'var(--color-text)',
                  fontWeight: 600, cursor: matched ? 'default' : 'pointer', opacity: matched ? 0.6 : 1, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
                {matched && <FiCheck size={16} style={{ color: '#059669' }} />}{card.text}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
    return (
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <TimerBar />
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Đã nối: {matchedPairs.length}/{questions.length}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <CardCol cards={en} label="English" flag="🇬🇧" selColor="var(--color-primary)" />
          <CardCol cards={vi} label="Tiếng Việt" flag="🇻🇳" selColor="#e60000" />
        </div>
      </div>
    );
  }

  // ===================== LISTENING GAME =====================
  if (level.GameType === 'listening') {
    const q = questions[currentQ];
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <TimerBar /><ProgressInfo label="🎧 Nghe & Chọn" /><ProgressBar />
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>Nghe và chọn từ đúng</p>
          <button onClick={() => playAudio(q.AudioUrl, q.ContentEN || q.CorrectAnswer)} disabled={audioPlaying} style={{ width: 80, height: 80, borderRadius: '50%', background: audioPlaying ? '#9ca3af' : 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', border: 'none', cursor: audioPlaying ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', opacity: audioPlaying ? 0.7 : 1, transition: 'all 0.3s' }}>
            <FiVolume2 size={32} />
          </button>
          {audioPlaying && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>🔊 Đang phát...</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            {q.Options?.map((opt, idx) => {
              let bg = 'white', border = 'var(--color-border)', color = 'var(--color-text)';
              if (showFeedback) {
                if (opt === q.CorrectAnswer) { bg = 'rgba(16,185,129,0.1)'; border = '#10b981'; color = '#059669'; }
                else if (opt === selectedAnswer) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#ef4444'; }
              }
              return <button key={idx} onClick={() => handleListenAnswer(opt)} disabled={showFeedback} style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: `2px solid ${border}`, background: bg, color, fontWeight: 600, cursor: showFeedback ? 'default' : 'pointer', transition: 'all 0.15s' }}>{opt}</button>;
            })}
          </div>
          {showFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'var(--space-4)' }}>
              {selectedAnswer === q.CorrectAnswer ? <b style={{ color: '#10b981' }}>✅ Đúng rồi!</b> : <b style={{ color: '#ef4444' }}>❌ Sai! Đáp án: {q.CorrectAnswer}</b>}
              <br/><button className="btn btn-primary btn-sm" onClick={nextListenQ} style={{ marginTop: 'var(--space-3)' }}>{currentQ + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp →'}</button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // ===================== SENTENCE BUILDER =====================
  if (level.GameType === 'sentence') {
    const q = questions[currentQ];

    return (
      <div style={{ maxWidth: 650, margin: '0 auto' }}>
        <TimerBar /><ProgressInfo label="📝 Xếp câu" /><ProgressBar />
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 'var(--space-8)' }}>
          {/* Vietnamese hint */}
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>Sắp xếp thành câu tiếng Anh:</p>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-6)', textAlign: 'center' }}>"{q.ContentVI}"</h3>

          {/* Built sentence area */}
          <div style={{
            minHeight: 56, padding: 'var(--space-3)', marginBottom: 'var(--space-4)',
            border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
            background: builtSentence.length ? 'white' : 'var(--color-bg-secondary)',
            display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center',
            justifyContent: builtSentence.length ? 'flex-start' : 'center'
          }}>
            {builtSentence.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Nhấn vào các từ bên dưới để xếp câu...</span>}
            {builtSentence.map((word, i) => (
              <motion.button key={`built-${i}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                onClick={() => !sentenceFeedback && removeWord(i)}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-lg)',
                  background: sentenceFeedback === 'correct' ? 'rgba(16,185,129,0.15)' : sentenceFeedback === 'wrong' ? 'rgba(239,68,68,0.1)' : 'var(--color-primary)',
                  color: sentenceFeedback ? (sentenceFeedback === 'correct' ? '#059669' : '#ef4444') : 'white',
                  border: 'none', fontWeight: 600, cursor: sentenceFeedback ? 'default' : 'pointer',
                  fontSize: 'var(--font-size-base)', transition: 'all 0.15s'
                }}>
                {word}
              </motion.button>
            ))}
          </div>

          {/* Word bank */}
          {!sentenceFeedback && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              {sentenceWords.map((word, i) => (
                <motion.button key={`bank-${i}`} initial={{ scale: 0.9 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => addWord(word, i)}
                  style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-lg)',
                    background: 'white', border: '2px solid var(--color-border)',
                    color: 'var(--color-text)', fontWeight: 600, cursor: 'pointer',
                    fontSize: 'var(--font-size-base)', transition: 'all 0.15s'
                  }}>
                  {word}
                </motion.button>
              ))}
            </div>
          )}

          {/* Check button */}
          {!sentenceFeedback && builtSentence.length > 0 && sentenceWords.length === 0 && (
            <div style={{ textAlign: 'center' }}>
              <button className="btn btn-primary" onClick={checkSentence} style={{ padding: '10px 32px' }}>Kiểm tra câu</button>
            </div>
          )}

          {/* Feedback */}
          {sentenceFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              {sentenceFeedback === 'correct' ? (
                <div style={{ color: '#10b981', fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>✅ Đúng rồi!</div>
              ) : (
                <div>
                  <div style={{ color: '#ef4444', fontWeight: 700 }}>❌ Sai thứ tự!</div>
                  <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}>Đáp án: <b style={{ color: '#10b981' }}>{q.CorrectAnswer}</b></p>
                </div>
              )}
              <button className="btn btn-primary btn-sm" onClick={nextSentenceQ} style={{ marginTop: 'var(--space-3)' }}>
                {currentQ + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp →'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }



  return <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Game type "{level?.GameType}" chưa được hỗ trợ.</div>;
}

export default GamePlay;
