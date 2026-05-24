import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit2,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const SKILL_META = {
  listening: {
    title: 'Quản lý Listening',
    childLabel: 'Transcript',
    childPath: 'segments',
    childAddLabel: 'Thêm dòng nghe',
    accent: '#0e7490'
  },
  reading: {
    title: 'Quản lý Reading',
    childLabel: 'Đoạn đọc',
    childPath: 'paragraphs',
    childAddLabel: 'Thêm đoạn đọc',
    accent: '#7c3aed'
  }
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

const emptyLesson = {
  Title: '',
  Description: '',
  Level: 'A1',
  Topic: '',
  Objective: '',
  Duration: '',
  PassageTitle: '',
  AudioUrl: '',
  OrderIndex: 0
};

const emptyQuestion = {
  QuestionType: 'multiple_choice',
  Prompt: '',
  OptionA: '',
  OptionB: '',
  OptionC: '',
  OptionD: '',
  CorrectAnswer: '',
  CorrectBoolean: true,
  AcceptedAnswers: '',
  Explanation: '',
  OrderIndex: 0
};

function AdminReceptive({ skill }) {
  const meta = SKILL_META[skill];
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [vocabItems, setVocabItems] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);

  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentForm, setContentForm] = useState({ Speaker: '', Text: '', Content: '', StartSecond: '', EndSecond: '', OrderIndex: 0 });

  const [showVocabForm, setShowVocabForm] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [vocabForm, setVocabForm] = useState({ Word: '', Meaning: '', OrderIndex: 0 });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);

  useEffect(() => {
    setSelectedLesson(null);
    setContentItems([]);
    setVocabItems([]);
    setQuestions([]);
    closeLessonForm();
    fetchLessons();
  }, [skill]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/${skill}/lessons`, { headers: authHeaders() });
      setLessons(res.data.data || []);
    } catch (err) {
      toast.error(`Lỗi tải danh sách ${skill}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonChildren = async (lessonId) => {
    try {
      const [contentRes, vocabRes, questionRes] = await Promise.all([
        axios.get(`${API_URL}/admin/${skill}/lessons/${lessonId}/${meta.childPath}`, { headers: authHeaders() }),
        axios.get(`${API_URL}/admin/${skill}/lessons/${lessonId}/vocab`, { headers: authHeaders() }),
        axios.get(`${API_URL}/admin/${skill}/lessons/${lessonId}/questions`, { headers: authHeaders() })
      ]);
      setContentItems(contentRes.data.data || []);
      setVocabItems(vocabRes.data.data || []);
      setQuestions(questionRes.data.data || []);
    } catch (err) {
      toast.error('Lỗi tải nội dung bài học');
    }
  };

  const selectLesson = (lesson) => {
    if (selectedLesson?.Id === lesson.Id) {
      setSelectedLesson(null);
      setContentItems([]);
      setVocabItems([]);
      setQuestions([]);
      return;
    }

    setSelectedLesson(lesson);
    closeChildForms();
    fetchLessonChildren(lesson.Id);
  };

  const updateLessonField = (field, value) => {
    setLessonForm((current) => ({ ...current, [field]: value }));
  };

  const updateContentField = (field, value) => {
    setContentForm((current) => ({ ...current, [field]: value }));
  };

  const updateQuestionField = (field, value) => {
    setQuestionForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.Title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài học');
      return;
    }

    try {
      if (editingLesson) {
        await axios.put(`${API_URL}/admin/${skill}/lessons/${editingLesson.Id}`, lessonForm, { headers: authHeaders() });
        toast.success('Đã cập nhật bài học');
      } else {
        await axios.post(`${API_URL}/admin/${skill}/lessons`, lessonForm, { headers: authHeaders() });
        toast.success('Đã tạo bài học mới');
      }
      closeLessonForm();
      fetchLessons();
    } catch (err) {
      toast.error('Lỗi lưu bài học');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Xóa bài học này và toàn bộ nội dung liên quan?')) return;
    try {
      await axios.delete(`${API_URL}/admin/${skill}/lessons/${lessonId}`, { headers: authHeaders() });
      toast.success('Đã xóa bài học');
      if (selectedLesson?.Id === lessonId) setSelectedLesson(null);
      fetchLessons();
    } catch (err) {
      toast.error('Lỗi xóa bài học');
    }
  };

  const handleSaveContent = async () => {
    if (!selectedLesson) return;
    const payload = {
      ...contentForm,
      LessonId: selectedLesson.Id
    };

    if (skill === 'listening' && !payload.Text.trim()) {
      toast.error('Vui lòng nhập nội dung transcript');
      return;
    }
    if (skill === 'reading' && !payload.Content.trim()) {
      toast.error('Vui lòng nhập đoạn đọc');
      return;
    }

    try {
      if (editingContent) {
        await axios.put(`${API_URL}/admin/${skill}/${meta.childPath}/${editingContent.Id}`, payload, { headers: authHeaders() });
        toast.success('Đã cập nhật nội dung');
      } else {
        await axios.post(`${API_URL}/admin/${skill}/${meta.childPath}`, payload, { headers: authHeaders() });
        toast.success('Đã thêm nội dung');
      }
      closeContentForm();
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi lưu nội dung');
    }
  };

  const handleDeleteContent = async (itemId) => {
    if (!window.confirm('Xóa mục nội dung này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/${skill}/${meta.childPath}/${itemId}`, { headers: authHeaders() });
      toast.success('Đã xóa nội dung');
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi xóa nội dung');
    }
  };

  const handleSaveVocab = async () => {
    if (!selectedLesson) return;
    if (!vocabForm.Word.trim()) {
      toast.error('Vui lòng nhập từ vựng');
      return;
    }

    const payload = { ...vocabForm, LessonId: selectedLesson.Id };
    try {
      if (editingVocab) {
        await axios.put(`${API_URL}/admin/${skill}/vocab/${editingVocab.Id}`, payload, { headers: authHeaders() });
        toast.success('Đã cập nhật từ vựng');
      } else {
        await axios.post(`${API_URL}/admin/${skill}/vocab`, payload, { headers: authHeaders() });
        toast.success('Đã thêm từ vựng');
      }
      closeVocabForm();
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi lưu từ vựng');
    }
  };

  const handleDeleteVocab = async (itemId) => {
    if (!window.confirm('Xóa từ vựng này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/${skill}/vocab/${itemId}`, { headers: authHeaders() });
      toast.success('Đã xóa từ vựng');
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi xóa từ vựng');
    }
  };

  const handleSaveQuestion = async () => {
    if (!selectedLesson) return;
    if (!questionForm.Prompt.trim()) {
      toast.error('Vui lòng nhập câu hỏi');
      return;
    }

    const payload = { ...questionForm, LessonId: selectedLesson.Id };
    try {
      if (editingQuestion) {
        await axios.put(`${API_URL}/admin/${skill}/questions/${editingQuestion.Id}`, payload, { headers: authHeaders() });
        toast.success('Đã cập nhật câu hỏi');
      } else {
        await axios.post(`${API_URL}/admin/${skill}/questions`, payload, { headers: authHeaders() });
        toast.success('Đã thêm câu hỏi');
      }
      closeQuestionForm();
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi lưu câu hỏi');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/${skill}/questions/${questionId}`, { headers: authHeaders() });
      toast.success('Đã xóa câu hỏi');
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi xóa câu hỏi');
    }
  };

  const closeLessonForm = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    setLessonForm(emptyLesson);
  };

  const closeContentForm = () => {
    setShowContentForm(false);
    setEditingContent(null);
    setContentForm({ Speaker: '', Text: '', Content: '', StartSecond: '', EndSecond: '', OrderIndex: 0 });
  };

  const closeVocabForm = () => {
    setShowVocabForm(false);
    setEditingVocab(null);
    setVocabForm({ Word: '', Meaning: '', OrderIndex: 0 });
  };

  const closeQuestionForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
    setQuestionForm(emptyQuestion);
  };

  const closeChildForms = () => {
    closeContentForm();
    closeVocabForm();
    closeQuestionForm();
  };

  const startEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      Title: lesson.Title || '',
      Description: lesson.Description || '',
      Level: lesson.Level || 'A1',
      Topic: lesson.Topic || '',
      Objective: lesson.Objective || '',
      Duration: lesson.Duration || '',
      PassageTitle: lesson.PassageTitle || '',
      AudioUrl: lesson.AudioUrl || '',
      OrderIndex: lesson.OrderIndex || 0
    });
    setShowLessonForm(true);
  };

  const startEditContent = (item) => {
    setEditingContent(item);
    setContentForm({
      Speaker: item.Speaker || '',
      Text: item.Text || '',
      Content: item.Content || '',
      StartSecond: item.StartSecond ?? '',
      EndSecond: item.EndSecond ?? '',
      OrderIndex: item.OrderIndex || 0
    });
    setShowContentForm(true);
  };

  const startEditVocab = (item) => {
    setEditingVocab(item);
    setVocabForm({
      Word: item.Word || '',
      Meaning: item.Meaning || '',
      OrderIndex: item.OrderIndex || 0
    });
    setShowVocabForm(true);
  };

  const startEditQuestion = (item) => {
    setEditingQuestion(item);
    setQuestionForm({
      QuestionType: item.QuestionType || 'multiple_choice',
      Prompt: item.Prompt || '',
      OptionA: item.OptionA || '',
      OptionB: item.OptionB || '',
      OptionC: item.OptionC || '',
      OptionD: item.OptionD || '',
      CorrectAnswer: item.CorrectAnswer || '',
      CorrectBoolean: Boolean(item.CorrectBoolean),
      AcceptedAnswers: item.AcceptedAnswers || '',
      Explanation: item.Explanation || '',
      OrderIndex: item.OrderIndex || 0
    });
    setShowQuestionForm(true);
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="fade-in admin-receptive-page" style={{ '--admin-skill-color': meta.accent }}>
      <div className="admin-receptive-header">
        <div>
          <h1>{meta.title}</h1>
          <p>Quản lý bài học, nội dung, từ vựng và câu hỏi kiểm tra cho khóa {skill}.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowLessonForm(true)}>
          <FiPlus /> Thêm bài học
        </button>
      </div>

      {showLessonForm && (
        <div className="admin-receptive-form">
          <h3>{editingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}</h3>
          <div className="admin-form-grid">
            <label>
              <span>Tiêu đề</span>
              <input className="form-input" value={lessonForm.Title} onChange={(event) => updateLessonField('Title', event.target.value)} />
            </label>
            <label>
              <span>Cấp độ</span>
              <select className="form-input" value={lessonForm.Level} onChange={(event) => updateLessonField('Level', event.target.value)}>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </label>
            <label>
              <span>Chủ đề</span>
              <input className="form-input" value={lessonForm.Topic} onChange={(event) => updateLessonField('Topic', event.target.value)} />
            </label>
            <label>
              <span>Thời lượng</span>
              <input className="form-input" value={lessonForm.Duration} onChange={(event) => updateLessonField('Duration', event.target.value)} placeholder="VD: 10 phút" />
            </label>
            {skill === 'reading' && (
              <label>
                <span>Tiêu đề bài đọc</span>
                <input className="form-input" value={lessonForm.PassageTitle} onChange={(event) => updateLessonField('PassageTitle', event.target.value)} />
              </label>
            )}
            {skill === 'listening' && (
              <label>
                <span>Audio URL</span>
                <input className="form-input" value={lessonForm.AudioUrl} onChange={(event) => updateLessonField('AudioUrl', event.target.value)} />
              </label>
            )}
            <label>
              <span>Thứ tự</span>
              <input className="form-input" type="number" value={lessonForm.OrderIndex} onChange={(event) => updateLessonField('OrderIndex', event.target.value)} />
            </label>
            <label className="is-wide">
              <span>Mô tả</span>
              <textarea className="form-input" rows={2} value={lessonForm.Description} onChange={(event) => updateLessonField('Description', event.target.value)} />
            </label>
            <label className="is-wide">
              <span>Mục tiêu</span>
              <textarea className="form-input" rows={2} value={lessonForm.Objective} onChange={(event) => updateLessonField('Objective', event.target.value)} />
            </label>
          </div>
          <div className="admin-form-actions">
            <button className="btn btn-primary" onClick={handleSaveLesson}><FiSave /> Lưu</button>
            <button className="btn btn-ghost" onClick={closeLessonForm}><FiX /> Hủy</button>
          </div>
        </div>
      )}

      <div className="admin-receptive-list">
        {lessons.map((lesson) => (
          <div key={lesson.Id} className={`admin-receptive-card ${selectedLesson?.Id === lesson.Id ? 'is-active' : ''}`}>
            <div className="admin-receptive-card-head">
              <button className="admin-receptive-title" onClick={() => selectLesson(lesson)}>
                {selectedLesson?.Id === lesson.Id ? <FiChevronDown /> : <FiChevronRight />}
                <div>
                  <strong>{lesson.Title}</strong>
                  <span>{lesson.Level || 'A1'} · {lesson.Topic || 'Chưa có chủ đề'} · {lesson.Duration || 'Chưa đặt thời lượng'}</span>
                  {lesson.Description && <p>{lesson.Description}</p>}
                </div>
              </button>
              <div className="admin-inline-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => startEditLesson(lesson)}><FiEdit2 /></button>
                <button className="btn btn-ghost btn-sm is-danger" onClick={() => handleDeleteLesson(lesson.Id)}><FiTrash2 /></button>
              </div>
            </div>

            {selectedLesson?.Id === lesson.Id && (
              <div className="admin-receptive-detail">
                <AdminPanel
                  title={meta.childLabel}
                  actionLabel={meta.childAddLabel}
                  onAdd={() => setShowContentForm(true)}
                >
                  {showContentForm && (
                    <ContentForm
                      skill={skill}
                      form={contentForm}
                      editing={editingContent}
                      onChange={updateContentField}
                      onSave={handleSaveContent}
                      onCancel={closeContentForm}
                    />
                  )}
                  <div className="admin-item-list">
                    {contentItems.map((item) => (
                      <AdminItem key={item.Id} onEdit={() => startEditContent(item)} onDelete={() => handleDeleteContent(item.Id)}>
                        {skill === 'listening' ? (
                          <>
                            <strong>{item.Speaker || 'Narrator'}</strong>
                            <p>{item.Text}</p>
                          </>
                        ) : (
                          <p>{item.Content}</p>
                        )}
                      </AdminItem>
                    ))}
                    {contentItems.length === 0 && !showContentForm && <EmptyState text="Chưa có nội dung." />}
                  </div>
                </AdminPanel>

                <AdminPanel title="Từ vựng" actionLabel="Thêm từ" onAdd={() => setShowVocabForm(true)}>
                  {showVocabForm && (
                    <VocabForm
                      form={vocabForm}
                      editing={editingVocab}
                      onChange={(field, value) => setVocabForm((current) => ({ ...current, [field]: value }))}
                      onSave={handleSaveVocab}
                      onCancel={closeVocabForm}
                    />
                  )}
                  <div className="admin-chip-list">
                    {vocabItems.map((item) => (
                      <span key={item.Id}>
                        <strong>{item.Word}</strong>: {item.Meaning}
                        <button onClick={() => startEditVocab(item)}><FiEdit2 /></button>
                        <button onClick={() => handleDeleteVocab(item.Id)}><FiX /></button>
                      </span>
                    ))}
                    {vocabItems.length === 0 && !showVocabForm && <EmptyState text="Chưa có từ vựng." />}
                  </div>
                </AdminPanel>

                <AdminPanel title="Câu hỏi" actionLabel="Thêm câu hỏi" onAdd={() => setShowQuestionForm(true)}>
                  {showQuestionForm && (
                    <QuestionForm
                      form={questionForm}
                      editing={editingQuestion}
                      onChange={updateQuestionField}
                      onSave={handleSaveQuestion}
                      onCancel={closeQuestionForm}
                    />
                  )}
                  <div className="admin-item-list">
                    {questions.map((item) => (
                      <AdminItem key={item.Id} onEdit={() => startEditQuestion(item)} onDelete={() => handleDeleteQuestion(item.Id)}>
                        <strong>{item.Prompt}</strong>
                        <p>{item.QuestionType} · Đáp án: {item.QuestionType === 'true_false' ? String(item.CorrectBoolean) : item.CorrectAnswer}</p>
                      </AdminItem>
                    ))}
                    {questions.length === 0 && !showQuestionForm && <EmptyState text="Chưa có câu hỏi." />}
                  </div>
                </AdminPanel>
              </div>
            )}
          </div>
        ))}
        {lessons.length === 0 && <EmptyState text="Chưa có bài học nào." />}
      </div>
    </div>
  );
}

function AdminPanel({ title, actionLabel, onAdd, children }) {
  return (
    <section className="admin-subpanel">
      <div className="admin-subpanel-head">
        <h3>{title}</h3>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><FiPlus /> {actionLabel}</button>
      </div>
      {children}
    </section>
  );
}

function AdminItem({ children, onEdit, onDelete }) {
  return (
    <div className="admin-list-item">
      <div>{children}</div>
      <div className="admin-inline-actions">
        <button className="btn btn-ghost btn-sm" onClick={onEdit}><FiEdit2 /></button>
        <button className="btn btn-ghost btn-sm is-danger" onClick={onDelete}><FiTrash2 /></button>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="admin-empty-inline">{text}</div>;
}

function ContentForm({ skill, form, editing, onChange, onSave, onCancel }) {
  return (
    <div className="admin-nested-form">
      <div className="admin-form-grid">
        {skill === 'listening' ? (
          <>
            <label>
              <span>Người nói</span>
              <input className="form-input" value={form.Speaker} onChange={(event) => onChange('Speaker', event.target.value)} />
            </label>
            <label>
              <span>Thứ tự</span>
              <input className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
            </label>
            <label>
              <span>Bắt đầu giây</span>
              <input className="form-input" type="number" value={form.StartSecond} onChange={(event) => onChange('StartSecond', event.target.value)} />
            </label>
            <label>
              <span>Kết thúc giây</span>
              <input className="form-input" type="number" value={form.EndSecond} onChange={(event) => onChange('EndSecond', event.target.value)} />
            </label>
            <label className="is-wide">
              <span>Nội dung transcript</span>
              <textarea className="form-input" rows={3} value={form.Text} onChange={(event) => onChange('Text', event.target.value)} />
            </label>
          </>
        ) : (
          <>
            <label>
              <span>Thứ tự</span>
              <input className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
            </label>
            <label className="is-wide">
              <span>Nội dung đoạn đọc</span>
              <textarea className="form-input" rows={4} value={form.Content} onChange={(event) => onChange('Content', event.target.value)} />
            </label>
          </>
        )}
      </div>
      <FormActions editing={editing} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function VocabForm({ form, editing, onChange, onSave, onCancel }) {
  return (
    <div className="admin-nested-form">
      <div className="admin-form-grid">
        <label>
          <span>Từ</span>
          <input className="form-input" value={form.Word} onChange={(event) => onChange('Word', event.target.value)} />
        </label>
        <label>
          <span>Nghĩa</span>
          <input className="form-input" value={form.Meaning} onChange={(event) => onChange('Meaning', event.target.value)} />
        </label>
        <label>
          <span>Thứ tự</span>
          <input className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
        </label>
      </div>
      <FormActions editing={editing} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function QuestionForm({ form, editing, onChange, onSave, onCancel }) {
  const isBoolean = form.QuestionType === 'true_false';
  const isBlank = form.QuestionType === 'fill_blank';

  return (
    <div className="admin-nested-form">
      <div className="admin-form-grid">
        <label>
          <span>Loại câu hỏi</span>
          <select className="form-input" value={form.QuestionType} onChange={(event) => onChange('QuestionType', event.target.value)}>
            <option value="multiple_choice">Multiple choice</option>
            <option value="true_false">True / False</option>
            <option value="fill_blank">Fill blank</option>
          </select>
        </label>
        <label>
          <span>Thứ tự</span>
          <input className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
        </label>
        <label className="is-wide">
          <span>Câu hỏi</span>
          <textarea className="form-input" rows={2} value={form.Prompt} onChange={(event) => onChange('Prompt', event.target.value)} />
        </label>
        {!isBoolean && !isBlank && (
          <>
            <label>
              <span>Option A</span>
              <input className="form-input" value={form.OptionA} onChange={(event) => onChange('OptionA', event.target.value)} />
            </label>
            <label>
              <span>Option B</span>
              <input className="form-input" value={form.OptionB} onChange={(event) => onChange('OptionB', event.target.value)} />
            </label>
            <label>
              <span>Option C</span>
              <input className="form-input" value={form.OptionC} onChange={(event) => onChange('OptionC', event.target.value)} />
            </label>
            <label>
              <span>Option D</span>
              <input className="form-input" value={form.OptionD} onChange={(event) => onChange('OptionD', event.target.value)} />
            </label>
          </>
        )}
        {isBoolean ? (
          <label>
            <span>Đáp án</span>
            <select className="form-input" value={String(form.CorrectBoolean)} onChange={(event) => onChange('CorrectBoolean', event.target.value === 'true')}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
        ) : (
          <label>
            <span>Đáp án đúng</span>
            <input className="form-input" value={form.CorrectAnswer} onChange={(event) => onChange('CorrectAnswer', event.target.value)} />
          </label>
        )}
        {isBlank && (
          <label className="is-wide">
            <span>Đáp án chấp nhận thêm</span>
            <textarea className="form-input" rows={2} value={form.AcceptedAnswers} onChange={(event) => onChange('AcceptedAnswers', event.target.value)} placeholder="Mỗi đáp án một dòng hoặc cách nhau bằng dấu phẩy" />
          </label>
        )}
        <label className="is-wide">
          <span>Giải thích</span>
          <textarea className="form-input" rows={2} value={form.Explanation} onChange={(event) => onChange('Explanation', event.target.value)} />
        </label>
      </div>
      <FormActions editing={editing} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function FormActions({ editing, onSave, onCancel }) {
  return (
    <div className="admin-form-actions">
      <button className="btn btn-primary btn-sm" onClick={onSave}><FiSave /> {editing ? 'Cập nhật' : 'Lưu'}</button>
      <button className="btn btn-ghost btn-sm" onClick={onCancel}><FiX /> Hủy</button>
    </div>
  );
}

export default AdminReceptive;
