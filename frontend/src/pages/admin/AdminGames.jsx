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
const DIFFICULTY_LABELS = { easy: 'Dễ', hard: 'Khó' };
const PLACEMENT_EASY_TARGET = 2;
const PLACEMENT_HARD_TARGET = 1;

function normalizeOptions(optionsText) {
  if (Array.isArray(optionsText)) return optionsText;
  const rawValue = String(optionsText || '').trim();
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Admins normally enter comma-separated text.
  }

  return rawValue.split(',').map((item) => item.trim()).filter(Boolean);
}

function uniqueOptions(options) {
  const seen = new Set();
  return options
    .filter((option) => {
      const value = String(option || '').trim();
      const key = value.toLocaleLowerCase('vi');
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((option) => String(option).trim());
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
    if (!finalCorrectAnswer && !finalContentEN) throw new Error('Dạng xếp câu cần có câu tiếng Anh hoàn chỉnh.');
    finalCorrectAnswer = finalCorrectAnswer || finalContentEN;
    finalContentEN = finalCorrectAnswer;
    const words = finalCorrectAnswer.split(/\s+/).map((word) => word.trim()).filter(Boolean);
    finalOptions = uniqueOptions([...words, ...finalOptions]);
  } else if (qType === 'listening') {
    if (!finalCorrectAnswer && !finalContentEN) throw new Error('Dạng nghe chọn cần có nội dung được đọc.');
    finalCorrectAnswer = finalCorrectAnswer || finalContentEN;
    finalContentEN = finalCorrectAnswer;
    finalOptions = uniqueOptions([finalCorrectAnswer, ...finalOptions]);
  } else if (qType === 'truefalse') {
    if (!finalContentEN || !finalContentVI) throw new Error('Dạng đúng/sai cần đủ câu tiếng Anh và bản dịch.');
    finalOptions = [];
    finalCorrectAnswer = formData.correctAnswer === 'false' ? 'false' : 'true';
  } else if (qType === 'speakrepeat') {
    if (!finalCorrectAnswer && !finalContentEN) throw new Error('Dạng đọc câu cần có câu mẫu.');
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

function FormModal({ title, fields, onSave, formData, setFormData, setShowForm }) {
  return (
    <div className="admin-modal-backdrop" onClick={() => setShowForm(false)}>
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(event) => event.stopPropagation()}
        className="admin-modal-panel"
        style={{ width: 'min(560px, 100%)' }}
      >
        <div className="admin-subpanel-head">
          <h3>{title}</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Đóng</button>
        </div>
        <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr', padding: 16 }}>
          {fields.map((field) => (
            <label key={field.key}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select className="form-input" value={formData[field.key] ?? ''} onChange={(event) => setFormData((prev) => ({ ...prev, [field.key]: event.target.value }))}>
                  {field.options.map((option) => <option key={option.value || option} value={option.value || option}>{option.label || option}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea className="form-input" rows={3} value={formData[field.key] ?? ''} onChange={(event) => setFormData((prev) => ({ ...prev, [field.key]: event.target.value }))} placeholder={field.placeholder || ''} />
              ) : (
                <input className="form-input" type={field.type || 'text'} value={formData[field.key] ?? ''} onChange={(event) => setFormData((prev) => ({ ...prev, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value }))} placeholder={field.placeholder || ''} />
              )}
            </label>
          ))}
          <div className="admin-form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            <button type="button" className="btn btn-primary" onClick={onSave}><FiSave /> Lưu</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
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

  useEffect(() => {
    loadLevels();
    loadPlacementQuestions();
  }, []);

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
    } catch (err) {
      toast.error(`Lỗi lưu câu hỏi: ${err.message}`);
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

  const openPlacementForm = (q = null, difficulty = 'easy') => {
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
      : { questionType: 'matching', contentEN: '', contentVI: '', audioUrl: '', imageUrl: '', correctAnswer: '', options: '', passScore: 70, difficulty, pointRatio: difficulty === 'hard' ? 1.35 : 1, activeStatus: 'active', orderIndex: placementQuestions.length + 1 });
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
    } catch (err) {
      toast.error(`Lỗi lưu câu hỏi test: ${err.message}`);
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
      { key: 'questionType', label: 'Loại câu hỏi', type: 'select', options: QUESTION_TYPES.map((type) => ({ value: type, label: TYPE_LABELS[type] })) },
      { key: 'orderIndex', label: 'Thứ tự', type: 'number' }
    ];

    if (includePlacementFields) {
      fields.push(
        { key: 'difficulty', label: 'Độ khó', type: 'select', options: [{ value: 'easy', label: 'Dễ' }, { value: 'hard', label: 'Khó' }] },
        { key: 'pointRatio', label: 'Tỉ số điểm', type: 'number' },
        { key: 'activeStatus', label: 'Trạng thái', type: 'select', options: [{ value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Tạm ẩn' }] }
      );
    }

    if (qType === 'matching') return [...fields, { key: 'contentEN', label: 'Từ tiếng Anh', placeholder: 'apple' }, { key: 'contentVI', label: 'Nghĩa đúng', placeholder: 'quả táo' }, { key: 'options', label: 'Lựa chọn khác, cách nhau bằng dấu phẩy', placeholder: 'quả chuối, quyển sách' }];
    if (qType === 'listening') return [...fields, { key: 'correctAnswer', label: 'Câu sẽ được đọc', placeholder: 'Good morning' }, { key: 'contentVI', label: 'Nghĩa tiếng Việt', placeholder: 'Chào buổi sáng' }, { key: 'options', label: 'Đáp án sai, cách nhau bằng dấu phẩy', placeholder: 'Good night, Good evening' }];
    if (qType === 'listenbuild') return [...fields, { key: 'correctAnswer', label: 'Câu tiếng Anh hoàn chỉnh', placeholder: 'I go to school' }, { key: 'contentVI', label: 'Gợi ý tiếng Việt', placeholder: 'Tôi đi học' }, { key: 'options', label: 'Từ gây nhiễu thêm', placeholder: 'goes, going' }];
    if (qType === 'truefalse') return [...fields, { key: 'contentEN', label: 'Câu tiếng Anh', placeholder: 'The dog is black' }, { key: 'contentVI', label: 'Bản dịch hiển thị', placeholder: 'Con chó màu trắng' }, { key: 'correctAnswer', label: 'Đáp án', type: 'select', options: ['true', 'false'] }];
    if (qType === 'speakrepeat') return [...fields, { key: 'correctAnswer', label: 'Câu cần đọc', placeholder: 'I can help you' }, { key: 'contentVI', label: 'Nghĩa tiếng Việt', placeholder: 'Tôi có thể giúp bạn' }, { key: 'passScore', label: 'Điểm nói đạt (%)', type: 'number' }];
    return fields;
  };

  const activePlacementCount = useMemo(() => placementQuestions.filter((q) => q.IsActive).length, [placementQuestions]);
  const placementQuestionGroups = useMemo(() => ({
    easy: placementQuestions.filter((q) => (q.Difficulty || 'easy') === 'easy'),
    hard: placementQuestions.filter((q) => (q.Difficulty || 'easy') === 'hard')
  }), [placementQuestions]);
  const placementTypeSummary = useMemo(() => QUESTION_TYPES.map((type) => {
    const easy = placementQuestions.filter((q) => q.IsActive && q.QuestionType === type && (q.Difficulty || 'easy') === 'easy').length;
    const hard = placementQuestions.filter((q) => q.IsActive && q.QuestionType === type && (q.Difficulty || 'easy') === 'hard').length;
    return { type, easy, hard, ready: easy >= PLACEMENT_EASY_TARGET && hard >= PLACEMENT_HARD_TARGET };
  }), [placementQuestions]);

  const renderQuestionRow = (q, actions, extra = null) => {
    const mainText = q.QuestionType === 'truefalse' || q.QuestionType === 'listenbuild' || q.QuestionType === 'speakrepeat'
      ? q.CorrectAnswer
      : (q.ContentEN || q.CorrectAnswer);

    return (
      <div key={q.Id} className="admin-list-item">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{TYPE_LABELS[q.QuestionType] || q.QuestionType}</span>
            {extra}
          </div>
          <strong style={{ color: 'var(--admin-primary)', fontSize: 14, wordBreak: 'break-word' }}>{mainText}</strong>
          {q.ContentVI && <p style={{ fontSize: 13, marginTop: 4 }}>{q.ContentVI}</p>}
          {Array.isArray(q.Options) && q.Options.length > 0 && (
            <div style={{ fontSize: 11, color: 'var(--admin-muted)', marginTop: 4 }}>
              Options: {q.Options.join(' | ')}
            </div>
          )}
        </div>
        <div className="admin-inline-actions" style={{ flexShrink: 0 }}>
          {actions}
        </div>
      </div>
    );
  };

  const renderPlacementColumn = (difficulty) => (
    <section className="placement-bank-column" key={difficulty}>
      <div className="placement-bank-column-head">
        <h4>{DIFFICULTY_LABELS[difficulty]}</h4>
        <div>
          <span>{placementQuestionGroups[difficulty].length} câu</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openPlacementForm(null, difficulty)}>
            <FiPlus /> Thêm câu {DIFFICULTY_LABELS[difficulty].toLowerCase()}
          </button>
        </div>
      </div>
      <div className="admin-item-list">
        {placementQuestionGroups[difficulty].map((q) => renderQuestionRow(
          q,
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => openPlacementForm(q)}>Sửa</button>
            <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={() => deletePlacementQuestion(q.Id)}>Xóa</button>
          </>,
          <>
            <span className={`badge ${q.IsActive ? 'is-active' : 'is-locked'}`} style={{ color: q.IsActive ? 'var(--admin-success)' : 'var(--admin-danger)' }}>{q.IsActive ? 'Hoạt động' : 'Tạm ẩn'}</span>
            <span className="badge badge-secondary">{TYPE_LABELS[q.QuestionType] || q.QuestionType}</span>
            <span className="badge badge-secondary">x{Number(q.PointRatio || 1).toFixed(2)}</span>
          </>
        ))}
        {placementQuestionGroups[difficulty].length === 0 && <div className="admin-empty-inline">Chưa có câu {DIFFICULTY_LABELS[difficulty].toLowerCase()}.</div>}
      </div>
    </section>
  );

  return (
    <div className="fade-in admin-receptive-page">
      <div className="admin-receptive-header">
        <div>
          <h1>Quản lý Mini game</h1>
          <p>Quản lý màn chơi và ngân hàng câu hỏi riêng cho bài test đầu vào.</p>
        </div>
        <div className="admin-inline-actions">
          {view !== 'levels' && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setView('levels'); setActiveLevel(null); }}><FiArrowLeft /> Cấp độ</button>}
          {view === 'levels' && <button type="button" className="btn btn-primary btn-sm" onClick={() => openLevelForm()}><FiPlus /> Thêm level</button>}
        </div>
      </div>

      <div className="admin-inline-actions" style={{ marginBottom: 'var(--space-2)', justifyContent: 'flex-start' }}>
        <button type="button" className={`btn ${view !== 'placement' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setView('levels'); setActiveLevel(null); }}>Mini game</button>
        <button type="button" className={`btn ${view === 'placement' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('placement')}>Bài test đầu vào ({activePlacementCount})</button>
      </div>

      {view === 'levels' && (
        <section className="admin-receptive-list">
          {levels.length === 0 && <div className="admin-empty-inline">Chưa có level mini game nào.</div>}
          {levels.map((level) => (
            <div key={level.Id} className="admin-receptive-card">
              <div className="admin-receptive-card-head" style={{ border: 0 }}>
                <button type="button" className="admin-receptive-title" onClick={() => loadQuestions(level)} style={{ cursor: 'pointer' }}>
                  <strong>Level {level.LevelNumber}: {level.Name}</strong>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    <span className="badge badge-secondary">{level.QuestionCount} câu</span>
                    <span className="badge badge-secondary">{level.TimeLimit}s</span>
                    <span className="badge badge-secondary">Đạt {level.PassScore}%</span>
                  </div>
                </button>
                <div className="admin-inline-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openLevelForm(level)}>Sửa</button>
                  <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={() => deleteLevel(level.Id)}>Xóa</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => loadQuestions(level)}>Câu hỏi</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {view === 'questions' && (
        <section className="admin-subpanel" style={{ padding: '14px 16px' }}>
          <div className="admin-subpanel-head" style={{ margin: '-14px -16px var(--space-4) -16px' }}>
            <div>
              <h3>Level {activeLevel?.LevelNumber}: {activeLevel?.Name}</h3>
              <p style={{ display: 'block', fontSize: 12, color: 'var(--admin-muted)', marginTop: 4 }}>Danh sách câu hỏi của màn chơi.</p>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => openQuestionForm()}><FiPlus /> Thêm câu hỏi</button>
          </div>
          <div className="admin-item-list">
            {questions.map((q) => renderQuestionRow(
              q,
              <>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openQuestionForm(q)}>Sửa</button>
                <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={() => deleteQuestion(q.Id)}>Xóa</button>
              </>
            ))}
            {questions.length === 0 && <div className="admin-empty-inline">Chưa có câu hỏi nào.</div>}
          </div>
        </section>
      )}

      {view === 'placement' && (
        <section className="admin-subpanel" style={{ padding: '14px 16px' }}>
          <div className="admin-subpanel-head" style={{ margin: '-14px -16px var(--space-4) -16px' }}>
            <div>
              <h3>Bài test đầu vào</h3>
              <p style={{ display: 'block', fontSize: 12, color: 'var(--admin-muted)', marginTop: 4 }}>Mỗi lượt test bốc ngẫu nhiên 2 câu dễ và 1 câu khó cho từng dạng câu hỏi đủ ngân hàng.</p>
            </div>
          </div>

          <div className="placement-bank-summary">
            {placementTypeSummary.map((item) => (
              <article key={item.type} className={item.ready ? 'is-ready' : 'is-missing'}>
                <strong>{TYPE_LABELS[item.type] || item.type}</strong>
                <span>Dễ {item.easy}/{PLACEMENT_EASY_TARGET}</span>
                <span>Khó {item.hard}/{PLACEMENT_HARD_TARGET}</span>
              </article>
            ))}
          </div>

          <div className="placement-bank-grid">
            {renderPlacementColumn('easy')}
            {renderPlacementColumn('hard')}
          </div>
        </section>
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
