import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiChevronRight, FiChevronDown, FiBook, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AdminWriting = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [showExForm, setShowExForm] = useState(false);
  const [editingEx, setEditingEx] = useState(null);

  // Lesson state
  const [lTitle, setLTitle] = useState('');
  const [lDesc, setLDesc] = useState('');
  const [lPassageEN, setLPassageEN] = useState('');
  const [lPassageVI, setLPassageVI] = useState('');
  const [lOrder, setLOrder] = useState(0);
  const [lFoundation, setLFoundation] = useState(false);

  // Exercise state
  const [exContent, setExContent] = useState('');
  const [exAnswer, setExAnswer] = useState('');
  const [exOrder, setExOrder] = useState(0);

  // Vocab state
  const [vocabList, setVocabList] = useState([]);
  const [vWord, setVWord] = useState('');
  const [vMeaning, setVMeaning] = useState('');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/writing/lessons`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLessons(res.data.data);
    } catch (err) {
      toast.error('Lỗi tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async (lessonId) => {
    try {
      const res = await axios.get(`${API_URL}/admin/writing/lessons/${lessonId}/exercises`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setExercises(res.data.data);
    } catch (err) {
      toast.error('Lỗi tải bài tập');
    }
  };

  const fetchVocab = async (exId) => {
    try {
      const res = await axios.get(`${API_URL}/admin/writing/exercises/${exId}/vocab`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVocabList(res.data.data);
    } catch (err) {
      toast.error('Lỗi tải từ vựng');
    }
  };

  const getNextLessonOrder = () => (
    lessons.length ? Math.max(...lessons.map((lesson) => Number(lesson.OrderIndex || 0))) + 1 : 1
  );

  const openNewLessonForm = () => {
    setEditingLesson(null);
    setLTitle('');
    setLDesc('');
    setLPassageEN('');
    setLPassageVI('');
    setLOrder(getNextLessonOrder());
    setLFoundation(false);
    setShowLessonForm(true);
  };

  const buildLessonPayload = (lesson, orderIndex = lesson.OrderIndex) => ({
    Title: lesson.Title,
    Description: lesson.Description || '',
    PassageEN: lesson.PassageEN || '',
    PassageVI: lesson.PassageVI || '',
    OrderIndex: orderIndex,
    IsFoundation: Boolean(lesson.IsFoundation)
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
        axios.put(`${API_URL}/admin/writing/lessons/${lesson.Id}`, buildLessonPayload(lesson, index + 1), {
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
      const data = {
        Title: lTitle,
        Description: lDesc,
        PassageEN: lPassageEN,
        PassageVI: lPassageVI,
        OrderIndex: lOrder,
        IsFoundation: lFoundation
      };
      if (editingLesson) {
        await axios.put(`${API_URL}/admin/writing/lessons/${editingLesson.Id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Đã cập nhật bài học');
      } else {
        await axios.post(`${API_URL}/admin/writing/lessons`, data, {
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
      await axios.delete(`${API_URL}/admin/writing/lessons/${id}`, {
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
    setLTitle(''); setLDesc(''); setLPassageEN(''); setLPassageVI(''); setLOrder(0); setLFoundation(false);
  };

  const handleSelectLesson = (lesson) => {
    if (selectedLesson?.Id === lesson.Id) {
      setSelectedLesson(null);
      setExercises([]);
    } else {
      setSelectedLesson(lesson);
      fetchExercises(lesson.Id);
    }
  };

  const handleSaveEx = async () => {
    try {
      const data = { LessonId: selectedLesson.Id, ContentVI: exContent, CorrectAnswerEN: exAnswer, OrderIndex: exOrder };
      if (editingEx) {
        await axios.put(`${API_URL}/admin/writing/exercises/${editingEx.Id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Đã cập nhật bài tập');
      } else {
        await axios.post(`${API_URL}/admin/writing/exercises`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Đã tạo bài tập mới');
      }
      fetchExercises(selectedLesson.Id);
      closeExForm();
    } catch (err) {
      toast.error('Lỗi lưu bài tập');
    }
  };

  const handleDeleteEx = async (id) => {
    if (!window.confirm('Xóa bài tập này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/writing/exercises/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Đã xóa bài tập');
      fetchExercises(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi xóa bài tập');
    }
  };

  const closeExForm = () => {
    setShowExForm(false);
    setEditingEx(null);
    setExContent(''); setExAnswer(''); setExOrder(0);
  };

  const handleAddVocab = async (exId) => {
    if (!vWord || !vMeaning) return toast.error('Nhập đầy đủ từ và nghĩa');
    try {
      await axios.post(`${API_URL}/admin/writing/vocab`, { ExerciseId: exId, Word: vWord, Meaning: vMeaning }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setVWord(''); setVMeaning('');
      fetchVocab(exId);
    } catch (err) {
      toast.error('Lỗi thêm từ vựng');
    }
  };

  const handleDeleteVocab = async (vId, exId) => {
    try {
      await axios.delete(`${API_URL}/admin/writing/vocab/${vId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchVocab(exId);
    } catch (err) {
      toast.error('Lỗi xóa từ vựng');
    }
  };

  const renderExerciseForm = () => (
    <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)', background: 'white' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
        <div>
          <span className="form-label">Câu hỏi (Tiếng Việt)</span>
          <textarea aria-label="Nội dung" className="form-input" value={exContent} onChange={e => setExContent(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Đáp án đúng (English)</span>
          <input aria-label="Trường nhập" className="form-input" value={exAnswer} onChange={e => setExAnswer(e.target.value)} />
        </div>
        <div>
          <span className="form-label">Thứ tự</span>
          <input aria-label="Trường nhập" className="form-input form-input-sm" type="number" value={exOrder} onChange={e => setExOrder(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveEx}><FiSave /> Lưu</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={closeExForm}><FiX /> Hủy</button>
      </div>
    </div>
  );

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="fade-in" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Quản lý Writing Skills</h1>
        <button type="button" className="btn btn-primary" onClick={openNewLessonForm}>
          <FiPlus /> Thêm bài học
        </button>
      </div>

      {showLessonForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>{editingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <span className="form-label">Tiêu đề</span>
              <input aria-label="Trường nhập" className="form-input" value={lTitle} onChange={e => setLTitle(e.target.value)} />
            </div>
            <div>
              <span className="form-label">Thứ tự</span>
              <input aria-label="Trường nhập" className="form-input" type="number" value={lOrder} onChange={e => setLOrder(e.target.value)} />
            </div>
            <label className="admin-check-row" style={{ gridColumn: 'span 2' }}>
              <input type="checkbox" checked={lFoundation} onChange={e => setLFoundation(e.target.checked)} />
              <span>Bài nền tảng</span>
            </label>
            <div style={{ gridColumn: 'span 2' }}>
              <span className="form-label">Mô tả</span>
              <textarea aria-label="Nội dung" className="form-input" value={lDesc} onChange={e => setLDesc(e.target.value)} rows={2} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span className="form-label">Bài văn hoàn chỉnh (English)</span>
              <textarea aria-label="Nội dung" className="form-input" value={lPassageEN} onChange={e => setLPassageEN(e.target.value)} rows={5} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span className="form-label">Bản dịch bài văn (Tiếng Việt)</span>
              <textarea aria-label="Nội dung" className="form-input" value={lPassageVI} onChange={e => setLPassageVI(e.target.value)} rows={4} />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveLesson}><FiSave /> Lưu</button>
            <button type="button" className="btn btn-ghost" onClick={closeLessonForm}><FiX /> Hủy</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {lessons.map((lesson, index) => (
          <div key={lesson.Id} className="card">
            <div style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }} onClick={() => handleSelectLesson(lesson)}>
                {selectedLesson?.Id === lesson.Id ? <FiChevronDown /> : <FiChevronRight />}
                <div>
                  <div style={{ fontWeight: 600 }}>{lesson.Title}</div>
                  <div className="admin-order-badge">STT {lesson.OrderIndex || index + 1}</div>
                  {lesson.PassageEN && (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 6 }}>
                      {lesson.PassageEN.slice(0, 140)}{lesson.PassageEN.length > 140 ? '...' : ''}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === 0} onClick={() => handleMoveLesson(lesson.Id, -1)} title="Đưa lên"><FiArrowUp size={14} /></button>
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === lessons.length - 1} onClick={() => handleMoveLesson(lesson.Id, 1)} title="Đưa xuống"><FiArrowDown size={14} /></button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                  setEditingLesson(lesson); setLTitle(lesson.Title); setLDesc(lesson.Description); setLPassageEN(lesson.PassageEN || ''); setLPassageVI(lesson.PassageVI || ''); setLOrder(lesson.OrderIndex); setLFoundation(Boolean(lesson.IsFoundation));
                  setShowLessonForm(true);
                }}><FiEdit2 size={14} /></button>
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteLesson(lesson.Id)}><FiTrash2 size={14} /></button>
              </div>
            </div>

            {selectedLesson?.Id === lesson.Id && (
              <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Bài tập Writing</h4>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => { closeExForm(); setShowExForm(true); }}><FiPlus /> Thêm bài tập</button>
                </div>

                {showExForm && !editingEx && (
                  <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)', background: 'white' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
                      <div>
                        <span className="form-label">Câu hỏi (Tiếng Việt)</span>
                        <textarea aria-label="Nội dung" className="form-input" value={exContent} onChange={e => setExContent(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Đáp án đúng (English)</span>
                        <input aria-label="Trường nhập" className="form-input" value={exAnswer} onChange={e => setExAnswer(e.target.value)} />
                      </div>
                      <div>
                        <span className="form-label">Thứ tự</span>
                        <input aria-label="Trường nhập" className="form-input form-input-sm" type="number" value={exOrder} onChange={e => setExOrder(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveEx}><FiSave /> Lưu</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={closeExForm}><FiX /> Hủy</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {exercises.map(ex => (
                    <React.Fragment key={ex.Id}>
                    <div className="card" style={{ background: 'white', padding: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500 }}>{ex.ContentVI}</div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginTop: 4 }}>{ex.CorrectAnswerEN}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                          <button type="button" className="btn btn-ghost btn-xs" onClick={() => {
                            setEditingEx(ex); setExContent(ex.ContentVI); setExAnswer(ex.CorrectAnswerEN); setExOrder(ex.OrderIndex);
                            setShowExForm(true);
                          }}><FiEdit2 size={12} /></button>
                          <button type="button" className="btn btn-ghost btn-xs" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteEx(ex.Id)}><FiTrash2 size={12} /></button>
                        </div>
                      </div>

                      {/* Vocab hints for this exercise */}
                      <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FiBook size={10} /> GỢI Ý TỪ VỰNG
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--space-2)' }}>
                          <VocabManager exId={ex.Id} />
                        </div>
                      </div>
                    </div>
                    {showExForm && editingEx?.Id === ex.Id && renderExerciseForm()}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const VocabManager = ({ exId }) => {
  const [list, setList] = useState([]);
  const [w, setW] = useState('');
  const [m, setM] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch();
  }, [exId]);

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/writing/exercises/${exId}/vocab`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setList(res.data.data);
    } catch (err) {}
  };

  const add = async () => {
    if (!w || !m) return;
    try {
      await axios.post(`${API_URL}/admin/writing/vocab`, { ExerciseId: exId, Word: w, Meaning: m }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setW(''); setM(''); setShowAdd(false);
      fetch();
    } catch (err) {}
  };

  const del = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/writing/vocab/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetch();
    } catch (err) {}
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {list.map(v => (
          <span key={v.Id} style={{ 
            fontSize: 'var(--font-size-xs)', background: 'white', padding: '2px 8px', 
            borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
            display: 'inline-flex', alignItems: 'center', gap: 4
          }}>
            <strong>{v.Word}</strong>: {v.Meaning}
            <FiX size={10} style={{ cursor: 'pointer', color: 'var(--color-error)' }} onClick={() => del(v.Id)} />
          </span>
        ))}
        {!showAdd && <button type="button" className="btn btn-ghost btn-xs" onClick={() => setShowAdd(true)} style={{ padding: '0 8px', height: 20, minHeight: 0 }}>+ Thêm gợi ý</button>}
      </div>
      {showAdd && (
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          <input aria-label="Trường nhập" className="input input-sm" style={{ height: 24 }} placeholder="Từ" value={w} onChange={e => setW(e.target.value)} />
          <input aria-label="Trường nhập" className="input input-sm" style={{ height: 24 }} placeholder="NghÄ©a" value={m} onChange={e => setM(e.target.value)} />
          <button type="button" className="btn btn-primary btn-xs" onClick={add}>Lưu</button>
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => setShowAdd(false)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default AdminWriting;
