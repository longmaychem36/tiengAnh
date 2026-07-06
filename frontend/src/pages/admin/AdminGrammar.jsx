import React, { Suspense, lazy, useState, useEffect } from 'react';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiChevronRight, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '../../api/config';

const ReactQuill = lazy(() => import('react-quill'));
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const textValue = (value) => value ?? '';
const numberValue = (value) => Number.parseInt(value, 10) || 0;
const GRAMMAR_ICON_OPTIONS = ['📘', '📖', '📝', '🔤', '🧩', '⏰', '⚡', '🎯', '💬', '❓', '✅', '📌', '🧠', '🏆', '🌟', '🔍', '📚', '🗂️'];

const AdminGrammar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Category state
  const [catName, setCatName] = useState('');
  const [catNameVI, setCatNameVI] = useState('');
  const [catIcon, setCatIcon] = useState('📘');
  const [catOrder, setCatOrder] = useState(0);

  // Topic state
  const [topicTitle, setTopicTitle] = useState('');
  const [topicTitleVI, setTopicTitleVI] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [topicOrder, setTopicOrder] = useState(0);

  // Quiz state
  const [quizQ, setQuizQ] = useState('');
  const [qA, setQA] = useState('');
  const [qB, setQB] = useState('');
  const [qC, setQC] = useState('');
  const [qD, setQD] = useState('');
  const [qAns, setQAns] = useState('A');
  const [qExp, setQExp] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/grammar/categories`, {
        headers: authHeaders()
      });
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error('Lỗi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (catId) => {
    try {
      const res = await axios.get(`${API_URL}/admin/grammar/categories/${catId}/topics`, {
        headers: authHeaders()
      });
      setTopics(res.data.data || []);
    } catch (err) {
      toast.error('Lỗi tải chủ đề');
    }
  };

  const fetchQuizzes = async (topicId) => {
    try {
      const res = await axios.get(`${API_URL}/admin/grammar/topics/${topicId}/quizzes`, {
        headers: authHeaders()
      });
      setQuizzes(res.data.data || []);
    } catch (err) {
      toast.error('Lỗi tải bài tập');
    }
  };

  // Category Actions
  const handleSaveCat = async () => {
    try {
      if (!catName.trim()) return toast.error('Vui lòng nhập tên danh mục');
      const data = { Name: catName.trim(), NameVI: catNameVI.trim(), Icon: catIcon || '📘', OrderIndex: numberValue(catOrder) };
      if (editingCat) {
        await axios.put(`${API_URL}/admin/grammar/categories/${editingCat.Id}`, data, {
          headers: authHeaders()
        });
        toast.success('Cập nhật danh mục thành công');
      } else {
        await axios.post(`${API_URL}/admin/grammar/categories`, data, {
          headers: authHeaders()
        });
        toast.success('Thêm danh mục thành công');
      }
      fetchCategories();
      closeCatForm();
    } catch (err) { toast.error('Lỗi lưu danh mục'); }
  };

  const closeCatForm = () => {
    setShowCatForm(false); setEditingCat(null); setCatName(''); setCatNameVI(''); setCatIcon('📘'); setCatOrder(0);
  };

  // Topic Actions
  const handleSaveTopic = async () => {
    try {
      if (!selectedCat?.Id) return toast.error('Vui lòng chọn danh mục');
      if (!topicTitle.trim()) return toast.error('Vui lòng nhập tiêu đề chủ đề');
      const data = { CategoryId: Number(selectedCat.Id), Title: topicTitle.trim(), TitleVI: topicTitleVI.trim(), Content: topicContent || '', OrderIndex: numberValue(topicOrder) };
      if (editingTopic) {
        await axios.put(`${API_URL}/admin/grammar/topics/${editingTopic.Id}`, data, {
          headers: authHeaders()
        });
        toast.success('Cập nhật chủ đề thành công');
      } else {
        await axios.post(`${API_URL}/admin/grammar/topics`, data, {
          headers: authHeaders()
        });
        toast.success('Thêm chủ đề thành công');
      }
      fetchTopics(selectedCat.Id);
      closeTopicForm();
    } catch (err) { toast.error('Lỗi lưu chủ đề'); }
  };

  const closeTopicForm = () => {
    setShowTopicForm(false); setEditingTopic(null); setTopicTitle(''); setTopicTitleVI(''); setTopicContent(''); setTopicOrder(0);
  };

  // Quiz Actions
  const handleSaveQuiz = async () => {
    try {
      if (!selectedTopic?.Id) return toast.error('Vui lòng chọn chủ đề');
      if (!quizQ.trim()) return toast.error('Vui lòng nhập câu hỏi');
      const data = { TopicId: selectedTopic.Id, Question: quizQ.trim(), OptionA: qA.trim(), OptionB: qB.trim(), OptionC: qC.trim(), OptionD: qD.trim(), CorrectAnswer: qAns, Explanation: qExp.trim() };
      if (editingQuiz) {
        await axios.put(`${API_URL}/admin/grammar/quizzes/${editingQuiz.Id}`, data, {
          headers: authHeaders()
        });
        toast.success('Cập nhật bài tập thành công');
      } else {
        await axios.post(`${API_URL}/admin/grammar/quizzes`, data, {
          headers: authHeaders()
        });
        toast.success('Thêm bài tập thành công');
      }
      fetchQuizzes(selectedTopic.Id);
      closeQuizForm();
    } catch (err) { toast.error('Lỗi lưu bài tập'); }
  };

  const closeQuizForm = () => {
    setShowQuizForm(false); setEditingQuiz(null); setQuizQ(''); setQA(''); setQB(''); setQC(''); setQD(''); setQAns('A'); setQExp('');
  };

  const renderQuizForm = () => (
    <div className="admin-nested-form" style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
      <div className="admin-panel-head">
        <h2>{editingQuiz ? 'Sửa bài tập' : 'Thêm bài tập mới'}</h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={closeQuizForm}><FiX /></button>
      </div>
      <div className="admin-form-grid">
        <span className="is-wide">
          <span>Câu hỏi</span>
          <input aria-label="Trường nhập" className="form-input" value={quizQ} onChange={e => setQuizQ(e.target.value)} />
        </span>
        <span>
          <span>Option A</span>
          <input aria-label="Trường nhập" className="form-input" value={qA} onChange={e => setQA(e.target.value)} />
        </span>
        <span>
          <span>Option B</span>
          <input aria-label="Trường nhập" className="form-input" value={qB} onChange={e => setQB(e.target.value)} />
        </span>
        <span>
          <span>Option C</span>
          <input aria-label="Trường nhập" className="form-input" value={qC} onChange={e => setQC(e.target.value)} />
        </span>
        <span>
          <span>Option D</span>
          <input aria-label="Trường nhập" className="form-input" value={qD} onChange={e => setQD(e.target.value)} />
        </span>
        <span>
          <span>Đáp án đúng</span>
          <select aria-label="Lựa chọn" className="form-input" value={qAns} onChange={e => setQAns(e.target.value)}>
            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
          </select>
        </span>
        <span>
          <span>Giải thích</span>
          <input aria-label="Trường nhập" className="form-input" value={qExp} onChange={e => setQExp(e.target.value)} />
        </span>
        <div className="admin-form-actions">
          <button type="button" className="btn btn-primary" onClick={handleSaveQuiz}><FiSave /> Lưu</button>
          <button type="button" className="btn btn-ghost" onClick={closeQuizForm}><FiX /> Hủy</button>
        </div>
      </div>
    </div>
  );

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="fade-in admin-receptive-page">
      <div className="admin-receptive-header">
        <div>
          <h1>Quản lý Grammar</h1>
          <p>Quản lý các danh mục ngữ pháp, chủ đề bài học và bài tập đi kèm.</p>
        </div>
        <div className="admin-inline-actions">
          <button type="button" className="btn btn-primary" onClick={() => setShowCatForm(true)}><FiPlus /> Thêm danh mục</button>
        </div>
      </div>

      {showCatForm && (
        <div className="admin-receptive-form">
          <div className="admin-panel-head">
            <h2>{editingCat ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <button type="button" className="btn btn-ghost btn-sm" onClick={closeCatForm}><FiX /></button>
          </div>
          <div className="admin-form-grid">
            <span>
              <span>Tên (EN)</span>
              <input aria-label="Trường nhập" className="form-input" value={catName} onChange={e => setCatName(e.target.value)} />
            </span>
            <span>
              <span>Tên (VI)</span>
              <input aria-label="Trường nhập" className="form-input" value={catNameVI} onChange={e => setCatNameVI(e.target.value)} />
            </span>
            <span>
              <span>Icon</span>
              <input aria-label="Icon danh mục" className="form-input" value={catIcon} onChange={e => setCatIcon(e.target.value)} placeholder="📘" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {GRAMMAR_ICON_OPTIONS.map(icon => (
                  <button
                    type="button"
                    key={icon}
                    className={`btn btn-ghost btn-xs ${catIcon === icon ? 'is-active' : ''}`}
                    onClick={() => setCatIcon(icon)}
                    style={{ minWidth: 34, padding: '6px 8px', fontSize: 18, lineHeight: 1 }}
                    aria-label={`Chọn icon ${icon}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </span>
            <span>
              <span>Thứ tự</span>
              <input aria-label="Trường nhập" className="form-input" type="number" value={catOrder} onChange={e => setCatOrder(e.target.value)} />
            </span>
            <div className="admin-form-actions">
              <button type="button" className="btn btn-primary" onClick={handleSaveCat}><FiSave /> Lưu</button>
              <button type="button" className="btn btn-ghost" onClick={closeCatForm}><FiX /> Hủy</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-receptive-list">
        {categories.map(cat => (
          <div key={cat.Id} className={`admin-receptive-card ${selectedCat?.Id === cat.Id ? 'is-active' : ''}`}>
            <div className="admin-receptive-card-head" onClick={() => {
              if (selectedCat?.Id === cat.Id) {
                setSelectedCat(null);
                setSelectedTopic(null);
                setTopics([]);
                setQuizzes([]);
              } else {
                setSelectedCat(cat);
                setSelectedTopic(null);
                setQuizzes([]);
                closeTopicForm();
                closeQuizForm();
                fetchTopics(cat.Id);
              }
            }} style={{ cursor: 'pointer' }}>
              <button type="button" className="admin-receptive-title" style={{ cursor: 'pointer' }}>
                <span className="admin-expand-label">{selectedCat?.Id === cat.Id ? 'Đóng' : 'Mở'}</span>
                <div>
                  <strong>{cat.Name} ({cat.NameVI})</strong>
                  <p className="admin-order-badge">Thứ tự: {cat.OrderIndex}</p>
                </div>
              </button>
              <div className="admin-inline-actions" onClick={e => e.stopPropagation()}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                  setEditingCat(cat); setCatName(textValue(cat.Name)); setCatNameVI(textValue(cat.NameVI)); setCatIcon(cat.Icon || '📘'); setCatOrder(numberValue(cat.OrderIndex)); setShowCatForm(true);
                }}>Sửa</button>
                <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={async () => {
                  if (window.confirm('Xóa danh mục này?')) {
                    try {
                      await axios.delete(`${API_URL}/admin/grammar/categories/${cat.Id}`, { headers: authHeaders() });
                      fetchCategories();
                      if (selectedCat?.Id === cat.Id) setSelectedCat(null);
                    } catch (err) {
                      toast.error('Không thể xóa danh mục này');
                    }
                  }
                }}>Xóa</button>
              </div>
            </div>

            {selectedCat?.Id === cat.Id && (
              <div className="admin-receptive-detail">
                <section className="admin-subpanel">
                  <div className="admin-subpanel-head">
                    <h3>Chủ đề trong {cat.Name}</h3>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowTopicForm(true)}><FiPlus /> Thêm chủ đề</button>
                  </div>

                  {showTopicForm && (
                    <div className="admin-nested-form" style={{ marginTop: 'var(--space-2)' }}>
                      <div className="admin-panel-head">
                        <h2>{editingTopic ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}</h2>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={closeTopicForm}><FiX /></button>
                      </div>
                      <div className="admin-form-grid">
                        <span>
                          <span>Tiêu đề (EN)</span>
                          <input aria-label="Trường nhập" className="form-input" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} />
                        </span>
                        <span>
                          <span>Tiêu đề (VI)</span>
                          <input aria-label="Trường nhập" className="form-input" value={topicTitleVI} onChange={e => setTopicTitleVI(e.target.value)} />
                        </span>
                        <span>
                          <span>Thứ tự</span>
                          <input aria-label="Trường nhập" className="form-input" type="number" value={topicOrder} onChange={e => setTopicOrder(e.target.value)} />
                        </span>
                        <span className="is-wide">
                          <span>Nội dung bài học (Rich Text Editor)</span>
                          <div style={{ minHeight: '320px', background: '#ffffff' }}>
                            <Suspense fallback={<div className="form-input" style={{ minHeight: 250 }}>Đang tải trình soạn thảo...</div>}>
                              <ReactQuill
                                theme="snow"
                                value={topicContent}
                                onChange={setTopicContent}
                                modules={quillModules}
                                style={{ height: '250px', marginBottom: '50px' }}
                              />
                            </Suspense>
                          </div>
                        </span>
                        <div className="admin-form-actions">
                          <button type="button" className="btn btn-primary" onClick={handleSaveTopic}><FiSave /> Lưu</button>
                          <button type="button" className="btn btn-ghost" onClick={closeTopicForm}><FiX /> Hủy</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="admin-item-list" style={{ marginTop: 'var(--space-2)' }}>
                    {topics.map(topic => (
                      <div key={topic.Id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                          <button type="button" className="admin-receptive-title" onClick={() => {
                            if (selectedTopic?.Id === topic.Id) {
                              setSelectedTopic(null);
                              setQuizzes([]);
                            } else {
                              setSelectedTopic(topic);
                              closeQuizForm();
                              fetchQuizzes(topic.Id);
                            }
                          }} style={{ cursor: 'pointer', flex: 1 }}>
                            <span className="admin-expand-label">{selectedTopic?.Id === topic.Id ? 'Đóng' : 'Mở'}</span>
                            <div>
                              <strong>{topic.Title} ({topic.TitleVI})</strong>
                              <p className="admin-order-badge">Thứ tự: {topic.OrderIndex}</p>
                            </div>
                          </button>
                          <div className="admin-inline-actions">
                            <button type="button" className="btn btn-ghost btn-xs" onClick={() => {
                              setEditingTopic(topic); setTopicTitle(textValue(topic.Title)); setTopicTitleVI(textValue(topic.TitleVI)); setTopicContent(textValue(topic.Content)); setTopicOrder(numberValue(topic.OrderIndex)); setShowTopicForm(true);
                            }}>Sửa</button>
                            <button type="button" className="btn btn-ghost btn-xs text-error" onClick={async () => {
                              if (window.confirm('Xóa chủ đề này?')) {
                                try {
                                  await axios.delete(`${API_URL}/admin/grammar/topics/${topic.Id}`, { headers: authHeaders() });
                                  fetchTopics(cat.Id);
                                  if (selectedTopic?.Id === topic.Id) setSelectedTopic(null);
                                } catch (err) {
                                  toast.error('Không thể xóa chủ đề này');
                                }
                              }
                            }}>Xóa</button>
                          </div>
                        </div>

                        {selectedTopic?.Id === topic.Id && (
                          <div style={{ padding: 'var(--space-2)', background: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-border)', borderRadius: '3px', display: 'grid', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h5 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-muted)', textTransform: 'uppercase' }}>Bài tập (Quizzes)</h5>
                              <button type="button" className="btn btn-primary btn-xs" onClick={() => { closeQuizForm(); setShowQuizForm(true); }}><FiPlus /> Thêm bài tập</button>
                            </div>

                            {showQuizForm && !editingQuiz && renderQuizForm()}

                            <div className="admin-item-list">
                              {quizzes.map((q, idx) => (
                                <React.Fragment key={q.Id}>
                                  <div className="admin-list-item" style={{ background: '#ffffff', padding: '8px 10px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <strong>{idx + 1}. {q.Question}</strong>
                                      <p style={{ color: 'var(--admin-primary)', fontWeight: 600, marginTop: 4 }}>Đáp án: {q.CorrectAnswer} {q.Explanation && `(Giải thích: ${q.Explanation})`}</p>
                                    </div>
                                    <div className="admin-inline-actions">
                                      <button type="button" className="btn btn-ghost btn-xs" onClick={() => {
                                        setEditingQuiz(q); setQuizQ(textValue(q.Question)); setQA(textValue(q.OptionA)); setQB(textValue(q.OptionB)); setQC(textValue(q.OptionC)); setQD(textValue(q.OptionD)); setQAns(q.CorrectAnswer || 'A'); setQExp(textValue(q.Explanation)); setShowQuizForm(true);
                                      }}>Sửa</button>
                                      <button type="button" className="btn btn-ghost btn-xs text-error" onClick={async () => {
                                        if (window.confirm('Xóa bài tập?')) {
                                          try {
                                            await axios.delete(`${API_URL}/admin/grammar/quizzes/${q.Id}`, { headers: authHeaders() });
                                            fetchQuizzes(topic.Id);
                                          } catch (err) {
                                            toast.error('Không thể xóa bài tập');
                                          }
                                        }
                                      }}>Xóa</button>
                                    </div>
                                  </div>
                                  {showQuizForm && editingQuiz?.Id === q.Id && renderQuizForm()}
                                </React.Fragment>
                              ))}
                              {quizzes.length === 0 && !showQuizForm && (
                                <div className="admin-empty-inline">Chưa có bài tập nào.</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {topics.length === 0 && (
                      <div className="admin-empty-inline">Chưa có chủ đề nào trong danh mục này.</div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGrammar;
