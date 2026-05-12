// ============================================
// Admin Game Management — Sets, Levels, Questions CRUD
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiChevronRight, FiSave, FiX, FiList } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { gameApi } from '../../api/gameApi';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../hooks/useAuth';

// ========== SHARED FORM MODAL ==========
const FormModal = ({ title, fields, onSave, formData, setFormData, setShowForm }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowForm(false)}>
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', width: '100%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontWeight: 700 }}>{title}</h3>
        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={20} /></button>
      </div>
      {fields.map(f => (
        <div key={f.key} style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>{f.label}</label>
          {f.type === 'select' ? (
            <select className="form-input" value={formData[f.key] || ''} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input className="form-input" type={f.type || 'text'} value={formData[f.key] || ''} onChange={e => setFormData(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={f.placeholder || ''} />
          )}
        </div>
      ))}
      <button className="btn btn-primary" onClick={onSave} style={{ width: '100%' }}><FiSave /> Lưu</button>
    </motion.div>
  </div>
);

function AdminGames() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  // View state
  const [view, setView] = useState('sets'); // 'sets' | 'levels' | 'questions'
  const [sets, setSets] = useState([]);
  const [levels, setLevels] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeSet, setActiveSet] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => { loadSets(); }, []);

  const loadSets = async () => {
    try { const res = await gameApi.getSets(); setSets(res.data || []); } catch { toast.error('Lỗi tải sets'); }
  };

  // ========== SET CRUD (superadmin only) ==========
  const [showSetForm, setShowSetForm] = useState(false);
  const [setData, setSetData] = useState({});
  const openSetForm = () => { setSetData({ name: '', description: '', icon: '🎮', gameType: 'mixed', orderIndex: sets.length }); setShowSetForm(true); };
  const saveSet = async () => {
    try { await adminApi.createSet(setData); toast.success('Đã tạo game set!'); setShowSetForm(false); loadSets(); } catch { toast.error('Lỗi tạo set'); }
  };
  const deleteSet = async (id) => {
    if (!confirm('Xóa game set này? Tất cả level và câu hỏi sẽ bị xóa!')) return;
    try { await adminApi.deleteSet(id); toast.success('Đã xóa!'); loadSets(); } catch { toast.error('Lỗi xóa set'); }
  };
  const loadLevels = async (set) => {
    setActiveSet(set); setView('levels');
    try { const res = await gameApi.getLevels(set.Id); setLevels(res.data || []); } catch { toast.error('Lỗi tải levels'); }
  };
  const loadQuestions = async (level) => {
    setActiveLevel(level); setView('questions');
    try { const res = await adminApi.getQuestions(level.Id); setQuestions(res.data || []); } catch { toast.error('Lỗi tải câu hỏi'); }
  };

  // ========== SET CRUD (Disabled creation/editing/deleting for hardcoded sets) ==========


  // ========== LEVEL CRUD ==========
  const openLevelForm = (level = null) => {
    setEditItem(level);
    setFormData(level ? { name: level.Name, difficulty: level.Difficulty, timeLimit: level.TimeLimit, passScore: level.PassScore }
      : { name: '', difficulty: 'easy', timeLimit: 60, passScore: 70, levelNumber: levels.length + 1 });
    setShowForm(true);
  };
  const saveLevel = async () => {
    try {
      if (editItem) { await adminApi.updateLevel(editItem.Id, formData); toast.success('Đã cập nhật!'); }
      else { await adminApi.createLevel({ ...formData, setId: activeSet.Id, levelNumber: formData.levelNumber || levels.length + 1 }); toast.success('Đã tạo!'); }
      setShowForm(false); loadLevels(activeSet);
    } catch { toast.error('Lỗi lưu level'); }
  };
  const deleteLevel = async (id) => {
    if (!confirm('Xóa level này?')) return;
    try { await adminApi.deleteLevel(id); toast.success('Đã xóa!'); loadLevels(activeSet); } catch { toast.error('Lỗi xóa'); }
  };

  // ========== QUESTION CRUD ==========
  // For mixed sets, questionType is chosen per-question
  const getDefaultQType = () => 'matching';
  const openQuestionForm = (q = null) => {
    setEditItem(q);
    const optionsText = q?.Options ? q.Options.join(', ') : '';
    setFormData(q
      ? { questionType: q.QuestionType || 'matching', contentEN: q.ContentEN || '', contentVI: q.ContentVI || '', audioUrl: q.AudioUrl || '', correctAnswer: q.CorrectAnswer || '', options: optionsText, orderIndex: q.OrderIndex }
      : { questionType: 'matching', contentEN: '', contentVI: '', audioUrl: '', correctAnswer: '', options: '', orderIndex: questions.length });
    setShowForm(true);
  };
  const saveQuestion = async () => {
    try {
      const qType = formData.questionType || 'matching';
      let finalOptions = formData.options ? formData.options.split(',').map(s => s.trim()).filter(Boolean) : [];
      let finalCorrectAnswer = formData.correctAnswer;
      let finalContentEN = formData.contentEN;

      if (qType === 'matching') {
        finalCorrectAnswer = formData.contentEN;
        finalOptions = [];
      } else if (qType === 'listenbuild') {
        // Options = words of the sentence + distractors
        const sentenceWords = finalCorrectAnswer.split(' ').map(s => s.trim()).filter(Boolean);
        const extra = finalOptions.filter(o => !sentenceWords.includes(o));
        finalOptions = [...sentenceWords, ...extra];
        finalContentEN = finalCorrectAnswer;
      } else if (qType === 'listening') {
        finalContentEN = finalCorrectAnswer;
        if (finalCorrectAnswer && !finalOptions.includes(finalCorrectAnswer)) finalOptions.push(finalCorrectAnswer);
      } else if (qType === 'truefalse') {
        finalOptions = [];
        finalCorrectAnswer = formData.correctAnswer === 'true' ? 'true' : 'false';
      }

      const d = { ...formData, contentEN: finalContentEN, levelId: activeLevel.Id, questionType: qType, options: finalOptions, correctAnswer: finalCorrectAnswer };
      if (editItem) { await adminApi.updateQuestion(editItem.Id, d); toast.success('Đã cập nhật!'); }
      else { await adminApi.createQuestion(d); toast.success('Đã tạo!'); }
      setShowForm(false); loadQuestions(activeLevel);
    } catch (e) { toast.error('Lỗi lưu câu hỏi: ' + e.message); }
  };
  const deleteQuestion = async (id) => {
    if (!confirm('Xóa câu hỏi này?')) return;
    try { await adminApi.deleteQuestion(id); toast.success('Đã xóa!'); loadQuestions(activeLevel); } catch { toast.error('Lỗi xóa'); }
  };



  // ========== BREADCRUMB ==========
  const Breadcrumb = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
      <span onClick={() => { setView('sets'); setActiveSet(null); }} style={{ cursor: 'pointer', fontWeight: view === 'sets' ? 700 : 400 }}>Game Sets</span>
      {activeSet && <><FiChevronRight size={14} /><span onClick={() => { setView('levels'); setActiveLevel(null); }} style={{ cursor: 'pointer', fontWeight: view === 'levels' ? 700 : 400 }}>{activeSet.Name}</span></>}
      {activeLevel && <><FiChevronRight size={14} /><span style={{ fontWeight: 700 }}>{activeLevel.Name}</span></>}
    </div>
  );

  const getQuestionFields = () => {
    const qType = formData.questionType || 'matching';
    const base = [
      { key: 'questionType', label: 'Loại câu hỏi', type: 'select', options: ['matching', 'listening', 'listenbuild', 'truefalse'] },
      { key: 'orderIndex', label: 'Thứ tự hiển thị', type: 'number' },
    ];
    if (qType === 'matching') return [
      ...base,
      { key: 'contentEN', label: 'Từ tiếng Anh', placeholder: 'Hello' },
      { key: 'contentVI', label: 'Nghĩa tiếng Việt', placeholder: 'Xin chào' },
    ];
    if (qType === 'listening') return [
      ...base,
      { key: 'correctAnswer', label: 'Câu/từ sẽ được đọc (đáp án đúng)', placeholder: 'Good morning' },
      { key: 'contentVI', label: 'Nghĩa tiếng Việt (tuỳ chọn)', placeholder: 'Chào buổi sáng' },
      { key: 'options', label: 'Các đáp án sai, cách nhau bằng dấu phẩy', placeholder: 'Good night, Good evening' },
    ];
    if (qType === 'listenbuild') return [
      ...base,
      { key: 'correctAnswer', label: 'Câu tiếng Anh hoàn chỉnh (sẽ được đọc)', placeholder: 'I go to school' },
      { key: 'contentVI', label: 'Nghĩa tiếng Việt (gợi ý)', placeholder: 'Tôi đi học' },
      { key: 'options', label: 'Từ gây nhiễu thêm (tuỳ chọn, cách nhau bằng dấu phẩy)', placeholder: 'goes, going' },
    ];
    if (qType === 'truefalse') return [
      ...base,
      { key: 'contentEN', label: 'Câu tiếng Anh', placeholder: 'Hello' },
      { key: 'contentVI', label: 'Bản dịch tiếng Việt (đúng hoặc sai)', placeholder: 'Xin chào' },
      { key: 'correctAnswer', label: 'Đáp án', type: 'select', options: ['true', 'false'] },
    ];
    return base;
  };

  const cardStyle = { padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'white', marginBottom: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const btnIcon = { background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 'var(--radius-md)' };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Quản lý Mini Games</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Tạo, sửa, xóa bộ game, level và câu hỏi</p>
        </div>
        {isSuperAdmin && view === 'sets' && (
          <button className="btn btn-primary btn-sm" onClick={openSetForm}><FiPlus /> Tạo Game Set</button>
        )}
      </div>

      <Breadcrumb />

      {/* ========== SETS VIEW ========== */}
      {view === 'sets' && (
        <>
          {sets.map(set => (
            <div key={set.Id} style={cardStyle}>
              <div onClick={() => loadLevels(set)} style={{ cursor: 'pointer', flex: 1 }}>
                <span style={{ fontSize: 24, marginRight: 12 }}>{set.Icon}</span>
                <b>{set.Name}</b>
                <span style={{ marginLeft: 12, fontSize: 'var(--font-size-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: set.GameType === 'mixed' ? '#ede9fe' : 'var(--color-primary-light)', color: set.GameType === 'mixed' ? '#7c3aed' : 'var(--color-primary)' }}>{set.GameType}</span>
                <span style={{ marginLeft: 8, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{set.LevelCount} levels</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={btnIcon} onClick={() => loadLevels(set)}><FiChevronRight size={16} /></button>
                {isSuperAdmin && <button style={btnIcon} onClick={() => deleteSet(set.Id)}><FiTrash2 size={16} style={{ color: 'var(--color-error)' }} /></button>}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ========== LEVELS VIEW ========== */}
      {view === 'levels' && (
        <>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setView('sets'); setActiveSet(null); }}><FiArrowLeft /> Quay lại</button>
            <button className="btn btn-primary btn-sm" onClick={() => openLevelForm()}><FiPlus /> Thêm level</button>
          </div>
          {levels.map(lv => (
            <div key={lv.Id} style={cardStyle}>
              <div onClick={() => loadQuestions(lv)} style={{ cursor: 'pointer', flex: 1 }}>
                <span style={{ fontWeight: 700, marginRight: 8 }}>Level {lv.LevelNumber}:</span>
                <b>{lv.Name}</b>
                <span style={{ marginLeft: 12, fontSize: 'var(--font-size-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: lv.Difficulty === 'easy' ? '#d1fae5' : lv.Difficulty === 'medium' ? '#fef3c7' : '#fee2e2', color: lv.Difficulty === 'easy' ? '#059669' : lv.Difficulty === 'medium' ? '#d97706' : '#dc2626' }}>{lv.Difficulty}</span>
                <span style={{ marginLeft: 8, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{lv.QuestionCount} câu · {lv.TimeLimit}s · Đạt {lv.PassScore}%</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={btnIcon} onClick={() => openLevelForm(lv)}><FiEdit2 size={16} style={{ color: 'var(--color-primary)' }} /></button>
                {isSuperAdmin && <button style={btnIcon} onClick={() => deleteLevel(lv.Id)}><FiTrash2 size={16} style={{ color: 'var(--color-error)' }} /></button>}
                <button style={btnIcon} onClick={() => loadQuestions(lv)}><FiList size={16} /></button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ========== QUESTIONS VIEW ========== */}
      {view === 'questions' && (
        <>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setView('levels'); setActiveLevel(null); }}><FiArrowLeft /> Quay lại</button>
            <button className="btn btn-primary btn-sm" onClick={() => openQuestionForm()}><FiPlus /> Thêm câu hỏi</button>
          </div>
          {questions.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>Chưa có câu hỏi nào.</p>}
          {questions.map((q, i) => {
            const typeLabels = { matching: '🔗', listening: '🎧', listenbuild: '🎵', truefalse: '✅' };
            const mainText = q.QuestionType === 'truefalse' || q.QuestionType === 'listenbuild' ? q.CorrectAnswer : (q.ContentEN || q.CorrectAnswer);
            return (
            <div key={q.Id} style={{ ...cardStyle, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>#{i + 1}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', background: '#f1f5f9', padding: '2px 8px', borderRadius: 99 }}>{typeLabels[q.QuestionType] || '❓'} {q.QuestionType}</span>
                  <b>{mainText}</b>
                </div>
                {q.ContentVI && <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>→ {q.ContentVI}</div>}
                {q.Options && q.Options.length > 0 && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>Options: {q.Options.join(' | ')}</div>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={btnIcon} onClick={() => openQuestionForm(q)}><FiEdit2 size={16} style={{ color: 'var(--color-primary)' }} /></button>
                <button style={btnIcon} onClick={() => deleteQuestion(q.Id)}><FiTrash2 size={16} style={{ color: 'var(--color-error)' }} /></button>
              </div>
            </div>
            );
          })}
        </>
      )}

      {/* ========== FORM MODAL ========== */}
      {showForm && view === 'levels' && (
        <FormModal title={editItem ? 'Sửa level' : 'Tạo level mới'} onSave={saveLevel} formData={formData} setFormData={setFormData} setShowForm={setShowForm} fields={[
          { key: 'name', label: 'Tên level', placeholder: 'VD: Động vật' },
          { key: 'difficulty', label: 'Độ khó', type: 'select', options: ['easy', 'medium', 'hard'] },
          { key: 'timeLimit', label: 'Thời gian (giây)', type: 'number' },
          { key: 'passScore', label: 'Điểm đạt (%)', type: 'number' }
        ]} />
      )}
      {showForm && view === 'questions' && (
        <FormModal title={editItem ? 'Sửa câu hỏi' : 'Thêm câu hỏi'} onSave={saveQuestion} formData={formData} setFormData={setFormData} setShowForm={setShowForm} fields={getQuestionFields()} />
      )}
      {showSetForm && isSuperAdmin && (
        <FormModal
          title="Tạo Game Set mới"
          onSave={saveSet}
          formData={setData}
          setFormData={setSetData}
          setShowForm={setShowSetForm}
          fields={[
            { key: 'name', label: 'Tên bộ game', placeholder: 'VD: Tổng hợp nâng cao' },
            { key: 'description', label: 'Mô tả', placeholder: 'Kết hợp 4 loại mini game...' },
            { key: 'icon', label: 'Icon (emoji)', placeholder: '🎮' },
            { key: 'gameType', label: 'Loại game', type: 'select', options: ['mixed'] },
            { key: 'orderIndex', label: 'Thứ tự hiển thị', type: 'number' },
          ]}
        />
      )}
    </div>
  );
}

export default AdminGames;
