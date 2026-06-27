// ============================================
// Grammar Page — Category Listing + Topic Viewer + Quiz
// ============================================
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiCheck, FiX, FiArrowLeft, FiBookOpen, FiAward, FiLock } from 'react-icons/fi';
import DOMPurify from 'dompurify';
import { grammarApi } from '../api/grammarApi';
import Loading from '../components/common/Loading';
import { confirmUnsavedProgressExit } from '../utils/confirmExit';

const GRAMMAR_HTML_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h2', 'h3', 'h4', 'blockquote'];
const asArray = (value) => (Array.isArray(value) ? value : []);
const asText = (value, fallback = '') => (value == null ? fallback : String(value));
const pickValue = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) return item[key];
  }
  return undefined;
};
const getField = (item, fallback, ...keys) => asText(pickValue(item, ...keys), fallback);
const getData = (res, fallback) => {
  const payload = res?.data ?? res;
  return payload ?? fallback;
};
const getErrorMessage = (err, fallback) => asText(err?.message || err?.error || err?.data?.message, fallback);
const getId = (item) => item?.Id ?? item?.id;
const getCategoryId = (item) => item?.CategoryId ?? item?.Categoryid ?? item?.categoryId ?? item?.category_id ?? item?.categoryid;
const getTopicCount = (category) => Number(category?.TopicCount ?? category?.Topiccount ?? category?.topicCount ?? category?.topic_count ?? category?.topiccount ?? 0);
const getQuizCount = (topic) => Number(topic?.QuizCount ?? topic?.Quizcount ?? topic?.quizCount ?? topic?.quiz_count ?? topic?.quizcount ?? 0);
const getCorrectAnswer = (quiz) => quiz?.CorrectAnswer ?? quiz?.Correctanswer ?? quiz?.correctAnswer ?? quiz?.correct_answer ?? quiz?.correctanswer;
const getQuizOption = (quiz, key) => getField(quiz, '', `Option${key}`, `Option${key.toLowerCase()}`, `option${key}`, `option${key.toLowerCase()}`, `option_${key.toLowerCase()}`);
const isTopicLocked = (topic) => Boolean(topic?.IsLocked ?? topic?.isLocked ?? topic?.islocked);

function getSafeGrammarHtml(html) {
  if (!html) return '<p>Chưa có nội dung ngữ pháp.</p>';
  try {
    return DOMPurify.sanitize(asText(html), {
      ALLOWED_TAGS: GRAMMAR_HTML_TAGS,
      ALLOWED_ATTR: ['colspan', 'rowspan']
    });
  } catch {
    return '<p>Không thể hiển thị nội dung ngữ pháp.</p>';
  }
}

function Grammar() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => {
    const topicId = searchParams.get('topicId');
    grammarApi.getCategories()
      .then(res => setCategories(asArray(getData(res, []))))
      .catch(() => setErrorMessage('Không tải được danh sách ngữ pháp.'))
      .finally(() => setLoading(false));
    if (topicId) loadTopic(topicId);
  }, []);

  const loadTopics = async (categoryId) => {
    setActiveCategoryId(categoryId);
    setActiveTopic(null);
    setQuizStarted(false);
    setErrorMessage('');
    try {
      const res = await grammarApi.getTopicsByCategory(categoryId);
      setTopics(asArray(getData(res, [])));
    } catch (err) {
      setTopics([]);
      setErrorMessage(getErrorMessage(err, 'Không tải được chủ đề ngữ pháp.'));
    }
  };

  const loadTopic = async (topicId) => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQ(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizAnswers([]);
    setErrorMessage('');
    try {
      const res = await grammarApi.getTopicDetail(topicId);
      const topic = getData(res, null);
      setActiveTopic(topic);
      const categoryId = getCategoryId(topic);
      if (categoryId && (!activeCategoryId || asArray(topics).length === 0)) {
        setActiveCategoryId(categoryId);
        const topicsRes = await grammarApi.getTopicsByCategory(categoryId);
        setTopics(asArray(getData(topicsRes, [])));
      }
    } catch (err) {
      setActiveTopic(null);
      setErrorMessage(getErrorMessage(err, 'Không tải được nội dung chủ đề.'));
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQ(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizAnswers([]);
  };

  const handleQuizAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    const quiz = activeTopic?.quizzes?.[currentQ];
    if (!quiz) return;
    const quizId = getId(quiz);
    const nextAnswers = [
      ...quizAnswers.filter((item) => item.quizId !== quizId),
      { quizId, answer }
    ];
    setQuizAnswers(nextAnswers);
    if (answer === getCorrectAnswer(quiz)) {
      setQuizScore(prev => prev + 1);
    }
  };

  const submitQuizAttempt = async (answers) => {
    const topicId = getId(activeTopic);
    if (!topicId || answers.length === 0) return;
    try {
      await grammarApi.submitAttempt({
        topicId,
        answers,
        attemptId: crypto.randomUUID()
      });
      if (activeCategoryId) {
        const res = await grammarApi.getTopicsByCategory(activeCategoryId);
        const nextTopics = asArray(getData(res, []));
        setTopics(nextTopics);
        return nextTopics;
      }
    } catch {
      setErrorMessage('Đã lưu kết quả trên màn hình, nhưng chưa đồng bộ được tiến độ.');
    }
    return null;
  };

  const nextQuizQuestion = async () => {
    const quizList = asArray(activeTopic?.quizzes);
    if (currentQ + 1 >= quizList.length) {
      await submitQuizAttempt(quizAnswers);
      setQuizFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const findNextTopic = () => {
    const topicList = asArray(topics);
    const currentTopicId = String(getId(activeTopic) || '');
    if (!currentTopicId || topicList.length === 0) return null;
    const currentIndex = topicList.findIndex((topic) => String(getId(topic) || '') === currentTopicId);
    if (currentIndex < 0) return null;
    return topicList.slice(currentIndex + 1).find((topic) => getId(topic) && !isTopicLocked(topic)) || null;
  };

  const openNextTopic = () => {
    const nextTopic = findNextTopic();
    const nextTopicId = getId(nextTopic);
    if (!nextTopicId) return;
    loadTopic(nextTopicId);
  };

  const goBack = async () => {
    if (quizStarted) {
      if (!quizFinished && !(await confirmUnsavedProgressExit())) return;
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

  if (errorMessage && !activeTopic && !activeCategoryId) {
    return (
      <div className="card" style={{ maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Không mở được Grammar</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>{errorMessage}</p>
      </div>
    );
  }

  // ========== QUIZ MODE ==========
  if (quizStarted && activeTopic?.quizzes?.length > 0) {
    if (quizFinished) {
      const total = asArray(activeTopic.quizzes).length;
      const pct = Math.round((quizScore / total) * 100);
      const nextTopic = findNextTopic();
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
              {getField(activeTopic, '', 'TitleVI', 'titleVI', 'titlevi', 'title_vi')}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={() => { setQuizStarted(false); setQuizFinished(false); }}>
                <FiBookOpen /> Xem lại lý thuyết
              </button>
              {nextTopic && (
                <button type="button" className="btn btn-primary" onClick={openNextTopic}>
                  Chủ đề tiếp theo <FiChevronRight />
                </button>
              )}
              <button type="button" className="btn btn-primary" onClick={startQuiz}>Làm lại</button>
            </div>
          </motion.div>
        </div>
      );
    }

    const quiz = activeTopic.quizzes[currentQ] || {};
    const options = [
      { key: 'A', text: getQuizOption(quiz, 'A') },
      { key: 'B', text: getQuizOption(quiz, 'B') },
      { key: 'C', text: getQuizOption(quiz, 'C') },
      { key: 'D', text: getQuizOption(quiz, 'D') },
    ];
    const correctAnswer = getCorrectAnswer(quiz);

    return (
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>
        <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{getField(activeTopic, '', 'TitleVI', 'titleVI', 'titlevi', 'title_vi')} — Quiz</span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Câu {currentQ + 1}/{asArray(activeTopic.quizzes).length}
          </span>
        </div>
        <div className="progress-bar" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / asArray(activeTopic.quizzes).length) * 100}%` }} />
        </div>

        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
            {getField(quiz, '', 'Question', 'question')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {options.map(opt => {
              let bg = 'var(--color-bg)';
              let border = 'var(--color-border)';
              let color = 'var(--color-text)';
              if (selectedAnswer) {
                if (opt.key === correctAnswer) {
                  bg = 'rgba(16,185,129,0.1)'; border = 'var(--color-success)'; color = 'var(--color-success)';
                } else if (opt.key === selectedAnswer && opt.key !== correctAnswer) {
                  bg = 'rgba(239,68,68,0.1)'; border = 'var(--color-error)'; color = 'var(--color-error)';
                }
              }
              return (
                <button type="button" key={opt.key} onClick={() => handleQuizAnswer(opt.key)} disabled={selectedAnswer !== null}
                  style={{
                    padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${border}`, background: bg, color,
                    textAlign: 'left', cursor: selectedAnswer ? 'default' : 'pointer',
                    fontWeight: 500, display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    transition: 'background 150ms ease, color 150ms ease, transform 150ms ease'
                  }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: bg === 'var(--color-bg)' ? 'var(--color-bg-secondary)' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 700, flexShrink: 0 }}>
                    {opt.key}
                  </span>
                  {asText(opt.text)}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: selectedAnswer === correctAnswer ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selectedAnswer === correctAnswer ? 'var(--color-success)' : 'var(--color-error)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {selectedAnswer === correctAnswer
                  ? <><FiCheck style={{ color: 'var(--color-success)' }} /> <b style={{ color: 'var(--color-success)' }}>Đúng rồi!</b></>
                  : <><FiX style={{ color: 'var(--color-error)' }} /> <b style={{ color: 'var(--color-error)' }}>Sai rồi!</b></>}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                {getField(quiz, '', 'Explanation', 'explanation')}
              </p>
              <div style={{ textAlign: 'right', marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={nextQuizQuestion}>
                  {currentQ + 1 >= asArray(activeTopic.quizzes).length ? 'Xem kết quả' : 'Câu tiếp'} <FiChevronRight />
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
        <button type="button" className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                {getField(activeTopic, '', 'CategoryNameVI', 'categoryNameVI', 'categorynamevi', 'category_name_vi')}
              </span>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)', margin: '4px 0' }}>
                {getField(activeTopic, 'Chủ đề', 'Title', 'title')}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{getField(activeTopic, '', 'TitleVI', 'titleVI', 'titlevi', 'title_vi')}</p>
            </div>
            {asArray(activeTopic.quizzes).length > 0 && (
              <button type="button" className="btn btn-primary" onClick={startQuiz} style={{ whiteSpace: 'nowrap' }}>
                <FiAward /> Làm bài test ({asArray(activeTopic.quizzes).length} câu)
              </button>
            )}
          </div>

          <div
            className="grammar-content"
            style={{ lineHeight: 1.8, fontSize: 'var(--font-size-base)' }}
            dangerouslySetInnerHTML={{ __html: getSafeGrammarHtml(pickValue(activeTopic, 'Content', 'content')) }}
          />
        </div>
      </div>
    );
  }

  // ========== TOPICS LIST ==========
  if (activeCategoryId && topics.length > 0) {
    const cat = categories.find(c => getId(c) === activeCategoryId);
    return (
      <div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>
        <div className="page-header">
          <h1>{getField(cat, '', 'Icon', 'icon')} {getField(cat, 'Ngữ pháp', 'NameVI', 'nameVI', 'namevi', 'name_vi', 'Name', 'name')}</h1>
          <p>{topics.length} chủ đề ngữ pháp</p>
        </div>
        {errorMessage && (
          <div className="card" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-warning)' }}>
            {errorMessage}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {topics.map((topic, i) => {
            const locked = isTopicLocked(topic);
            const bestScore = Number(topic.BestScore ?? topic.bestScore ?? topic.best_score ?? topic.bestscore ?? 0);
            return (
            <motion.div key={getId(topic) || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div
                className="card"
                onClick={() => getId(topic) && !locked && loadTopic(getId(topic))}
                style={{
                  cursor: getId(topic) && !locked ? 'pointer' : 'default',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: locked ? 0.68 : 1
                }}
              >
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{getField(topic, 'Chủ đề', 'Title', 'title')}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{getField(topic, '', 'TitleVI', 'titleVI', 'titlevi', 'title_vi')}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {bestScore > 0 && <span className="badge badge-secondary">{bestScore}%</span>}
                  {locked && <span className="badge badge-secondary"><FiLock /> Cần 80%</span>}
                  {getQuizCount(topic) > 0 && <span className="badge badge-primary">{getQuizCount(topic)} câu hỏi</span>}
                  {locked ? <FiLock style={{ color: 'var(--color-text-muted)' }} /> : <FiChevronRight style={{ color: 'var(--color-text-muted)' }} />}
                </div>
              </div>
            </motion.div>
          );})}
        </div>
      </div>
    );
  }

  if (activeCategoryId) {
    const cat = categories.find(c => getId(c) === activeCategoryId);
    return (
      <div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={goBack} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Quay lại
        </button>
        <div className="page-header">
          <h1>{getField(cat, '', 'Icon', 'icon')} {getField(cat, 'Ngữ pháp', 'NameVI', 'nameVI', 'namevi', 'name_vi', 'Name', 'name')}</h1>
          <p>Chưa có chủ đề ngữ pháp.</p>
        </div>
        {errorMessage && (
          <div className="card" style={{ color: 'var(--color-text-secondary)' }}>
            {errorMessage}
          </div>
        )}
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
          <motion.div key={getId(cat) || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="card" onClick={() => getId(cat) && loadTopics(getId(cat))} style={{ cursor: getId(cat) ? 'pointer' : 'default', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div style={{ fontSize: 40, marginBottom: 'var(--space-3)' }}>{getField(cat, '📘', 'Icon', 'icon')}</div>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', marginBottom: 4 }}>{getField(cat, 'Grammar', 'Name', 'name')}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>{getField(cat, '', 'NameVI', 'nameVI', 'namevi', 'name_vi')}</p>
              <span className="badge badge-secondary">{getTopicCount(cat)} chủ đề</span>
            </div>
          </motion.div>
        ))}
      </div>
      {categories.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Chưa có dữ liệu ngữ pháp.
        </div>
      )}
    </div>
  );
}

export default Grammar;
