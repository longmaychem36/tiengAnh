import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiChevronRight, FiChevronDown, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '../../api/config';

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
  const [lessonFoundation, setLessonFoundation] = useState(false);
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
    setLessonFoundation(false);
    setLessonOrder(getNextLessonOrder());
    setShowLessonForm(true);
  };

  const buildLessonPayload = (lesson, orderIndex = lesson.OrderIndex) => ({
    Title: lesson.Title,
    Description: lesson.Description || '',
    IsFoundation: Boolean(lesson.IsFoundation),
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
      const data = { Title: lessonTitle, Description: lessonDesc, IsFoundation: lessonFoundation, OrderIndex: lessonOrder };
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
      toast.error('Lỗi xóa bài học');
    }
  };

  const closeLessonForm = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    setLessonTitle('');
    setLessonDesc('');
    setLessonFoundation(false);
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

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="admin-receptive-page">
      <div className="admin-receptive-header">
        <h1>Quản lý Speaking</h1>
        <button type="button" className="btn btn-primary" onClick={openNewLessonForm}>
          <FiPlus /> Thêm bài học
        </button>
      </div>

      {/* Lesson Form */}
      {showLessonForm && (
        <div className="admin-receptive-form">
          <h3>{editingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}</h3>
          <div className="admin-form-grid">
            <span>
              <span>Tiêu đề</span>
              <input aria-label="Trường nhập" className="form-input" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="VD: Chào hỏi cơ bản" />
            </span>
            <span>
              <span>Thứ tự</span>
              <input aria-label="Trường nhập" className="form-input" type="number" value={lessonOrder} onChange={e => setLessonOrder(e.target.value)} />
            </span>
            <label className="admin-check-row">
              <input type="checkbox" checked={lessonFoundation} onChange={e => setLessonFoundation(e.target.checked)} />
              <span>Bài nền tảng</span>
            </label>
            <span className="is-wide">
              <span>Mô tả</span>
              <textarea aria-label="Nội dung" className="form-input" value={lessonDesc} onChange={e => setLessonDesc(e.target.value)} rows={2} />
            </span>
          </div>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-primary" onClick={handleSaveLesson}><FiSave /> Lưu</button>
            <button type="button" className="btn btn-ghost" onClick={closeLessonForm}><FiX /> Hủy</button>
          </div>
        </div>
      )}

      {/* Lesson List */}
      <div className="admin-receptive-list">
        {lessons.map((lesson, index) => (
          <div key={lesson.Id} className={`admin-receptive-card ${selectedLesson?.Id === lesson.Id ? 'is-active' : ''}`}>
            <div className="admin-receptive-card-head">
              <button type="button" className="admin-receptive-title" onClick={() => handleSelectLesson(lesson)}>
                <span className="admin-expand-label">{selectedLesson?.Id === lesson.Id ? 'Đóng' : 'Mở'}</span>
                <div>
                  <strong>{lesson.Title}</strong>
                  <span>STT {lesson.OrderIndex || index + 1}{lesson.IsFoundation ? ' · Nền tảng' : ''}</span>
                </div>
              </button>
              <div className="admin-inline-actions">
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === 0} onClick={() => handleMoveLesson(lesson.Id, -1)}>Lên</button>
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === lessons.length - 1} onClick={() => handleMoveLesson(lesson.Id, 1)}>Xuống</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                  setEditingLesson(lesson);
                  setLessonTitle(lesson.Title);
                  setLessonDesc(lesson.Description);
                  setLessonFoundation(Boolean(lesson.IsFoundation));
                  setLessonOrder(lesson.OrderIndex);
                  setShowLessonForm(true);
                }}>Sửa</button>
                <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={() => handleDeleteLesson(lesson.Id)}>Xóa</button>
              </div>
            </div>

            {/* Questions Section */}
            {selectedLesson?.Id === lesson.Id && (
              <div className="admin-receptive-detail">
                <div className="admin-subpanel">
                  <div className="admin-subpanel-head">
                    <h3>Câu hỏi</h3>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => { closeQuestionForm(); setShowQuestionForm(true); }}><FiPlus /> Thêm</button>
                  </div>

                  {showQuestionForm && !editingQuestion && (
                    <QuestionFormBlock
                      questionText={questionText} setQuestionText={setQuestionText}
                      questionTrans={questionTrans} setQuestionTrans={setQuestionTrans}
                      opt1={opt1} setOpt1={setOpt1} opt1vi={opt1vi} setOpt1vi={setOpt1vi}
                      opt2={opt2} setOpt2={setOpt2} opt2vi={opt2vi} setOpt2vi={setOpt2vi}
                      opt3={opt3} setOpt3={setOpt3} opt3vi={opt3vi} setOpt3vi={setOpt3vi}
                      qOrder={qOrder} setQOrder={setQOrder}
                      onSave={handleSaveQuestion} onCancel={closeQuestionForm}
                    />
                  )}

                  <div className="admin-item-list">
                    {questions.map(q => (
                      <React.Fragment key={q.Id}>
                        <div className="admin-list-item">
                          <div>
                            <strong>{q.Question}</strong>
                            <p>{q.Translation}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            <button type="button" className="btn btn-ghost btn-xs" onClick={() => {
                              setEditingQuestion(q);
                              setQuestionText(q.Question);
                              setQuestionTrans(q.Translation);
                              setOpt1(q.Option1); setOpt1vi(q.Option1VI || '');
                              setOpt2(q.Option2); setOpt2vi(q.Option2VI || '');
                              setOpt3(q.Option3); setOpt3vi(q.Option3VI || '');
                              setQOrder(q.OrderIndex);
                              setShowQuestionForm(true);
                            }}>Sửa</button>
                            <button type="button" className="btn btn-ghost btn-xs is-danger" onClick={() => handleDeleteQuestion(q.Id)}>Xóa</button>
                          </div>
                        </div>
                        {showQuestionForm && editingQuestion?.Id === q.Id && (
                          <QuestionFormBlock
                            questionText={questionText} setQuestionText={setQuestionText}
                            questionTrans={questionTrans} setQuestionTrans={setQuestionTrans}
                            opt1={opt1} setOpt1={setOpt1} opt1vi={opt1vi} setOpt1vi={setOpt1vi}
                            opt2={opt2} setOpt2={setOpt2} opt2vi={opt2vi} setOpt2vi={setOpt2vi}
                            opt3={opt3} setOpt3={setOpt3} opt3vi={opt3vi} setOpt3vi={setOpt3vi}
                            qOrder={qOrder} setQOrder={setQOrder}
                            onSave={handleSaveQuestion} onCancel={closeQuestionForm}
                          />
                        )}
                      </React.Fragment>
                    ))}
                    {questions.length === 0 && !showQuestionForm && (
                      <div className="admin-empty-inline">Chưa có câu hỏi nào.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function QuestionFormBlock({ questionText, setQuestionText, questionTrans, setQuestionTrans, opt1, setOpt1, opt1vi, setOpt1vi, opt2, setOpt2, opt2vi, setOpt2vi, opt3, setOpt3, opt3vi, setOpt3vi, qOrder, setQOrder, onSave, onCancel }) {
  return (
    <div className="admin-nested-form">
      <div className="admin-form-grid">
        <span className="is-wide">
          <span>Câu hỏi (English)</span>
          <input aria-label="Trường nhập" className="form-input" value={questionText} onChange={e => setQuestionText(e.target.value)} />
        </span>
        <span className="is-wide">
          <span>Dịch (Tiếng Việt)</span>
          <input aria-label="Trường nhập" className="form-input" value={questionTrans} onChange={e => setQuestionTrans(e.target.value)} />
        </span>
        <span><span>Option 1 (EN)</span><input aria-label="Trường nhập" className="form-input" value={opt1} onChange={e => setOpt1(e.target.value)} /></span>
        <span><span>Option 1 (VI)</span><input aria-label="Trường nhập" className="form-input" value={opt1vi} onChange={e => setOpt1vi(e.target.value)} /></span>
        <span><span>Option 2 (EN)</span><input aria-label="Trường nhập" className="form-input" value={opt2} onChange={e => setOpt2(e.target.value)} /></span>
        <span><span>Option 2 (VI)</span><input aria-label="Trường nhập" className="form-input" value={opt2vi} onChange={e => setOpt2vi(e.target.value)} /></span>
        <span><span>Option 3 (EN)</span><input aria-label="Trường nhập" className="form-input" value={opt3} onChange={e => setOpt3(e.target.value)} /></span>
        <span><span>Option 3 (VI)</span><input aria-label="Trường nhập" className="form-input" value={opt3vi} onChange={e => setOpt3vi(e.target.value)} /></span>
        <span><span>Thứ tự</span><input aria-label="Trường nhập" className="form-input" type="number" value={qOrder} onChange={e => setQOrder(e.target.value)} /></span>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={onSave}><FiSave /> Lưu</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}><FiX /> Hủy</button>
      </div>
    </div>
  );
}

export default AdminSpeaking;
