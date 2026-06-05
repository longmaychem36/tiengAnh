import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiChevronRight, FiChevronDown, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AdminSpeaking = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Lesson state
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonOrder, setLessonOrder] = useState(0);

  // Question state
  const [questionText, setQuestionText] = useState('');
  const [questionTrans, setQuestionTrans] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt1vi, setOpt1vi] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt2vi, setOpt2vi] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt3vi, setOpt3vi] = useState('');
  const [qOrder, setQOrder] = useState(0);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/speaking/lessons`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLessons(res.data.data);
    } catch (err) {
      toast.error('Lỗi tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (lessonId) => {
    try {
      const res = await axios.get(`${API_URL}/admin/speaking/lessons/${lessonId}/questions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuestions(res.data.data);
    } catch (err) {
      toast.error('Lỗi tải câu hỏi');
    }
  };

  const getNextLessonOrder = () => (
    lessons.length ? Math.max(...lessons.map((lesson) => Number(lesson.OrderIndex || 0))) + 1 : 1
  );

  const openNewLessonForm = () => {
    setEditingLesson(null);
    setLessonTitle('');
    setLessonDesc('');
    setLessonOrder(getNextLessonOrder());
    setShowLessonForm(true);
  };

  const buildLessonPayload = (lesson, orderIndex = lesson.OrderIndex) => ({
    Title: lesson.Title,
    Description: lesson.Description || '',
    OrderIndex: orderIndex
  });

  const handleMoveLesson = async (lessonId, direction) => {
    const ordered = [...lessons].sort((a, b) => Number(a.OrderIndex || 0) - Number(b.OrderIndex || 0));
    const currentIndex = ordered.findIndex((lesson) => lesson.Id === lessonId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ordered.length) return;

    const moved = [...ordered];
    [moved[currentIndex], moved[nextIndex]] = [moved[nextIndex], moved[currentIndex]];

    try {
      await Promise.all(moved.map((lesson, index) => (
        axios.put(`${API_URL}/admin/speaking/lessons/${lesson.Id}`, buildLessonPayload(lesson, index + 1), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      )));
      toast.success('Đã cập nhật thứ tự bài học');
      fetchLessons();
    } catch (err) {
      toast.error('Lỗi cập nhật thứ tự bài học');
    }
  };

  const handleSaveLesson = async () => {
    try {
      const data = { Title: lessonTitle, Description: lessonDesc, OrderIndex: lessonOrder };
      if (editingLesson) {
        await axios.put(`${API_URL}/admin/speaking/lessons/${editingLesson.Id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Đã cập nhật bài học');
      } else {
        await axios.post(`${API_URL}/admin/speaking/lessons`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Đã tạo bài học mới');
      }
      fetchLessons();
      closeLessonForm();
    } catch (err) {
      toast.error('Lỗi lưu bài học');
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/speaking/lessons/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Đã xóa bài học');
      fetchLessons();
      if (selectedLesson?.Id === id) setSelectedLesson(null);
    } catch (err) {
      toast.error('Lỗi xóa bài học (Yêu cầu quyền SuperAdmin)');
    }
  };

  const closeLessonForm = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    setLessonTitle('');
    setLessonDesc('');
    setLessonOrder(0);
  };

  const handleSelectLesson = (lesson) => {
    if (selectedLesson?.Id === lesson.Id) {
      setSelectedLesson(null);
      setQuestions([]);
    } else {
      setSelectedLesson(lesson);
      fetchQuestions(lesson.Id);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const data = {
        LessonId: selectedLesson.Id,
        Question: questionText,
        Translation: questionTrans,
        Option1: opt1, Option1VI: opt1vi,
        Option2: opt2, Option2VI: opt2vi,
        Option3: opt3, Option3VI: opt3vi,
        OrderIndex: qOrder
      };
      if (editingQuestion) {
        await axios.put(`${API_URL}/admin/speaking/questions/${editingQuestion.Id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Đã cập nhật câu hỏi');
      } else {
        await axios.post(`${API_URL}/admin/speaking/questions`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Đã tạo câu hỏi mới');
      }
      fetchQuestions(selectedLesson.Id);
      closeQuestionForm();
    } catch (err) {
      toast.error('Lỗi lưu câu hỏi');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/speaking/questions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Đã xóa câu hỏi');
      fetchQuestions(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi xóa câu hỏi');
    }
  };

  const closeQuestionForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
    setQuestionText('');
    setQuestionTrans('');
    setOpt1(''); setOpt1vi('');
    setOpt2(''); setOpt2vi('');
    setOpt3(''); setOpt3vi('');
    setQOrder(0);
  };

  const renderQuestionForm = () => (
    <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)', background: 'white' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3)' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <span className="form-label">Câu hỏi (English)</span>
          <input aria-label="Trường nhập" className="form-input" value={questionText} onChange={e => setQuestionText(e.target.value)} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <span className="form-label">Dịch (Tiếng Việt)</span>
          <input aria-label="Trường nhập" className="form-input" value={questionTrans} onChange={e => setQuestionTrans(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Option 1 (EN)</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt1} onChange={e => setOpt1(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Dịch Option 1 (VI)</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt1vi} onChange={e => setOpt1vi(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Option 2 (EN)</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt2} onChange={e => setOpt2(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Dịch Option 2 (VI)</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt2vi} onChange={e => setOpt2vi(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Option 3 (EN)</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt3} onChange={e => setOpt3(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Dịch Option 3 (VI)</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt3vi} onChange={e => setOpt3vi(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Thứ tự</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" type="number" value={qOrder} onChange={e => setQOrder(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveQuestion}><FiSave /> Lưu</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={closeQuestionForm}><FiX /> Hủy</button>
      </div>
    </div>
  );

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="fade-in" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Quản lý Speaking Practice</h1>
        <button type="button" className="btn btn-primary" onClick={openNewLessonForm}>
          <FiPlus /> Thêm bài học
        </button>
      </div>

      {/* Lesson Form */}
      {showLessonForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>{editingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <span className="form-label">Tiêu đề</span>
              <input aria-label="Trường nhập" className="form-input" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="VD: Chào hỏi cÆ¡ bản" />
            </div>
            <div>
              <span className="form-label">Thứ tự</span>
              <input aria-label="Trường nhập" className="form-input" type="number" value={lessonOrder} onChange={e => setLessonOrder(e.target.value)} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span className="form-label">Mô tả</span>
              <textarea aria-label="Nội dung" className="form-input" value={lessonDesc} onChange={e => setLessonDesc(e.target.value)} rows={2} />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveLesson}><FiSave /> Lưu</button>
            <button type="button" className="btn btn-ghost" onClick={closeLessonForm}><FiX /> Há»§y</button>
          </div>
        </div>
      )}

      {/* Lesson List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {lessons.map((lesson, index) => (
          <div key={lesson.Id} className="card" style={{ 
            border: selectedLesson?.Id === lesson.Id ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            background: selectedLesson?.Id === lesson.Id ? 'rgba(99,102,241,0.02)' : 'var(--color-surface)'
          }}>
            <div style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }} onClick={() => handleSelectLesson(lesson)}>
                {selectedLesson?.Id === lesson.Id ? <FiChevronDown /> : <FiChevronRight />}
                <div>
                  <div style={{ fontWeight: 600 }}>{lesson.Title}</div>
                  <div className="admin-order-badge">STT {lesson.OrderIndex || index + 1}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === 0} onClick={() => handleMoveLesson(lesson.Id, -1)} title="Đưa lên"><FiArrowUp size={14} /></button>
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === lessons.length - 1} onClick={() => handleMoveLesson(lesson.Id, 1)} title="Đưa xuống"><FiArrowDown size={14} /></button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                  setEditingLesson(lesson);
                  setLessonTitle(lesson.Title);
                  setLessonDesc(lesson.Description);
                  setLessonOrder(lesson.OrderIndex);
                  setShowLessonForm(true);
                }}><FiEdit2 size={14} /></button>
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteLesson(lesson.Id)}><FiTrash2 size={14} /></button>
              </div>
            </div>

            {/* Questions Section */}
            {selectedLesson?.Id === lesson.Id && (
              <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Danh sách câu hỏi</h4>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => { closeQuestionForm(); setShowQuestionForm(true); }}><FiPlus /> Thêm câu hỏi</button>
                </div>

                {showQuestionForm && !editingQuestion && (
                  <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)', background: 'white' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-3)' }}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span className="form-label">Câu hỏi (English)</span>
                        <input aria-label="Trường nhập" className="form-input" value={questionText} onChange={e => setQuestionText(e.target.value)} />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span className="form-label">Dịch (Tiếng Việt)</span>
                        <input aria-label="Trường nhập" className="form-input" value={questionTrans} onChange={e => setQuestionTrans(e.target.value)} />
                      </div>
                      
                      {/* Options */}
                      <div>
                        <span className="form-label">Option 1 (EN)</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt1} onChange={e => setOpt1(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Dịch Option 1 (VI)</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt1vi} onChange={e => setOpt1vi(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Option 2 (EN)</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt2} onChange={e => setOpt2(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Dịch Option 2 (VI)</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt2vi} onChange={e => setOpt2vi(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Option 3 (EN)</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt3} onChange={e => setOpt3(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Dịch Option 3 (VI)</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" value={opt3vi} onChange={e => setOpt3vi(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Thứ tự</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" type="number" value={qOrder} onChange={e => setQOrder(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveQuestion}><FiSave /> Lưu</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={closeQuestionForm}><FiX /> Há»§y</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {questions.map(q => (
                    <React.Fragment key={q.Id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'white', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', minWidth: 20 }}>{q.OrderIndex}.</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{q.Question}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{q.Translation}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                        <button type="button" className="btn btn-ghost btn-xs" onClick={() => {
                          setEditingQuestion(q);
                          setQuestionText(q.Question);
                          setQuestionTrans(q.Translation);
                          setOpt1(q.Option1); setOpt1vi(q.Option1VI || '');
                          setOpt2(q.Option2); setOpt2vi(q.Option2VI || '');
                          setOpt3(q.Option3); setOpt3vi(q.Option3VI || '');
                          setQOrder(q.OrderIndex);
                          setShowQuestionForm(true);
                        }}><FiEdit2 size={12} /></button>
                        <button type="button" className="btn btn-ghost btn-xs" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteQuestion(q.Id)}><FiTrash2 size={12} /></button>
                      </div>
                    </div>
                    {showQuestionForm && editingQuestion?.Id === q.Id && renderQuestionForm()}
                    </React.Fragment>
                  ))}
                  {questions.length === 0 && !showQuestionForm && <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Chưa có câu hỏi nào.</div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSpeaking;
