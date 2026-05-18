import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiChevronRight, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const textValue = (value) => value ?? '';
const numberValue = (value) => Number.parseInt(value, 10) || 0;

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
    <div className="fade-in" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Quản lý Grammar</h1>
        <button className="btn btn-primary" onClick={() => setShowCatForm(true)}><FiPlus /> Thêm danh mục</button>
      </div>

      {showCatForm && (
        <div className="card p-6 mb-6">
          <h3 className="mb-4">{editingCat ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
          <div className="grid grid-2 gap-4">
            <div><label className="form-label">Tên (EN)</label><input className="form-input" value={catName} onChange={e => setCatName(e.target.value)} /></div>
            <div><label className="form-label">Tên (VI)</label><input className="form-input" value={catNameVI} onChange={e => setCatNameVI(e.target.value)} /></div>
            <div><label className="form-label">Icon</label><input className="form-input" value={catIcon} onChange={e => setCatIcon(e.target.value)} /></div>
            <div><label className="form-label">Thứ tự</label><input className="form-input" type="number" value={catOrder} onChange={e => setCatOrder(e.target.value)} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary" onClick={handleSaveCat}><FiSave /> Lưu</button>
            <button className="btn btn-ghost" onClick={closeCatForm}><FiX /> Hủy</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {categories.map(cat => (
          <div key={cat.Id} className="card overflow-hidden">
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => {
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
            }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '24px' }}>{cat.Icon}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{cat.Name} ({cat.NameVI})</div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => {
                  setEditingCat(cat); setCatName(textValue(cat.Name)); setCatNameVI(textValue(cat.NameVI)); setCatIcon(cat.Icon || '📘'); setCatOrder(numberValue(cat.OrderIndex)); setShowCatForm(true);
                }}><FiEdit2 size={14} /></button>
                <button className="btn btn-ghost btn-sm text-error" onClick={async () => {
                  if (window.confirm('Xóa danh mục này?')) {
                    try {
                      await axios.delete(`${API_URL}/admin/grammar/categories/${cat.Id}`, { headers: authHeaders() });
                      fetchCategories();
                      if (selectedCat?.Id === cat.Id) setSelectedCat(null);
                    } catch (err) {
                      toast.error('Không thể xóa danh mục này');
                    }
                  }
                }}><FiTrash2 size={14} /></button>
                {selectedCat?.Id === cat.Id ? <FiChevronDown /> : <FiChevronRight />}
              </div>
            </div>

            {selectedCat?.Id === cat.Id && (
              <div className="p-4 border-t bg-gray-50/30">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold">Chủ đề trong {cat.Name}</h4>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowTopicForm(true)}><FiPlus /> Thêm chủ đề</button>
                </div>

                {showTopicForm && (
                  <div className="card p-6 mb-6 bg-white shadow-sm">
                    <h3 className="mb-4">{editingTopic ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}</h3>
                    <div className="grid grid-2 gap-4 mb-4">
                      <div><label className="form-label">Tiêu đề (EN)</label><input className="form-input" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} /></div>
                      <div><label className="form-label">Tiêu đề (VI)</label><input className="form-input" value={topicTitleVI} onChange={e => setTopicTitleVI(e.target.value)} /></div>
                      <div><label className="form-label">Thứ tự</label><input className="form-input" type="number" value={topicOrder} onChange={e => setTopicOrder(e.target.value)} /></div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Nội dung bài học (Rich Text Editor)</label>
                      <div className="bg-white" style={{ minHeight: '300px' }}>
                        <ReactQuill 
                          theme="snow" 
                          value={topicContent} 
                          onChange={setTopicContent} 
                          modules={quillModules}
                          style={{ height: '250px', marginBottom: '50px' }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-primary" onClick={handleSaveTopic}><FiSave /> Lưu</button>
                      <button className="btn btn-ghost" onClick={closeTopicForm}><FiX /> Hủy</button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {topics.map(topic => (
                    <div key={topic.Id} className="border rounded-lg bg-white overflow-hidden shadow-sm">
                      <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => {
                        if (selectedTopic?.Id === topic.Id) {
                          setSelectedTopic(null);
                          setQuizzes([]);
                        } else {
                          setSelectedTopic(topic);
                          closeQuizForm();
                          fetchQuizzes(topic.Id);
                        }
                      }}>
                        <div className="flex items-center gap-2">
                          <FiBookOpen className="text-primary" />
                          <span className="font-medium text-sm">{topic.Title} ({topic.TitleVI})</span>
                        </div>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button className="btn btn-ghost btn-xs" onClick={() => {
                            setEditingTopic(topic); setTopicTitle(textValue(topic.Title)); setTopicTitleVI(textValue(topic.TitleVI)); setTopicContent(textValue(topic.Content)); setTopicOrder(numberValue(topic.OrderIndex)); setShowTopicForm(true);
                          }}><FiEdit2 size={12} /></button>
                          <button className="btn btn-ghost btn-xs text-error" onClick={async () => {
                            if (window.confirm('Xóa chủ đề này?')) {
                              try {
                                await axios.delete(`${API_URL}/admin/grammar/topics/${topic.Id}`, { headers: authHeaders() });
                                fetchTopics(cat.Id);
                                if (selectedTopic?.Id === topic.Id) setSelectedTopic(null);
                              } catch (err) {
                                toast.error('Không thể xóa chủ đề này');
                              }
                            }
                          }}><FiTrash2 size={12} /></button>
                          {selectedTopic?.Id === topic.Id ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                        </div>
                      </div>

                      {selectedTopic?.Id === topic.Id && (
                        <div className="p-4 border-t bg-gray-50/50">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bài tập (Quizzes)</h5>
                            <button className="btn btn-primary btn-xs" onClick={() => setShowQuizForm(true)}><FiPlus /> Thêm bài tập</button>
                          </div>

                          {showQuizForm && (
                            <div className="card p-4 mb-4 bg-white border-primary/20 shadow-md">
                              <h3 className="text-sm font-bold mb-4">{editingQuiz ? 'Sửa bài tập' : 'Thêm bài tập mới'}</h3>
                              <div className="flex flex-col gap-3">
                                <div><label className="form-label text-xs">Câu hỏi</label><input className="form-input form-input-sm" value={quizQ} onChange={e => setQuizQ(e.target.value)} /></div>
                                <div className="grid grid-2 gap-2">
                                  <div><label className="form-label text-xs">Option A</label><input className="form-input form-input-sm" value={qA} onChange={e => setQA(e.target.value)} /></div>
                                  <div><label className="form-label text-xs">Option B</label><input className="form-input form-input-sm" value={qB} onChange={e => setQB(e.target.value)} /></div>
                                  <div><label className="form-label text-xs">Option C</label><input className="form-input form-input-sm" value={qC} onChange={e => setQC(e.target.value)} /></div>
                                  <div><label className="form-label text-xs">Option D</label><input className="form-input form-input-sm" value={qD} onChange={e => setQD(e.target.value)} /></div>
                                </div>
                                <div className="grid grid-2 gap-2">
                                  <div>
                                    <label className="form-label text-xs">Đáp án đúng</label>
                                    <select className="form-input form-input-sm" value={qAns} onChange={e => setQAns(e.target.value)}>
                                      <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                    </select>
                                  </div>
                                  <div><label className="form-label text-xs">Giải thích</label><input className="form-input form-input-sm" value={qExp} onChange={e => setQExp(e.target.value)} /></div>
                                </div>
                              </div>
                              <div className="mt-4 flex gap-2">
                                <button className="btn btn-primary btn-sm" onClick={handleSaveQuiz}><FiSave /> Lưu</button>
                                <button className="btn btn-ghost btn-sm" onClick={closeQuizForm}><FiX /> Hủy</button>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            {quizzes.map((q, idx) => (
                              <div key={q.Id} className="p-3 bg-white border rounded shadow-sm flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{idx + 1}. {q.Question}</div>
                                  <div className="text-xs text-primary font-bold">Đáp án: {q.CorrectAnswer}</div>
                                </div>
                                <div className="flex gap-1">
                                  <button className="btn btn-ghost btn-xs" onClick={() => {
                                    setEditingQuiz(q); setQuizQ(textValue(q.Question)); setQA(textValue(q.OptionA)); setQB(textValue(q.OptionB)); setQC(textValue(q.OptionC)); setQD(textValue(q.OptionD)); setQAns(q.CorrectAnswer || 'A'); setQExp(textValue(q.Explanation)); setShowQuizForm(true);
                                  }}><FiEdit2 size={12} /></button>
                                  <button className="btn btn-ghost btn-xs text-error" onClick={async () => {
                                    if (window.confirm('Xóa bài tập?')) {
                                      try {
                                        await axios.delete(`${API_URL}/admin/grammar/quizzes/${q.Id}`, { headers: authHeaders() });
                                        fetchQuizzes(topic.Id);
                                      } catch (err) {
                                        toast.error('Không thể xóa bài tập');
                                      }
                                    }
                                  }}><FiTrash2 size={12} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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

export default AdminGrammar;
