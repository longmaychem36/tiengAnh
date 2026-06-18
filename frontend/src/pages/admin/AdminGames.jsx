// ============================================
// Admin Mini Game Management - Levels and Questions
// ============================================
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiChevronRight, FiEdit2, FiList, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../hooks/useAuth';

const FormModal = ({ title, fields, onSave, formData, setFormData, setShowForm }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowForm(false)}>
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', width: '100%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontWeight: 700 }}>{title}</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Đóng</button>
      </div>
      {fields.map(f => (
        <div key={f.key} style={{ marginBottom: 'var(--space-4)' }}>
          <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>{f.label}</span>
          {f.type === 'select' ? (
            <select aria-label={f.label} className="form-input" value={formData[f.key] || ''} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input aria-label={f.label} className="form-input" type={f.type || 'text'} value={formData[f.key] || ''} onChange={e => setFormData(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={f.placeholder || ''} />
          )}
        </div>
      ))}
      <button type="button" className="btn btn-primary" onClick={onSave} style={{ width: '100%' }}><FiSave /> Lưu</button>
    </motion.div>
  </div>
);

function Breadcrumb({ view, activeLevel, onLevels }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
      <span onClick={onLevels} style={{ cursor: 'pointer', fontWeight: view === 'levels' ? 700 : 400 }}>Mini game levels</span>
      {activeLevel && <><span>/</span><span style={{ fontWeight: 700 }}>{activeLevel.Name}</span></>}
    </div>
  );
}

function AdminGames() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const [view, setView] = useState('levels');
  const [levels, setLevels] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeLevel, setActiveLevel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => { loadLevels(); }, []);

  const loadLevels = async () => {
    try {
      const res = await adminApi.getLevels();
      setLevels(res.data || []);
    } catch {
      toast.error('Lỗi tải level mini game');
    }
  };

  const loadQuestions = async (level) => {
    setActiveLevel(level);
    setView('questions');
    try {
      const res = await adminApi.getQuestions(level.Id);
      setQuestions(res.data || []);
    } catch {
      toast.error('Lỗi tải câu hỏi');
    }
  };

  const openLevelForm = (level = null) => {
    setEditItem(level);
    setFormData(level
      ? { levelNumber: level.LevelNumber, name: level.Name, difficulty: level.Difficulty, timeLimit: level.TimeLimit, passScore: level.PassScore }
      : { levelNumber: levels.length + 1, name: '', difficulty: 'easy', timeLimit: 60, passScore: 70 });
    setShowForm(true);
  };

  const saveLevel = async () => {
    try {
      if (editItem) {
        await adminApi.updateLevel(editItem.Id, formData);
        toast.success('Đã cập nhật level');
      } else {
        await adminApi.createLevel(formData);
        toast.success('Đã tạo level');
      }
      setShowForm(false);
      setEditItem(null);
      await loadLevels();
    } catch {
      toast.error('Lỗi lưu level');
    }
  };

  const deleteLevel = async (id) => {
    if (!confirm('Xóa level này? Câu hỏi và tiến độ liên quan cũng sẽ bị xóa.')) return;
    try {
      await adminApi.deleteLevel(id);
      toast.success('Đã xóa level');
      await loadLevels();
    } catch {
      toast.error('Lỗi xóa level');
    }
  };

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

      const payload = {
        ...formData,
        contentEN: finalContentEN,
        levelId: activeLevel.Id,
        questionType: qType,
        options: finalOptions,
        correctAnswer: finalCorrectAnswer
      };

      if (editItem) {
        await adminApi.updateQuestion(editItem.Id, payload);
        toast.success('Đã cập nhật câu hỏi');
      } else {
        await adminApi.createQuestion(payload);
        toast.success('Đã tạo câu hỏi');
      }
      setShowForm(false);
      setEditItem(null);
      await loadQuestions(activeLevel);
    } catch (e) {
      toast.error('Lỗi lưu câu hỏi: ' + e.message);
    }
  };

  const deleteQuestion = async (id) => {
    if (!confirm('Xóa câu hỏi này?')) return;
    try {
      await adminApi.deleteQuestion(id);
      toast.success('Đã xóa câu hỏi');
      await loadQuestions(activeLevel);
    } catch {
      toast.error('Lỗi xóa câu hỏi');
    }
  };

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
      { key: 'correctAnswer', label: 'Câu/từ sẽ được đọc', placeholder: 'Good morning' },
      { key: 'contentVI', label: 'Nghĩa tiếng Việt', placeholder: 'Chào buổi sáng' },
      { key: 'options', label: 'Đáp án sai, cách nhau bằng dấu phẩy', placeholder: 'Good night, Good evening' },
    ];
    if (qType === 'listenbuild') return [
      ...base,
      { key: 'correctAnswer', label: 'Câu tiếng Anh hoàn chỉnh', placeholder: 'I go to school' },
      { key: 'contentVI', label: 'Nghĩa tiếng Việt', placeholder: 'Tôi đi học' },
      { key: 'options', label: 'Từ gây nhiễu thêm', placeholder: 'goes, going' },
    ];
    if (qType === 'truefalse') return [
      ...base,
      { key: 'contentEN', label: 'Câu tiếng Anh', placeholder: 'Hello' },
      { key: 'contentVI', label: 'Bản dịch tiếng Việt', placeholder: 'Xin chào' },
      { key: 'correctAnswer', label: 'Đáp án', type: 'select', options: ['true', 'false'] },
    ];
    return base;
  };

  const cardStyle = { padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'white', marginBottom: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Quản lý Mini game</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Quản lý trực tiếp level và câu hỏi trong một tuyến mini game duy nhất.</p>
        </div>
        {view === 'levels' && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openLevelForm()}><FiPlus /> Thêm level</button>
        )}
      </div>

      <Breadcrumb
        view={view}
        activeLevel={activeLevel}
        onLevels={() => { setView('levels'); setActiveLevel(null); }}
      />

      {view === 'levels' && (
        <>
          {levels.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>Chưa có level mini game nào.</p>}
          {levels.map(lv => (
            <div key={lv.Id} style={cardStyle}>
              <div onClick={() => loadQuestions(lv)} style={{ cursor: 'pointer', flex: 1 }}>
                <span style={{ fontWeight: 700, marginRight: 8 }}>Level {lv.LevelNumber}:</span>
                <b>{lv.Name}</b>
                <span style={{ marginLeft: 12, fontSize: 'var(--font-size-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: lv.Difficulty === 'easy' ? '#d1fae5' : lv.Difficulty === 'medium' ? '#fef3c7' : '#fee2e2', color: lv.Difficulty === 'easy' ? '#059669' : lv.Difficulty === 'medium' ? '#d97706' : '#dc2626' }}>{lv.Difficulty}</span>
                <span style={{ marginLeft: 8, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{lv.QuestionCount} câu · {lv.TimeLimit}s · Đạt {lv.PassScore}%</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openLevelForm(lv)}>Sửa</button>
                {isSuperAdmin && <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteLevel(lv.Id)}>Xóa</button>}
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => loadQuestions(lv)}>Câu hỏi</button>
              </div>
            </div>
          ))}
        </>
      )}

      {view === 'questions' && (
        <>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setView('levels'); setActiveLevel(null); }}><FiArrowLeft /> Quay lại</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => openQuestionForm()}><FiPlus /> Thêm câu hỏi</button>
          </div>
          {questions.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>Chưa có câu hỏi nào.</p>}
          {questions.map((q, i) => {
            const typeLabels = { matching: 'Nối từ', listening: 'Nghe chọn', listenbuild: 'Xếp câu', truefalse: 'Đúng/Sai' };
            const mainText = q.QuestionType === 'truefalse' || q.QuestionType === 'listenbuild' ? q.CorrectAnswer : (q.ContentEN || q.CorrectAnswer);
            return (
              <div key={q.Id} style={{ ...cardStyle, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>#{i + 1}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', background: '#f1f5f9', padding: '2px 8px', borderRadius: 99 }}>{typeLabels[q.QuestionType] || q.QuestionType}</span>
                    <b>{mainText}</b>
                  </div>
                  {q.ContentVI && <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>→ {q.ContentVI}</div>}
                  {q.Options && q.Options.length > 0 && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>Options: {q.Options.join(' | ')}</div>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openQuestionForm(q)}>Sửa</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteQuestion(q.Id)}>Xóa</button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {showForm && view === 'levels' && (
        <FormModal title={editItem ? 'Sửa level' : 'Tạo level mới'} onSave={saveLevel} formData={formData} setFormData={setFormData} setShowForm={setShowForm} fields={[
          { key: 'levelNumber', label: 'Số level', type: 'number' },
          { key: 'name', label: 'Tên level', placeholder: 'VD: Động vật' },
          { key: 'difficulty', label: 'Độ khó', type: 'select', options: ['easy', 'medium', 'hard'] },
          { key: 'timeLimit', label: 'Thời gian (giây)', type: 'number' },
          { key: 'passScore', label: 'Điểm đạt (%)', type: 'number' }
        ]} />
      )}
      {showForm && view === 'questions' && (
        <FormModal title={editItem ? 'Sửa câu hỏi' : 'Thêm câu hỏi'} onSave={saveQuestion} formData={formData} setFormData={setFormData} setShowForm={setShowForm} fields={getQuestionFields()} />
      )}
    </div>
  );
}

export default AdminGames;
