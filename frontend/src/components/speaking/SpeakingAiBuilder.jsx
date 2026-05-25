import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCpu, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { speakingApi } from '../../api/speakingApi';
import { useAuth } from '../../hooks/useAuth';

const AI_TOPIC_OPTIONS = [
  'At a coffee shop',
  'Job interview',
  'Travel abroad',
  'Daily routine',
  'School and study',
  'Shopping',
  'Meeting new friends',
  'Health appointment'
];

function SpeakingAiBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canUseAi = user?.isPlus;
  const [topic, setTopic] = useState(AI_TOPIC_OPTIONS[0]);
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('beginner');
  const [questionCount, setQuestionCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!canUseAi) {
      toast.error('Vui lòng nâng cấp Plus để sử dụng tính năng này');
      navigate('/profile');
      return;
    }

    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      toast.error('Vui lòng nhập chủ đề luyện nói');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await speakingApi.generatePersonalizedLesson({
        topic: cleanTopic,
        goal: goal.trim(),
        level,
        questionCount
      });
      const sessionId = res.data?.sessionId;
      if (!sessionId) throw new Error('Không nhận được mã bài luyện AI');
      toast.success('Đã tạo bài luyện nói cá nhân');
      navigate(`/speaking/personalized/${sessionId}`);
    } catch (err) {
      toast.error(err.message || 'Không thể tạo bài luyện AI');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 820, margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/speaking/options')} style={{ marginBottom: 'var(--space-6)', padding: 0 }}>
        <FiArrowLeft /> Về lựa chọn Speaking
      </button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 6 }}>Tạo bài nói bằng AI</h1>
          </div>
          <span className={canUseAi ? 'badge badge-success' : 'badge badge-warning'}>
            {canUseAi ? 'PLUS' : 'Cần Plus'}
          </span>
        </div>

        {!canUseAi && (
          <div style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)', background: '#fffbeb', color: '#92400e', borderRadius: 'var(--radius-lg)', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontWeight: 600 }}>
            <FiLock /> Tính năng này yêu cầu tài khoản Plus.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <span className="form-label">Chủ đề</span>
            <input aria-label="Trường nhập"
              className="form-input"
              list="ai-speaking-topics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: At the airport"
              disabled={!canUseAi || isGenerating}
            />
            <datalist id="ai-speaking-topics">
              {AI_TOPIC_OPTIONS.map(item => <option key={item} value={item}>{item}</option>)}
            </datalist>
          </div>

          <div>
            <span className="form-label">Trình độ</span>
            <select aria-label="Lựa chọn" className="form-input" value={level} onChange={(e) => setLevel(e.target.value)} disabled={!canUseAi || isGenerating}>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung bình</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>

          <div>
            <span className="form-label">Số câu</span>
            <select aria-label="Lựa chọn" className="form-input" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} disabled={!canUseAi || isGenerating}>
              <option value={3}>3 câu - nhanh</option>
              <option value={5}>5 câu</option>
              <option value={8}>8 câu - lâu hơn</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <span className="form-label">Mục tiêu cá nhân</span>
          <input aria-label="Trường nhập"
            className="form-input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="VD: luyện gọi món lịch sự khi đi du lịch"
            disabled={!canUseAi || isGenerating}
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating || !topic.trim()} style={{ minWidth: 180 }}>
          <FiCpu /> {canUseAi ? (isGenerating ? 'Đang tạo...' : 'Tạo bài luyện') : 'Nâng cấp Plus'}
        </button>
      </motion.div>
    </div>
  );
}

export default SpeakingAiBuilder;
