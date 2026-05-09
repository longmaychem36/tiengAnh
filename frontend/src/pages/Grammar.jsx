// ============================================
// Grammar Page — Category Listing + Topic Viewer + Quiz
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiCheck, FiX, FiArrowLeft, FiBookOpen, FiAward } from 'react-icons/fi';
import { grammarApi } from '../api/grammarApi';
import Loading from '../components/common/Loading';

function Grammar() {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    grammarApi.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadTopics = async (categoryId) => {
    setActiveCategoryId(categoryId);
    setActiveTopic(null);
    setQuizStarted(false);
    try {
      const res = await grammarApi.getTopicsByCategory(categoryId);
      setTopics(res.data || []);
    } catch { setTopics([]); }
  };

  const loadTopic = async (topicId) => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQ(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    try {
      const res = await grammarApi.getTopicDetail(topicId);
      setActiveTopic(res.data);
    } catch { setActiveTopic(null); }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQ(0);
    setQuizScore(0);
    setSelectedAnswer(null);
  };

  const handleQuizAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    const quiz = activeTopic.quizzes[currentQ];
    if (answer === quiz.CorrectAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQ + 1 >= activeTopic.quizzes.length) {
      setQuizFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const goBack = () => {
    if (quizStarted) {
      setQuizStarted(false);
      setQuizFinished(false);
    } else if (activeTopic) {
      setActiveTopic(null);
    } else if (activeCategoryId) {
      setActiveCategoryId(null);
      setTopics([]);
    }
  };

  if (loading) return <Loading />;

  // ========== QUIZ MODE ==========
  if (quizStarted && activeTopic?.quizzes?.length > 0) {
    if (quizFinished) {
      const total = activeTopic.quizzes.length;
      const pct = Math.round((quizScore / total) * 100);
      return (
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ padding: 'var(--space-12)' }}>
            <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              {pct >= 80 ? 'Xuất sắc!' : pct >= 50 ? 'Tốt lắm!' : 'Cố gắng thêm!'}
            </h2>
            <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, color: 'var(--color-primary)', margin: 'var(--space-4) 0' }}>
              {quizScore}/{total} ({pct}%)
            </div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
              {activeTopic.TitleVI}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => { setQuizStarted(false); setQuizFinished(false); }}>
                <FiBookOpen /> Xem lại lý thuyết
              </button>
              <button className="btn btn-primary" onClick={startQuiz}>Làm lại</button>
            </div>
          </motion.div>
        </div>
      );
    }

    const quiz = activeTopic.quizzes[currentQ];
    const options = [
      { key: 'A', text: quiz.OptionA },
      { key: 'B', text: quiz.OptionB },
      { key: 'C', text: quiz.OptionC },
      { key: 'D', text: quiz.OptionD },
    ];

    return (
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>
        <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>📝 {activeTopic.TitleVI} — Quiz</span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Câu {currentQ + 1}/{activeTopic.quizzes.length}
          </span>
        </div>
        <div className="progress-bar" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / activeTopic.quizzes.length) * 100}%` }} />
        </div>

        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
            {quiz.Question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {options.map(opt => {
              let bg = 'var(--color-bg)';
              let border = 'var(--color-border)';
              let color = 'var(--color-text)';
              if (selectedAnswer) {
                if (opt.key === quiz.CorrectAnswer) {
                  bg = 'rgba(16,185,129,0.1)'; border = 'var(--color-success)'; color = 'var(--color-success)';
                } else if (opt.key === selectedAnswer && opt.key !== quiz.CorrectAnswer) {
                  bg = 'rgba(239,68,68,0.1)'; border = 'var(--color-error)'; color = 'var(--color-error)';
                }
              }
              return (
                <button key={opt.key} onClick={() => handleQuizAnswer(opt.key)} disabled={selectedAnswer !== null}
                  style={{
                    padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${border}`, background: bg, color,
                    textAlign: 'left', cursor: selectedAnswer ? 'default' : 'pointer',
                    fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    transition: 'all 150ms ease'
                  }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: bg === 'var(--color-bg)' ? 'var(--color-bg-secondary)' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 700, flexShrink: 0 }}>
                    {opt.key}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: selectedAnswer === quiz.CorrectAnswer ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selectedAnswer === quiz.CorrectAnswer ? 'var(--color-success)' : 'var(--color-error)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {selectedAnswer === quiz.CorrectAnswer
                  ? <><FiCheck style={{ color: 'var(--color-success)' }} /> <b style={{ color: 'var(--color-success)' }}>Đúng rồi!</b></>
                  : <><FiX style={{ color: 'var(--color-error)' }} /> <b style={{ color: 'var(--color-error)' }}>Sai rồi!</b></>}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                💡 {quiz.Explanation}
              </p>
              <div style={{ textAlign: 'right', marginTop: 'var(--space-3)' }}>
                <button className="btn btn-primary btn-sm" onClick={nextQuizQuestion}>
                  {currentQ + 1 >= activeTopic.quizzes.length ? 'Xem kết quả' : 'Câu tiếp'} <FiChevronRight />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // ========== TOPIC DETAIL ==========
  if (activeTopic) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                {activeTopic.CategoryNameVI}
              </span>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)', margin: '4px 0' }}>
                {activeTopic.Title}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{activeTopic.TitleVI}</p>
            </div>
            {activeTopic.quizzes?.length > 0 && (
              <button className="btn btn-primary" onClick={startQuiz} style={{ whiteSpace: 'nowrap' }}>
                <FiAward /> Làm bài test ({activeTopic.quizzes.length} câu)
              </button>
            )}
          </div>

          <div
            className="grammar-content"
            dangerouslySetInnerHTML={{ __html: activeTopic.Content }}
            style={{ lineHeight: 1.8, fontSize: 'var(--font-size-base)' }}
          />
        </div>
      </div>
    );
  }

  // ========== TOPICS LIST ==========
  if (activeCategoryId && topics.length > 0) {
    const cat = categories.find(c => c.Id === activeCategoryId);
    return (
      <div>
        <button className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>
        <div className="page-header">
          <h1>{cat?.Icon} {cat?.NameVI || cat?.Name}</h1>
          <p>{topics.length} chủ đề ngữ pháp</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {topics.map((topic, i) => (
            <motion.div key={topic.Id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="card" onClick={() => loadTopic(topic.Id)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{topic.Title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{topic.TitleVI}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {topic.QuizCount > 0 && <span className="badge badge-primary">{topic.QuizCount} câu hỏi</span>}
                  <FiChevronRight style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ========== CATEGORIES ==========
  return (
    <div>
      <div className="page-header">
        <h1>📖 Ngữ Pháp Tiếng Anh</h1>
        <p>Học ngữ pháp từ cơ bản đến nâng cao kèm bài test</p>
      </div>

      <div className="grid grid-3">
        {categories.map((cat, i) => (
          <motion.div key={cat.Id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="card" onClick={() => loadTopics(cat.Id)} style={{ cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div style={{ fontSize: 40, marginBottom: 'var(--space-3)' }}>{cat.Icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', marginBottom: 4 }}>{cat.Name}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>{cat.NameVI}</p>
              <span className="badge badge-secondary">{cat.TopicCount} chủ đề</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Grammar;
