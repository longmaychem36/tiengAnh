import React, { Suspense, lazy, useState, useEffect } from 'react';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { FiPlus, FiSave, FiX, FiUpload, FiCheck } from 'react-icons/fi';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import toast from 'react-hot-toast';
import { API_URL } from '../../api/config';

const ReactQuill = lazy(() => import('react-quill'));
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const textValue = (value) => value ?? '';
const numberValue = (value) => Number.parseInt(value, 10) || 0;
const GRAMMAR_ICON_OPTIONS = ['📘', '📖', '📝', '🔤', '🧩', '⏰', '⚡', '🎯', '💬', '❓', '✅', '📌', '🧠', '🏆', '🌟', '🔍', '📚', '🗂️'];

const MAX_SCAN_PAGES = 8;

function formatBytes(bytes) {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function dataUrlBytes(dataUrl) {
  const base64 = String(dataUrl || '').split(',')[1] || '';
  return Math.round((base64.length * 3) / 4);
}

function parsePageRange(input, totalPages) {
  const pages = new Set();
  String(input || '').split(',').forEach((part) => {
    const token = part.trim();
    if (!token) return;
    const match = token.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) return;
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    const from = Math.min(start, end);
    const to = Math.max(start, end);
    for (let page = from; page <= to; page += 1) {
      if (page >= 1 && page <= totalPages) pages.add(page);
    }
  });
  return Array.from(pages).sort((a, b) => a - b);
}

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
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfObjectUrl, setPdfObjectUrl] = useState('');
  const [pdfPages, setPdfPages] = useState([]);
  const [scanPageRange, setScanPageRange] = useState('1');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const selectedScanPages = new Set(pdfDoc ? parsePageRange(scanPageRange, pdfDoc.numPages) : []);

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

  useEffect(() => () => {
    if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
  }, [pdfObjectUrl]);

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

  const resetScanState = () => {
    setPdfDoc(null);
    setPdfFileName('');
    if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
    setPdfObjectUrl('');
    setPdfPages([]);
    setScanPageRange('1');
    setPdfLoading(false);
    setScanLoading(false);
  };

  const renderPdfPageDataUrl = async (doc, pageNumber, scale = 0.45) => {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    canvas.width = 0;
    canvas.height = 0;
    return { dataUrl, width: Math.round(viewport.width), height: Math.round(viewport.height) };
  };

  const renderPdfPageBlob = async (doc, pageNumber, scale = 2.4) => {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.94));
    canvas.width = 0;
    canvas.height = 0;
    return { blob, width: Math.round(viewport.width), height: Math.round(viewport.height) };
  };

  const handlePdfFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Vui lòng chọn file PDF');
      return;
    }
    setPdfLoading(true);
    setPdfPages([]);
    setScanPageRange('1');
    try {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
      const objectUrl = URL.createObjectURL(file);
      setPdfObjectUrl(objectUrl);
      const loadingTask = pdfjsLib.getDocument({ url: objectUrl });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setPdfFileName(file.name);
      toast.success(`Đã đọc PDF: ${doc.numPages} trang`);
    } catch {
      toast.error('Không thể đọc file PDF');
      setPdfDoc(null);
      setPdfFileName('');
    } finally {
      setPdfLoading(false);
      event.target.value = '';
    }
  };

  const toggleScanPage = (pageNumber) => {
    if (!pdfDoc) return;
    const current = parsePageRange(scanPageRange, pdfDoc.numPages);
    const next = current.includes(pageNumber)
      ? current.filter(page => page !== pageNumber)
      : [...current, pageNumber].sort((a, b) => a - b);
    if (next.length > MAX_SCAN_PAGES) {
      toast.error(`Chỉ scan tối đa ${MAX_SCAN_PAGES} trang mỗi lần`);
      return;
    }
    setScanPageRange(next.join(','));
  };

  const handleScanSelectedPages = async () => {
    if (!editingTopic?.Id) return toast.error('Vui lòng chọn chủ đề để scan');
    if (!pdfDoc) return toast.error('Vui lòng chọn file PDF');
    const pageNumbers = parsePageRange(scanPageRange, pdfDoc.numPages);
    if (pageNumbers.length === 0) return toast.error('Vui lòng chọn ít nhất một trang');
    if (pageNumbers.length > MAX_SCAN_PAGES) return toast.error(`Chỉ scan tối đa ${MAX_SCAN_PAGES} trang mỗi lần`);
    setScanLoading(true);
    try {
      const formData = new FormData();
      const selectedPages = [];
      const previews = [];
      for (const pageNumber of pageNumbers) {
        const thumb = await renderPdfPageDataUrl(pdfDoc, pageNumber);
        previews.push({
          pageNumber,
          thumbUrl: thumb.dataUrl,
          width: thumb.width,
          height: thumb.height,
          thumbBytes: dataUrlBytes(thumb.dataUrl)
        });
        const rendered = await renderPdfPageBlob(pdfDoc, pageNumber);
        if (!rendered.blob) throw new Error('Cannot render selected page');
        formData.append('pages', rendered.blob, `page-${pageNumber}.jpg`);
        selectedPages.push({ pageNumber, width: rendered.width, height: rendered.height });
      }
      setPdfPages(previews);
      formData.append('selectedPages', JSON.stringify(selectedPages));
      const res = await axios.post(`${API_URL}/admin/grammar/topics/${editingTopic.Id}/scan`, formData, {
        headers: authHeaders()
      });
      const scannedTopic = res.data.data || {};
      const nextContent = textValue(scannedTopic.Content ?? scannedTopic.content);
      setTopicContent(nextContent);
      toast.success('Đã scan nội dung vào trình soạn. Bấm Lưu để đăng.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Scan PDF thất bại');
    } finally {
      setScanLoading(false);
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
    resetScanState();
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
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => { resetScanState(); setShowTopicForm(true); }}><FiPlus /> Thêm chủ đề</button>
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
                        {editingTopic && (
                          <span className="is-wide">
                            <span>Scan PDF vào trình soạn</span>
                            <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
                              <div style={{ padding: 12, border: '1px solid var(--admin-border)', background: '#fff', borderRadius: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                  <div>
                                    <strong>Chọn file PDF và trang cần scan</strong>
                                    <p style={{ marginTop: 4, color: 'var(--admin-muted)', fontSize: 12 }}>
                                      {pdfFileName || 'PDF chỉ xử lý trong trình duyệt; backend chỉ nhận ảnh trang đã chọn.'}
                                    </p>
                                  </div>
                                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                                    <FiUpload /> Chọn PDF
                                    <input type="file" accept="application/pdf" onChange={handlePdfFileChange} style={{ display: 'none' }} />
                                  </label>
                                  {pdfDoc && (
                                    <label style={{ minWidth: 220, flex: 1 }}>
                                      <span>Nhập trang cần scan</span>
                                      <input className="form-input" value={scanPageRange} onChange={e => setScanPageRange(e.target.value)} placeholder="Ví dụ: 12-15,18" />
                                    </label>
                                  )}
                                </div>
                                <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', color: 'var(--admin-muted)', fontSize: 12 }}>
                                  <span>{pdfPages.length} trang</span>
                                  <span>{selectedScanPages.size} trang đã chọn</span>
                                  <span>Ước tính thumbnail: {formatBytes(pdfPages.filter(page => selectedScanPages.has(page.pageNumber)).reduce((sum, page) => sum + page.thumbBytes, 0))}</span>
                                  <span>Tối đa {MAX_SCAN_PAGES} trang/lần</span>
                                </div>
                              </div>
                              {pdfLoading && <div className="admin-empty-inline">Đang tạo ảnh xem trước PDF...</div>}
                              {pdfPages.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                                  {pdfPages.map(page => {
                                    const selected = selectedScanPages.has(page.pageNumber);
                                    return (
                                      <button
                                        type="button"
                                        key={page.pageNumber}
                                        onClick={() => toggleScanPage(page.pageNumber)}
                                        style={{ border: `2px solid ${selected ? 'var(--admin-primary)' : 'var(--admin-border)'}`, background: selected ? 'rgba(79,70,229,0.06)' : '#fff', borderRadius: 4, padding: 8, textAlign: 'left', cursor: 'pointer' }}
                                      >
                                        <img src={page.thumbUrl} alt={`Trang ${page.pageNumber}`} style={{ width: '100%', height: 150, objectFit: 'contain', background: '#f8fafc' }} />
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, fontSize: 12, fontWeight: 700 }}>
                                          Trang {page.pageNumber}
                                          {selected && <FiCheck />}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              <div className="admin-form-actions" style={{ justifyContent: 'flex-start' }}>
                                <button type="button" className="btn btn-primary" onClick={handleScanSelectedPages} disabled={scanLoading || selectedScanPages.size === 0}>
                                  <FiUpload /> {scanLoading ? 'Đang scan...' : 'Scan vào trình soạn'}
                                </button>
                              </div>
                            </div>
                          </span>
                        )}
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
                              resetScanState(); setEditingTopic(topic); setTopicTitle(textValue(topic.Title)); setTopicTitleVI(textValue(topic.TitleVI)); setTopicContent(textValue(topic.Content)); setTopicOrder(numberValue(topic.OrderIndex)); setShowTopicForm(true);
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
