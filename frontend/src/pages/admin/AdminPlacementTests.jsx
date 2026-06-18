import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronRight, FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

const emptyTest = { Title: '', Description: '', IsActive: true, OrderIndex: 0 };
const emptyQuestion = {
  QuestionType: 'multiple_choice',
  Skill: 'general',
  Difficulty: 'easy',
  Weight: 1,
  ContextText: '',
  Prompt: '',
  OptionA: '',
  OptionB: '',
  OptionC: '',
  OptionD: '',
  CorrectAnswer: '',
  AcceptedAnswers: '',
  Explanation: '',
  SourceSkill: '',
  SourceQuestionId: '',
  OrderIndex: 0
};

function AdminPlacementTests() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [testForm, setTestForm] = useState(emptyTest);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPlacementTests();
      setTests(res.data || []);
    } catch (err) {
      toast.error('Không tải được bài kiểm tra đầu vào.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (test) => {
    try {
      const res = await adminApi.getPlacementQuestions(test.Id);
      setQuestions(res.data || []);
    } catch (err) {
      toast.error('Không tải được câu hỏi.');
    }
  };

  const openNewTest = () => {
    setEditingTest(null);
    setTestForm({
      ...emptyTest,
      OrderIndex: tests.length ? Math.max(...tests.map((item) => Number(item.OrderIndex || 0))) + 1 : 1
    });
    setShowTestForm(true);
  };

  const openEditTest = (test) => {
    setEditingTest(test);
    setTestForm({
      Title: test.Title || '',
      Description: test.Description || '',
      IsActive: Boolean(test.IsActive),
      OrderIndex: test.OrderIndex || 0
    });
    setShowTestForm(true);
  };

  const saveTest = async () => {
    if (!testForm.Title.trim()) return toast.error('Nhập tiêu đề bài test.');
    try {
      if (editingTest) {
        await adminApi.updatePlacementTest(editingTest.Id, testForm);
        toast.success('Đã cập nhật bài test.');
      } else {
        await adminApi.createPlacementTest(testForm);
        toast.success('Đã tạo bài test.');
      }
      setShowTestForm(false);
      setEditingTest(null);
      setTestForm(emptyTest);
      await fetchTests();
    } catch (err) {
      toast.error('Không lưu được bài test.');
    }
  };

  const deleteTest = async (test) => {
    if (!window.confirm('Xóa bài test và toàn bộ câu hỏi?')) return;
    try {
      await adminApi.deletePlacementTest(test.Id);
      toast.success('Đã xóa bài test.');
      if (selectedTest?.Id === test.Id) {
        setSelectedTest(null);
        setQuestions([]);
      }
      fetchTests();
    } catch (err) {
      toast.error('Không xóa được bài test.');
    }
  };

  const selectTest = (test) => {
    if (selectedTest?.Id === test.Id) {
      setSelectedTest(null);
      setQuestions([]);
      return;
    }
    setSelectedTest(test);
    setShowQuestionForm(false);
    setEditingQuestion(null);
    fetchQuestions(test);
  };

  const openNewQuestion = () => {
    if (!selectedTest) return;
    setEditingQuestion(null);
    setQuestionForm({
      ...emptyQuestion,
      TestId: selectedTest.Id,
      OrderIndex: questions.length ? Math.max(...questions.map((item) => Number(item.OrderIndex || 0))) + 1 : 1
    });
    setShowQuestionForm(true);
  };

  const openEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionForm({
      TestId: selectedTest.Id,
      QuestionType: question.QuestionType || 'multiple_choice',
      Skill: question.Skill || 'general',
      Difficulty: question.Difficulty || 'easy',
      Weight: question.Weight || 1,
      ContextText: question.ContextText || '',
      Prompt: question.Prompt || '',
      OptionA: question.OptionA || '',
      OptionB: question.OptionB || '',
      OptionC: question.OptionC || '',
      OptionD: question.OptionD || '',
      CorrectAnswer: question.CorrectAnswer || '',
      AcceptedAnswers: question.AcceptedAnswers || '',
      Explanation: question.Explanation || '',
      SourceSkill: question.SourceSkill || '',
      SourceQuestionId: question.SourceQuestionId || '',
      OrderIndex: question.OrderIndex || 0
    });
    setShowQuestionForm(true);
  };

  const saveQuestion = async () => {
    if (!selectedTest) return;
    if (!questionForm.Prompt.trim()) return toast.error('Nhập câu hỏi.');
    try {
      const payload = { ...questionForm, TestId: selectedTest.Id };
      if (editingQuestion) {
        await adminApi.updatePlacementQuestion(editingQuestion.Id, payload);
        toast.success('Đã cập nhật câu hỏi.');
      } else {
        await adminApi.createPlacementQuestion(payload);
        toast.success('Đã thêm câu hỏi.');
      }
      setShowQuestionForm(false);
      setEditingQuestion(null);
      setQuestionForm(emptyQuestion);
      fetchQuestions(selectedTest);
      fetchTests();
    } catch (err) {
      toast.error('Không lưu được câu hỏi.');
    }
  };

  const deleteQuestion = async (question) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await adminApi.deletePlacementQuestion(question.Id);
      toast.success('Đã xóa câu hỏi.');
      fetchQuestions(selectedTest);
      fetchTests();
    } catch (err) {
      toast.error('Không xóa được câu hỏi.');
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="admin-placement-page fade-in">
      <div className="admin-receptive-header">
        <div>
          <h1>Kiểm tra đầu vào</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNewTest}>
          <FiPlus /> Thêm bài test
        </button>
      </div>

      {showTestForm && (
        <section className="admin-receptive-form">
          <h3>{editingTest ? 'Sửa bài test' : 'Thêm bài test'}</h3>
          <div className="admin-form-grid">
            <label>
              <span>Tiêu đề</span>
              <input className="form-input" value={testForm.Title} onChange={(event) => setTestForm({ ...testForm, Title: event.target.value })} />
            </label>
            <label>
              <span>Thứ tự</span>
              <input className="form-input" type="number" value={testForm.OrderIndex} onChange={(event) => setTestForm({ ...testForm, OrderIndex: Number(event.target.value) })} />
            </label>
            <label className="is-wide">
              <span>Mô tả</span>
              <textarea className="form-input" rows={2} value={testForm.Description} onChange={(event) => setTestForm({ ...testForm, Description: event.target.value })} />
            </label>
            <label className="admin-check-row">
              <input type="checkbox" checked={testForm.IsActive} onChange={(event) => setTestForm({ ...testForm, IsActive: event.target.checked })} />
              <span>Đang bật</span>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="button" className="btn btn-primary" onClick={saveTest}><FiSave /> Lưu</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowTestForm(false)}><FiX /> Hủy</button>
          </div>
        </section>
      )}

      <div className="admin-receptive-list">
        {tests.map((test) => (
          <article key={test.Id} className={`admin-receptive-card ${selectedTest?.Id === test.Id ? 'is-active' : ''}`}>
            <div className="admin-receptive-card-head">
              <button type="button" className="admin-receptive-title" onClick={() => selectTest(test)}>
                <span className="admin-expand-label">{selectedTest?.Id === test.Id ? 'Đóng' : 'Mở'}</span>
                <div>
                  <strong>{test.Title}</strong>
                  <span>{test.QuestionCount || 0} câu · {test.IsActive ? 'Đang bật' : 'Đang tắt'}</span>
                  <p className="admin-order-badge">STT {test.OrderIndex || 0}</p>
                </div>
              </button>
              <div className="admin-inline-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEditTest(test)}>Sửa</button>
                <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={() => deleteTest(test)}>Xóa</button>
              </div>
            </div>

            {selectedTest?.Id === test.Id && (
              <div className="admin-receptive-detail">
                <section className="admin-subpanel">
                  <div className="admin-subpanel-head">
                    <h3>Câu hỏi</h3>
                    <button type="button" className="btn btn-primary btn-sm" onClick={openNewQuestion}><FiPlus /> Thêm câu hỏi</button>
                  </div>

                  {showQuestionForm && (
                    <QuestionForm
                      form={questionForm}
                      editing={editingQuestion}
                      onChange={(field, value) => setQuestionForm((current) => ({ ...current, [field]: value }))}
                      onSave={saveQuestion}
                      onCancel={() => setShowQuestionForm(false)}
                    />
                  )}

                  <div className="admin-item-list">
                    {questions.map((question) => (
                      <div className="admin-list-item" key={question.Id}>
                        <div>
                          <strong>{question.Prompt}</strong>
                          <p>{question.QuestionType} · {question.Skill} · {question.Difficulty || 'easy'} x{question.Weight || 1} · Đáp án: {question.CorrectAnswer}</p>
                        </div>
                        <div className="admin-inline-actions">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEditQuestion(question)}>Sửa</button>
                          <button type="button" className="btn btn-ghost btn-sm is-danger" onClick={() => deleteQuestion(question)}>Xóa</button>
                        </div>
                      </div>
                    ))}
                    {questions.length === 0 && <div className="admin-empty-inline">Chưa có câu hỏi.</div>}
                  </div>
                </section>
              </div>
            )}
          </article>
        ))}
        {tests.length === 0 && <div className="admin-empty-inline">Chưa có bài test.</div>}
      </div>
    </div>
  );
}

function QuestionForm({ form, editing, onChange, onSave, onCancel }) {
  const needsOptions = !['fill_blank', 'short_answer'].includes(form.QuestionType);

  return (
    <div className="admin-nested-form">
      <div className="admin-form-grid">
        <label>
          <span>Loại câu</span>
          <select className="form-input" value={form.QuestionType} onChange={(event) => onChange('QuestionType', event.target.value)}>
            <option value="multiple_choice">Trắc nghiệm</option>
            <option value="best_reply">Chọn phản hồi</option>
            <option value="fill_blank">Điền từ</option>
            <option value="short_answer">Trả lời ngắn</option>
          </select>
        </label>
        <label>
          <span>Kỹ năng</span>
          <select className="form-input" value={form.Skill} onChange={(event) => onChange('Skill', event.target.value)}>
            <option value="general">Tổng hợp</option>
            <option value="listening">Nghe</option>
            <option value="speaking">Nói</option>
            <option value="reading">Đọc</option>
            <option value="writing">Viết</option>
          </select>
        </label>
        <label>
          <span>Độ khó</span>
          <select
            className="form-input"
            value={form.Difficulty}
            onChange={(event) => {
              const difficulty = event.target.value;
              onChange('Difficulty', difficulty);
              onChange('Weight', difficulty === 'hard' ? 1.25 : 1);
            }}
          >
            <option value="easy">Dễ</option>
            <option value="hard">Khó</option>
          </select>
        </label>
        <label>
          <span>Trọng số</span>
          <input className="form-input" type="number" step="0.05" min="0.1" value={form.Weight} onChange={(event) => onChange('Weight', Number(event.target.value))} />
        </label>
        <label>
          <span>Thứ tự</span>
          <input className="form-input" type="number" value={form.OrderIndex} onChange={(event) => onChange('OrderIndex', Number(event.target.value))} />
        </label>
        <label className="is-wide">
          <span>Ngữ cảnh / audio text / đoạn đọc</span>
          <textarea className="form-input" rows={3} value={form.ContextText} onChange={(event) => onChange('ContextText', event.target.value)} />
        </label>
        <label className="is-wide">
          <span>Câu hỏi</span>
          <textarea className="form-input" rows={2} value={form.Prompt} onChange={(event) => onChange('Prompt', event.target.value)} />
        </label>
        {needsOptions && ['OptionA', 'OptionB', 'OptionC', 'OptionD'].map((field, index) => (
          <label key={field}>
            <span>Đáp án {index + 1}</span>
            <input className="form-input" value={form[field]} onChange={(event) => onChange(field, event.target.value)} />
          </label>
        ))}
        <label>
          <span>Đáp án đúng</span>
          <input className="form-input" value={form.CorrectAnswer} onChange={(event) => onChange('CorrectAnswer', event.target.value)} />
        </label>
        <label className="is-wide">
          <span>Đáp án chấp nhận thêm</span>
          <textarea className="form-input" rows={2} value={form.AcceptedAnswers} onChange={(event) => onChange('AcceptedAnswers', event.target.value)} />
        </label>
        <label className="is-wide">
          <span>Giải thích</span>
          <textarea className="form-input" rows={2} value={form.Explanation} onChange={(event) => onChange('Explanation', event.target.value)} />
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={onSave}><FiSave /> {editing ? 'Cập nhật' : 'Lưu'}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}><FiX /> Hủy</button>
      </div>
    </div>
  );
}

export default AdminPlacementTests;
