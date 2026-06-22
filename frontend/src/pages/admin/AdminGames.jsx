// ============================================
// Admin Mini Game Management - Levels, Questions, Placement Test Pool
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

const QUESTION_TYPES = ['matching', 'listening', 'listenbuild', 'truefalse', 'speakrepeat'];
const TYPE_LABELS = {
  matching: 'Nối từ',
  listening: 'Nghe chọn',
  listenbuild: 'Nghe xếp câu',
  truefalse: 'Đúng/Sai',
  speakrepeat: 'Đọc câu'
};

const FormModal = ({ title, fields, onSave, formData, setFormData, setShowForm }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.42)', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowForm(false)}>
    <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 8, padding: 24, width: '100%', maxWidth: 560, maxHeight: '84vh', overflow: 'auto', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700 }}>{title}</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Đóng</button>
      </div>
      {fields.map(f => (
        <label key={f.key} style={{ display: 'block', marginBottom: 14 }}>
          <span style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 5, color: 'var(--color-text-secondary)' }}>{f.label}</span>
          {f.type === 'select' ? (
            <select aria-label={f.label} className="form-input" value={formData[f.key] ?? ''} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}>
              {f.options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea aria-label={f.label} className="form-input" rows={3} value={formData[f.key] ?? ''} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder || ''} />
          ) : (
            <input aria-label={f.label} className="form-input" type={f.type || 'text'} value={formData[f.key] ?? ''} onChange={e => setFormData(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={f.placeholder || ''} />
          )}
        </label>
      ))}
      <button type="button" className="btn btn-primary" onClick={onSave} style={{ width: '100%' }}><FiSave /> Lưu</button>
    </motion.div>
  </div>
);

function normalizeOptions(optionsText) {
  if (Array.isArray(optionsText)) return optionsText;

  const rawValue = String(optionsText || '').trim();
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Admins normally enter a comma-separated list, not JSON.
  }

  return rawValue
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function uniqueOptions(options) {
  const seen = new Set();
  return options.filter((option) => {
    const value = String(option || '').trim();
    const key = value.toLocaleLowerCase('vi');
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(option => String(option).trim());
}

function optionsToText(options) {
  if (!options) return '';
  if (Array.isArray(options)) return options.join(', ');
  if (typeof options === 'object') return JSON.stringify(options);
  return String(options);
}

function prepareQuestionPayload(formData, levelId = null) {
  const qType = formData.questionType || 'matching';
  let finalOptions = uniqueOptions(normalizeOptions(formData.options));
  let finalCorrectAnswer = String(formData.correctAnswer || '').trim();
  let finalContentEN = String(formData.contentEN || '').trim();
  const finalContentVI = String(formData.contentVI || '').trim();

  if (qType === 'matching') {
    if (!finalContentEN) throw new Error('Dạng nối từ cần có từ tiếng Anh.');
    if (!finalContentVI) throw new Error('Dạng nối từ cần có nghĩa đúng.');
    finalCorrectAnswer = finalContentVI;
    finalOptions = uniqueOptions([finalCorrectAnswer, ...finalOptions]);
  } else if (qType === 'listenbuild') {
    if (!finalCorrectAnswer && !finalContentEN) {
      throw new Error('Dạng xếp câu cần có câu tiếng Anh hoàn chỉnh.');
    }
    finalCorrectAnswer = finalCorrectAnswer || finalContentEN;
    finalContentEN = finalCorrectAnswer;
    const words = finalCorrectAnswer.split(/\s+/).map(word => word.trim()).filter(Boolean);
    finalOptions = uniqueOptions([...words, ...finalOptions]);
  } else if (qType === 'listening') {
    if (!finalCorrectAnswer && !finalContentEN) {
      throw new Error('Dạng nghe chọn cần có nội dung được đọc.');
    }
    finalCorrectAnswer = finalCorrectAnswer || finalContentEN;
    finalContentEN = finalCorrectAnswer;
    finalOptions = uniqueOptions([finalCorrectAnswer, ...finalOptions]);
  } else if (qType === 'truefalse') {
    if (!finalContentEN || !finalContentVI) {
      throw new Error('Dạng đúng/sai cần đủ câu tiếng Anh và bản dịch.');
    }
    finalOptions = [];
    finalCorrectAnswer = formData.correctAnswer === 'false' ? 'false' : 'true';
  } else if (qType === 'speakrepeat') {
    if (!finalCorrectAnswer && !finalContentEN) {
      throw new Error('Dạng đọc câu cần có câu mẫu.');
    }
    finalCorrectAnswer = finalCorrectAnswer || finalContentEN;
    finalContentEN = finalCorrectAnswer;
    finalOptions = { passScore: Number(formData.passScore || 70) };
  }

  return {
    levelId,
    questionType: qType,
    contentEN: finalContentEN,
    contentVI: finalContentVI,
    audioUrl: String(formData.audioUrl || '').trim(),
    imageUrl: String(formData.imageUrl || '').trim(),
    correctAnswer: finalCorrectAnswer,
    options: finalOptions,
    orderIndex: Number(formData.orderIndex || 0),
    difficulty: formData.difficulty || 'easy',
    pointRatio: Number(formData.pointRatio || 1),
    isActive: formData.activeStatus !== 'inactive'
  };
}

function AdminGames() {
  const [view, setView] = useState('levels');
  const [levels, setLevels] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [placementQuestions, setPlacementQuestions] = useState([]);
  const [activeLevel, setActiveLevel] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => { loadLevels(); loadPlacementQuestions(); }, []);

  const loadLevels = async () => {
    try {
      const res = await adminApi.getLevels();
      setLevels(res.data || []);
    } catch {
      toast.error('Lỗi tải level mini game');
    }
  };

  const loadPlacementQuestions = async () => {
    try {
      const res = await adminApi.getPlacementMiniGameQuestions();
      setPlacementQuestions(res.data || []);
    } catch {
      toast.error('Lỗi tải câu hỏi test đầu vào');
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
      if (editItem) await adminApi.updateLevel(editItem.Id, formData);
      else await adminApi.createLevel(formData);
      toast.success('Đã lưu level');
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
    setFormData(q
      ? {
        questionType: q.QuestionType || 'matching',
        contentEN: q.ContentEN || '',
        contentVI: q.ContentVI || '',
        audioUrl: q.AudioUrl || '',
        imageUrl: q.ImageUrl || '',
        correctAnswer: q.CorrectAnswer || '',
        options: optionsToText(q.Options),
        passScore: q.Options?.passScore || 70,
        orderIndex: q.OrderIndex || 0
      }
      : { questionType: 'matching', contentEN: '', contentVI: '', audioUrl: '', imageUrl: '', correctAnswer: '', options: '', passScore: 70, orderIndex: questions.length + 1 });
    setShowForm(true);
  };

  const saveQuestion = async () => {
    try {
      const payload = prepareQuestionPayload(formData, activeLevel.Id);
      if (editItem) await adminApi.updateQuestion(editItem.Id, payload);
      else await adminApi.createQuestion(payload);
      toast.success('Đã lưu câu hỏi');
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

  const openPlacementForm = (q = null) => {
    setEditItem(q);
    setFormData(q
      ? {
        questionType: q.QuestionType || 'matching',
        contentEN: q.ContentEN || '',
        contentVI: q.ContentVI || '',
        audioUrl: q.AudioUrl || '',
        imageUrl: q.ImageUrl || '',
        correctAnswer: q.CorrectAnswer || '',
        options: optionsToText(q.Options),
        passScore: q.Options?.passScore || 70,
        difficulty: q.Difficulty || 'easy',
        pointRatio: q.PointRatio || 1,
        activeStatus: q.IsActive ? 'active' : 'inactive',
        orderIndex: q.OrderIndex || 0
      }
      : { questionType: 'matching', contentEN: '', contentVI: '', audioUrl: '', imageUrl: '', correctAnswer: '', options: '', passScore: 70, difficulty: 'easy', pointRatio: 1, activeStatus: 'active', orderIndex: placementQuestions.length + 1 });
    setShowForm(true);
  };

  const savePlacementQuestion = async () => {
    try {
      const payload = prepareQuestionPayload(formData);
      if (editItem) await adminApi.updatePlacementMiniGameQuestion(editItem.Id, payload);
      else await adminApi.createPlacementMiniGameQuestion(payload);
      toast.success('Đã lưu câu hỏi test đầu vào');
      setShowForm(false);
      setEditItem(null);
      await loadPlacementQuestions();
    } catch (e) {
      toast.error('Lỗi lưu câu hỏi test: ' + e.message);
    }
  };

  const deletePlacementQuestion = async (id) => {
    if (!confirm('Xóa câu hỏi test đầu vào này?')) return;
    try {
      await adminApi.deletePlacementMiniGameQuestion(id);
      toast.success('Đã xóa câu hỏi test');
      await loadPlacementQuestions();
    } catch {
      toast.error('Lỗi xóa câu hỏi test');
    }
  };

  const getQuestionFields = (includePlacementFields = false) => {
    const qType = formData.questionType || 'matching';
    const fields = [
      { key: 'questionType', label: 'Loại câu hỏi', type: 'select', options: QUESTION_TYPES },
      { key: 'orderIndex', label: 'Thứ tự', type: 'number' }
    ];
    if (includePlacementFields) {
      fields.push(
        { key: 'difficulty', label: 'Độ khó', type: 'select', options: ['easy', 'hard'] },
        { key: 'pointRatio', label: 'Tỉ số điểm', type: 'number' },
        { key: 'activeStatus', label: 'Trạng thái', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] }
      );
    }
    if (qType === 'matching') return [...fields, { key: 'contentEN', label: 'Từ tiếng Anh', placeholder: 'apple' }, { key: 'contentVI', label: 'Nghĩa đúng', placeholder: 'qua tao' }, { key: 'options', label: 'Lựa chọn khác, cách nhau bằng dấu phẩy', placeholder: 'qua chuoi, quyen sach' }];
    if (qType === 'listening') return [...fields, { key: 'correctAnswer', label: 'Câu sẽ được đọc', placeholder: 'Good morning' }, { key: 'contentVI', label: 'Nghĩa tiếng Việt', placeholder: 'Chao buoi sang' }, { key: 'options', label: 'Đáp án sai, cách nhau bằng dấu phẩy', placeholder: 'Good night, Good evening' }];
    if (qType === 'listenbuild') return [...fields, { key: 'correctAnswer', label: 'Câu tiếng Anh hoàn chỉnh', placeholder: 'I go to school' }, { key: 'contentVI', label: 'Gợi ý tiếng Việt', placeholder: 'Toi di hoc' }, { key: 'options', label: 'Từ gây nhiễu thêm', placeholder: 'goes, going' }];
    if (qType === 'truefalse') return [...fields, { key: 'contentEN', label: 'Câu tiếng Anh', placeholder: 'The dog is black' }, { key: 'contentVI', label: 'Bản dịch hiển thị', placeholder: 'Con cho mau trang' }, { key: 'correctAnswer', label: 'Đáp án', type: 'select', options: ['true', 'false'] }];
    if (qType === 'speakrepeat') return [...fields, { key: 'correctAnswer', label: 'Câu cần đọc', placeholder: 'I can help you' }, { key: 'contentVI', label: 'Nghĩa tiếng Việt', placeholder: 'Toi co the giup ban' }, { key: 'passScore', label: 'Điểm nói đạt (%)', type: 'number' }];
    return fields;
  };

  const cardStyle = { padding: '14px 18px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'white', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 };
  const activePlacementCount = useMemo(() => placementQuestions.filter(q => q.IsActive).length, [placementQuestions]);

  const renderQuestionRow = (q, actions, extra = null) => {
    const mainText = q.QuestionType === 'truefalse' || q.QuestionType === 'listenbuild' || q.QuestionType === 'speakrepeat' ? q.CorrectAnswer : (q.ContentEN || q.CorrectAnswer);
    return (
      <div key={q.Id} style={{ ...cardStyle, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{TYPE_LABELS[q.QuestionType] || q.QuestionType}</span>
            {extra}
            <b style={{ overflowWrap: 'anywhere' }}>{mainText}</b>
          </div>
          {q.ContentVI && <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>- {q.ContentVI}</div>}
          {Array.isArray(q.Options) && q.Options.length > 0 && <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Options: {q.Options.join(' | ')}</div>}
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>{actions}</div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Quản lý Mini game</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Quản lý màn chơi và bộ câu hỏi riêng cho bài test đầu vào.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {view !== 'levels' && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setView('levels'); setActiveLevel(null); }}><FiArrowLeft /> Levels</button>}
          {view === 'levels' && <button type="button" className="btn btn-primary btn-sm" onClick={() => openLevelForm()}><FiPlus /> Thêm level</button>}
          {view === 'placement' && <button type="button" className="btn btn-primary btn-sm" onClick={() => openPlacementForm()}><FiPlus /> Thêm câu test</button>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button type="button" className={`btn btn-sm ${view !== 'placement' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setView('levels'); setActiveLevel(null); }}>Mini game</button>
        <button type="button" className={`btn btn-sm ${view === 'placement' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('placement')}>Bài test đầu vào ({activePlacementCount})</button>
      </div>

      {view === 'levels' && (
        <>
          {levels.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 32 }}>Chưa có level mini game nào.</p>}
          {levels.map(lv => (
            <div key={lv.Id} style={cardStyle}>
              <div onClick={() => loadQuestions(lv)} style={{ cursor: 'pointer', flex: 1 }}>
                <span style={{ fontWeight: 700, marginRight: 8 }}>Level {lv.LevelNumber}:</span>
                <b>{lv.Name}</b>
                <span style={{ marginLeft: 8, color: 'var(--color-text-muted)', fontSize: 13 }}>{lv.QuestionCount} cau - {lv.TimeLimit}s - Dat {lv.PassScore}%</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openLevelForm(lv)}>Sửa</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteLevel(lv.Id)}>Xóa</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => loadQuestions(lv)}>Câu hỏi</button>
              </div>
            </div>
          ))}
        </>
      )}

      {view === 'questions' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 18 }}>{activeLevel?.Name}</h2>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => openQuestionForm()}><FiPlus /> Thêm câu hỏi</button>
          </div>
          {questions.map(q => renderQuestionRow(q, <><button type="button" className="btn btn-ghost btn-sm" onClick={() => openQuestionForm(q)}>Sửa</button><button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteQuestion(q.Id)}>Xóa</button></>))}
        </>
      )}

      {view === 'placement' && (
        <>
          <div style={{ marginBottom: 14, color: 'var(--color-text-muted)', fontSize: 13 }}>
            Các câu active sẽ được đưa vào bài test đầu vào. Point ratio là trọng số điểm khi chấm bài.
          </div>
          {placementQuestions.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 32 }}>Chưa có câu hỏi test đầu vào.</p>}
          {placementQuestions.map(q => renderQuestionRow(
            q,
            <><button type="button" className="btn btn-ghost btn-sm" onClick={() => openPlacementForm(q)}>Sửa</button><button type="button" className="btn btn-ghost btn-sm" onClick={() => deletePlacementQuestion(q.Id)}>Xóa</button></>,
            <><span style={{ fontSize: 12, background: q.IsActive ? '#dcfce7' : '#fee2e2', color: q.IsActive ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: 6 }}>{q.IsActive ? 'active' : 'inactive'}</span><span style={{ fontSize: 12, background: '#f8fafc', padding: '2px 8px', borderRadius: 6 }}>{q.Difficulty} x{Number(q.PointRatio || 1).toFixed(2)}</span></>
          ))}
        </>
      )}

      {showForm && view === 'levels' && (
        <FormModal title={editItem ? 'Sửa level' : 'Tạo level mới'} onSave={saveLevel} formData={formData} setFormData={setFormData} setShowForm={setShowForm} fields={[
          { key: 'levelNumber', label: 'Số level', type: 'number' },
          { key: 'name', label: 'Tên level', placeholder: 'Daily life' },
          { key: 'difficulty', label: 'Độ khó', type: 'select', options: ['easy', 'medium', 'hard'] },
          { key: 'timeLimit', label: 'Thời gian (giây)', type: 'number' },
          { key: 'passScore', label: 'Điểm đạt (%)', type: 'number' }
        ]} />
      )}
      {showForm && view === 'questions' && (
        <FormModal title={editItem ? 'Sửa câu hỏi' : 'Thêm câu hỏi'} onSave={saveQuestion} formData={formData} setFormData={setFormData} setShowForm={setShowForm} fields={getQuestionFields(false)} />
      )}
      {showForm && view === 'placement' && (
        <FormModal title={editItem ? 'Sửa câu hỏi test đầu vào' : 'Thêm câu hỏi test đầu vào'} onSave={savePlacementQuestion} formData={formData} setFormData={setFormData} setShowForm={setShowForm} fields={getQuestionFields(true)} />
      )}
    </div>
  );
}

export default AdminGames;