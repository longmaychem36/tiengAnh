import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiChevronDown,
  FiChevronRight,
  FiArrowDown,
  FiArrowUp,
  FiEdit2,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '../../api/config';

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
  Level: '',
  Topic: '',
  Objective: '',
  Duration: '',
  PassageTitle: '',
  AudioUrl: '',
  IsFoundation: false,
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

const emptySpeaker = {
  Name: '',
  Gender: 'female',
  VoiceName: '',
  VoiceURI: '',
  OrderIndex: 0
};

function AdminReceptive({ skill }) {
  const meta = SKILL_META[skill];
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [speakerItems, setSpeakerItems] = useState([]);
  const [vocabItems, setVocabItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [voices, setVoices] = useState([]);

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);

  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentForm, setContentForm] = useState({ SpeakerId: '', Speaker: '', Text: '', Content: '', OrderIndex: 0 });

  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [speakerForm, setSpeakerForm] = useState(emptySpeaker);

  const [showVocabForm, setShowVocabForm] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [vocabForm, setVocabForm] = useState({ Word: '', Meaning: '', OrderIndex: 0 });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);

  useEffect(() => {
    setSelectedLesson(null);
    setContentItems([]);
    setSpeakerItems([]);
    setVocabItems([]);
    setQuestions([]);
    closeLessonForm();
    fetchLessons();
  }, [skill]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices().filter((voice) => voice.lang?.startsWith('en')));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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
      const [contentRes, vocabRes, questionRes, speakerRes] = await Promise.all([
        axios.get(`${API_URL}/admin/${skill}/lessons/${lessonId}/${meta.childPath}`, { headers: authHeaders() }),
        axios.get(`${API_URL}/admin/${skill}/lessons/${lessonId}/vocab`, { headers: authHeaders() }),
        axios.get(`${API_URL}/admin/${skill}/lessons/${lessonId}/questions`, { headers: authHeaders() }),
        skill === 'listening'
          ? axios.get(`${API_URL}/admin/listening/lessons/${lessonId}/speakers`, { headers: authHeaders() })
          : Promise.resolve({ data: { data: [] } })
      ]);
      setContentItems(contentRes.data.data || []);
      setVocabItems(vocabRes.data.data || []);
      setQuestions(questionRes.data.data || []);
      setSpeakerItems(speakerRes.data.data || []);
    } catch (err) {
      toast.error('Lỗi tải nội dung bài học');
    }
  };

  const getNextLessonOrder = () => (
    lessons.length ? Math.max(...lessons.map((lesson) => Number(lesson.OrderIndex || 0))) + 1 : 1
  );

  const openNewLessonForm = () => {
    setEditingLesson(null);
    setLessonForm({ ...emptyLesson, OrderIndex: getNextLessonOrder() });
    setShowLessonForm(true);
  };

  const buildLessonPayload = (lesson, orderIndex = lesson.OrderIndex) => ({
    Title: lesson.Title,
    Description: lesson.Description || '',
    Level: lesson.Level || '',
    Topic: lesson.Topic || '',
    Objective: lesson.Objective || '',
    Duration: lesson.Duration || '',
    PassageTitle: lesson.PassageTitle || '',
    AudioUrl: lesson.AudioUrl || '',
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
        axios.put(`${API_URL}/admin/${skill}/lessons/${lesson.Id}`, buildLessonPayload(lesson, index + 1), { headers: authHeaders() })
      )));
      toast.success('Đã cập nhật thứ tự bài học');
      fetchLessons();
    } catch (err) {
      toast.error('Lỗi cập nhật thứ tự bài học');
    }
  };

  const selectLesson = (lesson) => {
    if (selectedLesson?.Id === lesson.Id) {
      setSelectedLesson(null);
      setContentItems([]);
      setSpeakerItems([]);
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

  const updateSpeakerField = (field, value) => {
    if (field === 'VoiceURI') {
      const voice = voices.find((item) => item.voiceURI === value);
      setSpeakerForm((current) => ({
        ...current,
        VoiceURI: value,
        VoiceName: voice?.name || ''
      }));
      return;
    }

    setSpeakerForm((current) => ({ ...current, [field]: value }));
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
    if (skill === 'listening' && !payload.SpeakerId) {
      toast.error('Vui lòng chọn người nói cho dòng transcript');
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

  const handleSaveSpeaker = async () => {
    if (!selectedLesson) return;
    if (!speakerForm.Name.trim()) {
      toast.error('Vui lòng nhập tên người nói');
      return;
    }

    const payload = { ...speakerForm, LessonId: selectedLesson.Id };
    try {
      if (editingSpeaker) {
        await axios.put(`${API_URL}/admin/listening/speakers/${editingSpeaker.Id}`, payload, { headers: authHeaders() });
        toast.success('Đã cập nhật người nói');
      } else {
        await axios.post(`${API_URL}/admin/listening/speakers`, payload, { headers: authHeaders() });
        toast.success('Đã thêm người nói');
      }
      closeSpeakerForm();
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error('Lỗi lưu người nói');
    }
  };

  const getSpeakerUsageCount = (speakerId) => (
    contentItems.filter((item) => String(item.SpeakerId) === String(speakerId)).length
  );

  const handleDeleteSpeaker = async (speakerId) => {
    const usageCount = getSpeakerUsageCount(speakerId);
    if (usageCount > 0) {
      toast.error(`Không thể xóa: người nói đang được chọn trong ${usageCount} dòng transcript`);
      return;
    }

    if (!window.confirm('Xóa người nói này?')) return;
    try {
      await axios.delete(`${API_URL}/admin/listening/speakers/${speakerId}`, { headers: authHeaders() });
      toast.success('Đã xóa người nói');
      fetchLessonChildren(selectedLesson.Id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xóa người nói');
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
    setContentForm({ SpeakerId: '', Speaker: '', Text: '', Content: '', OrderIndex: 0 });
  };

  const closeSpeakerForm = () => {
    setShowSpeakerForm(false);
    setEditingSpeaker(null);
    setSpeakerForm(emptySpeaker);
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
    closeSpeakerForm();
    closeVocabForm();
    closeQuestionForm();
  };

  const startEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      Title: lesson.Title || '',
      Description: lesson.Description || '',
      Level: lesson.Level || '',
      Topic: lesson.Topic || '',
      Objective: lesson.Objective || '',
      Duration: lesson.Duration || '',
      PassageTitle: lesson.PassageTitle || '',
      AudioUrl: lesson.AudioUrl || '',
      IsFoundation: Boolean(lesson.IsFoundation),
      OrderIndex: lesson.OrderIndex || 0
    });
    setShowLessonForm(true);
  };

  const startEditContent = (item) => {
    setEditingContent(item);
    setContentForm({
      SpeakerId: item.SpeakerId || '',
      Speaker: item.Speaker || '',
      Text: item.Text || '',
      Content: item.Content || '',
      OrderIndex: item.OrderIndex || 0
    });
    setShowContentForm(true);
  };

  const startEditSpeaker = (item) => {
    setEditingSpeaker(item);
    setSpeakerForm({
      Name: item.Name || '',
      Gender: item.Gender || 'female',
      VoiceName: item.VoiceName || '',
      VoiceURI: item.VoiceURI || '',
      OrderIndex: item.OrderIndex || 0
    });
    setShowSpeakerForm(true);
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

  const renderLessonForm = () => (
    <div className={`admin-receptive-form ${editingLesson ? 'admin-inline-edit-form' : ''}`}>
      <h3>{editingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}</h3>
      <div className="admin-form-grid">
        <span>
          <span>Tiêu đề</span>
          <input aria-label="Tiêu đề bài học" className="form-input" value={lessonForm.Title} onChange={(event) => updateLessonField('Title', event.target.value)} />
        </span>
        <span>
          <span>Cấp độ</span>
          <select aria-label="Cấp độ bài học" className="form-input" value={lessonForm.Level} onChange={(event) => updateLessonField('Level', event.target.value)}>
            <option value="">Chưa đặt cấp độ</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </span>
        <span>
          <span>Chủ đề</span>
          <input aria-label="Chủ đề bài học" className="form-input" value={lessonForm.Topic} onChange={(event) => updateLessonField('Topic', event.target.value)} />
        </span>
        <span>
          <span>Thời lượng</span>
          <input aria-label="Thời lượng bài học" className="form-input" value={lessonForm.Duration} onChange={(event) => updateLessonField('Duration', event.target.value)} placeholder="VD: 10 phút" />
        </span>
        {skill === 'reading' && (
          <span>
            <span>Tiêu đề bài đọc</span>
            <input aria-label="Tiêu đề bài đọc" className="form-input" value={lessonForm.PassageTitle} onChange={(event) => updateLessonField('PassageTitle', event.target.value)} />
          </span>
        )}
        {skill === 'listening' && (
          <span>
            <span>Audio URL</span>
            <input aria-label="Audio URL" className="form-input" value={lessonForm.AudioUrl} onChange={(event) => updateLessonField('AudioUrl', event.target.value)} />
          </span>
        )}
        <span>
          <span>Thứ tự</span>
          <input aria-label="Thứ tự bài học" className="form-input" type="number" value={lessonForm.OrderIndex} onChange={(event) => updateLessonField('OrderIndex', event.target.value)} />
        </span>
        <label className="admin-check-row">
          <input type="checkbox" checked={Boolean(lessonForm.IsFoundation)} onChange={(event) => updateLessonField('IsFoundation', event.target.checked)} />
          <span>Bài nền tảng</span>
        </label>
        <span className="is-wide">
          <span>Mô tả</span>
          <textarea aria-label="Mô tả bài học" className="form-input" rows={2} value={lessonForm.Description} onChange={(event) => updateLessonField('Description', event.target.value)} />
        </span>
        <span className="is-wide">
          <span>Mục tiêu</span>
          <textarea aria-label="Mục tiêu bài học" className="form-input" rows={2} value={lessonForm.Objective} onChange={(event) => updateLessonField('Objective', event.target.value)} />
        </span>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-primary" onClick={handleSaveLesson}><FiSave /> Lưu</button>
        <button type="button" className="btn btn-ghost" onClick={closeLessonForm}><FiX /> Hủy</button>
      </div>
    </div>
  );

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="fade-in admin-receptive-page">
      <div className="admin-receptive-header">
        <div>
          <h1>{meta.title}</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNewLessonForm}>
          <FiPlus /> Thêm bài học
        </button>
      </div>

      {showLessonForm && !editingLesson && renderLessonForm()}

      <div className="admin-receptive-list">
        {lessons.map((lesson, index) => (
          <div key={lesson.Id} className={`admin-receptive-card ${selectedLesson?.Id === lesson.Id ? 'is-active' : ''}`}>
            <div className="admin-receptive-card-head">
              <button type="button" className="admin-receptive-title" onClick={() => selectLesson(lesson)}>
                <span className="admin-expand-label">{selectedLesson?.Id === lesson.Id ? 'Đóng' : 'Mở'}</span>
                <div>
                  <strong>{lesson.Title}</strong>
                  <span>{lesson.Level || 'Chưa đặt cấp độ'} · {lesson.Topic || 'Chưa có chủ đề'} · {lesson.Duration || 'Chưa đặt thời lượng'}</span>
                  <p className="admin-order-badge">STT {index + 1}</p>
                </div>
              </button>
              <div className="admin-inline-actions">
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === 0} onClick={() => handleMoveLesson(lesson.Id, -1)}>Lên</button>
                <button type="button" className="btn btn-ghost btn-sm" disabled={index === lessons.length - 1} onClick={() => handleMoveLesson(lesson.Id, 1)}>Xuống</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEditLesson(lesson)}>Sửa</button>
                <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={() => handleDeleteLesson(lesson.Id)}>Xóa</button>
              </div>
            </div>

            {showLessonForm && editingLesson?.Id === lesson.Id && renderLessonForm()}

            {selectedLesson?.Id === lesson.Id && (
              <div className="admin-receptive-detail">
                {skill === 'listening' && (
                  <AdminPanel title="Người nói" actionLabel="Thêm người nói" onAdd={() => setShowSpeakerForm(true)}>
                    {showSpeakerForm && (
                      <SpeakerForm
                        form={speakerForm}
                        editing={editingSpeaker}
                        voices={voices}
                        onChange={updateSpeakerField}
                        onSave={handleSaveSpeaker}
                        onCancel={closeSpeakerForm}
                      />
                    )}
                    <div className="admin-item-list">
                    {speakerItems.map((item) => {
                      const usageCount = getSpeakerUsageCount(item.Id);
                      return (
                        <AdminItem
                          key={item.Id}
                          onEdit={() => startEditSpeaker(item)}
                          onDelete={() => handleDeleteSpeaker(item.Id)}
                          deleteDisabled={usageCount > 0}
                          deleteTitle={usageCount > 0 ? `Đang được dùng trong ${usageCount} dòng transcript` : 'Xóa người nói'}
                        >
                          <strong>{item.Name}</strong>
                          <p>
                            {speakerLabel(item)} · {item.VoiceName || 'Tự chọn giọng phù hợp trên trình duyệt'}
                            {usageCount > 0 && ` · Đang dùng trong ${usageCount} dòng transcript`}
                          </p>
                        </AdminItem>
                      );
                    })}
                      {speakerItems.length === 0 && !showSpeakerForm && <EmptyState text="Thêm người nói trước khi nhập transcript." />}
                    </div>
                  </AdminPanel>
                )}

                <AdminPanel
                  title={meta.childLabel}
                  actionLabel={meta.childAddLabel}
                  onAdd={() => {
                    if (skill === 'listening' && speakerItems.length === 0) {
                      toast.error('Vui lòng thêm người nói trước khi thêm transcript');
                      return;
                    }
                    setShowContentForm(true);
                  }}
                >
                  {showContentForm && (
                    <ContentForm
                      skill={skill}
                      form={contentForm}
                      speakers={speakerItems}
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
                            <strong>{item.SpeakerName || item.Speaker || 'Narrator'}</strong>
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
                        <button type="button" onClick={() => startEditVocab(item)}>Sửa</button>
                        <button type="button" onClick={() => handleDeleteVocab(item.Id)}>Xóa</button>
                      </span>
                    ))}
                    {vocabItems.length === 0 && !showVocabForm && <EmptyState text="Chưa có từ vựng." />}
                  </div>
                </AdminPanel>

                <AdminPanel title="Câu hỏi" actionLabel="Thêm câu hỏi" onAdd={() => { closeQuestionForm(); setShowQuestionForm(true); }}>
                  {showQuestionForm && !editingQuestion && (
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
                      <div key={item.Id}>
                        <AdminItem onEdit={() => startEditQuestion(item)} onDelete={() => handleDeleteQuestion(item.Id)}>
                          <strong>{item.Prompt}</strong>
                          <p>{item.QuestionType} · Đáp án: {item.QuestionType === 'true_false' ? String(item.CorrectBoolean) : item.CorrectAnswer}</p>
                        </AdminItem>
                        {showQuestionForm && editingQuestion?.Id === item.Id && (
                          <QuestionForm
                            form={questionForm}
                            editing={editingQuestion}
                            onChange={updateQuestionField}
                            onSave={handleSaveQuestion}
                            onCancel={closeQuestionForm}
                          />
                        )}
                      </div>
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
        <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}><FiPlus /> {actionLabel}</button>
      </div>
      {children}
    </section>
  );
}

function AdminItem({ children, onEdit, onDelete, deleteDisabled = false, deleteTitle = 'Xóa' }) {
  return (
    <div className="admin-list-item">
      <div>{children}</div>
      <div className="admin-inline-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>Sửa</button>
        <button
          type="button"
          className="btn btn-ghost btn-sm is-danger"
          onClick={onDelete}
          disabled={deleteDisabled}
          title={deleteTitle}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="admin-empty-inline">{text}</div>;
}

function speakerLabel(item) {
  const genderMap = { female: 'Nữ', male: 'Nam', neutral: 'Trung tính' };
  return genderMap[item.Gender] || item.Gender || 'Nữ';
}

function SpeakerForm({ form, editing, voices, onChange, onSave, onCancel }) {
  return (
    <div className="admin-nested-form">
      <div className="admin-form-grid">
        <span>
          <span>Tên người nói</span>
          <input aria-label="Trường nhập" className="form-input" value={form.Name} onChange={(event) => onChange('Name', event.target.value)} placeholder="VD: Anna, Mark, Narrator" />
        </span>
        <span>
          <span>Giới tính</span>
          <select aria-label="Lựa chọn" className="form-input" value={form.Gender} onChange={(event) => onChange('Gender', event.target.value)}>
            <option value="female">Nữ</option>
            <option value="male">Nam</option>
            <option value="neutral">Trung tính</option>
          </select>
        </span>
        <span>
          <span>Giọng đọc trình duyệt</span>
          <select aria-label="Lựa chọn" className="form-input" value={form.VoiceURI} onChange={(event) => onChange('VoiceURI', event.target.value)}>
            <option value="">Tự chọn theo giới tính</option>
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>
            ))}
          </select>
        </span>
        <span>
          <span>Thứ tự</span>
          <input aria-label="Trường nhập" className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
        </span>
      </div>
      <FormActions editing={editing} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function ContentForm({ skill, form, speakers = [], editing, onChange, onSave, onCancel }) {
  return (
    <div className="admin-nested-form">
      <div className="admin-form-grid">
        {skill === 'listening' ? (
          <>
            <span>
              <span>Người nói</span>
              <select aria-label="Lựa chọn" className="form-input" value={form.SpeakerId} onChange={(event) => onChange('SpeakerId', event.target.value)}>
                <option value="">Chọn người nói</option>
                {speakers.map((speaker) => (
                  <option key={speaker.Id} value={speaker.Id}>{speaker.Name} - {speakerLabel(speaker)}</option>
                ))}
              </select>
            </span>
            <span>
              <span>Thứ tự</span>
              <input aria-label="Trường nhập" className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
            </span>
            <span className="is-wide">
              <span>Nội dung transcript</span>
              <textarea aria-label="Nội dung" className="form-input" rows={3} value={form.Text} onChange={(event) => onChange('Text', event.target.value)} />
            </span>
          </>
        ) : (
          <>
            <span>
              <span>Thứ tự</span>
              <input aria-label="Trường nhập" className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
            </span>
            <span className="is-wide">
              <span>Nội dung đoạn đọc</span>
              <textarea aria-label="Nội dung" className="form-input" rows={4} value={form.Content} onChange={(event) => onChange('Content', event.target.value)} />
            </span>
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
        <span>
          <span>Từ</span>
          <input aria-label="Trường nhập" className="form-input" value={form.Word} onChange={(event) => onChange('Word', event.target.value)} />
        </span>
        <span>
          <span>Nghĩa</span>
          <input aria-label="Trường nhập" className="form-input" value={form.Meaning} onChange={(event) => onChange('Meaning', event.target.value)} />
        </span>
        <span>
          <span>Thứ tự</span>
          <input aria-label="Trường nhập" className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
        </span>
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
        <span>
          <span>Loại câu hỏi</span>
          <select aria-label="Lựa chọn" className="form-input" value={form.QuestionType} onChange={(event) => onChange('QuestionType', event.target.value)}>
            <option value="multiple_choice">Multiple choice</option>
            <option value="true_false">True / False</option>
            <option value="fill_blank">Fill blank</option>
          </select>
        </span>
        <span>
          <span>Thứ tự</span>
          <input aria-label="Trường nhập" className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', event.target.value)} />
        </span>
        <span className="is-wide">
          <span>Câu hỏi</span>
          <textarea aria-label="Nội dung" className="form-input" rows={2} value={form.Prompt} onChange={(event) => onChange('Prompt', event.target.value)} />
        </span>
        {!isBoolean && !isBlank && (
          <>
            <span>
              <span>Option A</span>
              <input aria-label="Trường nhập" className="form-input" value={form.OptionA} onChange={(event) => onChange('OptionA', event.target.value)} />
            </span>
            <span>
              <span>Option B</span>
              <input aria-label="Trường nhập" className="form-input" value={form.OptionB} onChange={(event) => onChange('OptionB', event.target.value)} />
            </span>
            <span>
              <span>Option C</span>
              <input aria-label="Trường nhập" className="form-input" value={form.OptionC} onChange={(event) => onChange('OptionC', event.target.value)} />
            </span>
            <span>
              <span>Option D</span>
              <input aria-label="Trường nhập" className="form-input" value={form.OptionD} onChange={(event) => onChange('OptionD', event.target.value)} />
            </span>
          </>
        )}
        {isBoolean ? (
          <span>
            <span>Đáp án</span>
            <select aria-label="Lựa chọn" className="form-input" value={String(form.CorrectBoolean)} onChange={(event) => onChange('CorrectBoolean', event.target.value === 'true')}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </span>
        ) : (
          <span>
            <span>Đáp án đúng</span>
            <input aria-label="Trường nhập" className="form-input" value={form.CorrectAnswer} onChange={(event) => onChange('CorrectAnswer', event.target.value)} />
          </span>
        )}
        {isBlank && (
          <span className="is-wide">
            <span>Đáp án chấp nhận thêm</span>
            <textarea aria-label="Nội dung" className="form-input" rows={2} value={form.AcceptedAnswers} onChange={(event) => onChange('AcceptedAnswers', event.target.value)} placeholder="Mỗi đáp án một dòng hoặc cách nhau bằng dấu phẩy" />
          </span>
        )}
        <span className="is-wide">
          <span>Giải thích</span>
          <textarea aria-label="Nội dung" className="form-input" rows={2} value={form.Explanation} onChange={(event) => onChange('Explanation', event.target.value)} />
        </span>
      </div>
      <FormActions editing={editing} onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

function FormActions({ editing, onSave, onCancel }) {
  return (
    <div className="admin-form-actions">
      <button type="button" className="btn btn-primary btn-sm" onClick={onSave}><FiSave /> {editing ? 'Cập nhật' : 'Lưu'}</button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}><FiX /> Hủy</button>
    </div>
  );
}

export default AdminReceptive;
