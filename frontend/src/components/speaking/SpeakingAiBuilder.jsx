import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCpu, FiLock, FiMessageCircle, FiPlay } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { speakingApi } from '../../api/speakingApi';
import { useAuth } from '../../hooks/useAuth';
import {
  createSpeakingConversationSnapshot,
  getLatestActiveSpeakingConversation
} from '../../utils/speakingConversationStorage';

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
  const canUseAi = Boolean(user?.isPlus || user?.plan === 'plus');
  const [topic, setTopic] = useState(AI_TOPIC_OPTIONS[0]);
  const [level, setLevel] = useState('beginner');
  const [targetTurns, setTargetTurns] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentConversation, setRecentConversation] = useState(null);

  useEffect(() => {
    setRecentConversation(getLatestActiveSpeakingConversation());
  }, []);

  const handleGenerate = async () => {
    if (!canUseAi) {
      toast.error('Vui lòng nâng cấp Plus để sử dụng tính năng này.');
      navigate('/profile');
      return;
    }
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      toast.error('Vui lòng nhập chủ đề hội thoại.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await speakingApi.generatePersonalizedLesson({ topic: cleanTopic, level, targetTurns });
      const snapshot = createSpeakingConversationSnapshot(response.data);
      toast.success('Đã tạo cuộc hội thoại mới.');
      navigate(`/speaking/personalized/${snapshot.sessionId}`);
    } catch (error) {
      toast.error(error.message || 'Không thể bắt đầu hội thoại AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="speaking-ai-builder fade-in">
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/speaking/options')}>
        <FiArrowLeft /> Về lựa chọn nói
      </button>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="speaking-ai-builder-card">
        <div className="speaking-ai-builder-head">
          <div className="speaking-ai-builder-icon"><FiMessageCircle /></div>
          <div>
            <span>LINGOCONNECT PLUS</span>
            <h1>Hội thoại tiếng Anh với AI</h1>
            <p>Chọn chủ đề, độ khó và độ dài. Lingo Coach sẽ trò chuyện liên tục dựa trên từng câu bạn chọn.</p>
          </div>
          <span className={canUseAi ? 'badge badge-success' : 'badge badge-warning'}>
            {canUseAi ? 'PLUS' : 'Cần Plus'}
          </span>
        </div>

        {!canUseAi && (
          <div className="speaking-ai-builder-lock">
            <FiLock /> Tính năng này yêu cầu tài khoản Plus.
          </div>
        )}

        {recentConversation && (
          <button
            type="button"
            className="speaking-ai-resume"
            onClick={() => navigate(`/speaking/personalized/${recentConversation.sessionId}`)}
          >
            <div>
              <span>Hội thoại gần nhất</span>
              <strong>{recentConversation.topic}</strong>
            </div>
            <FiPlay /> Tiếp tục
          </button>
        )}

        <div className="speaking-ai-builder-fields">
          <label>
            <span>Chủ đề</span>
            <input
              className="form-input"
              list="ai-speaking-topics"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Ví dụ: At the airport"
              disabled={!canUseAi || isGenerating}
            />
            <datalist id="ai-speaking-topics">
              {AI_TOPIC_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </datalist>
          </label>

          <label>
            <span>Độ khó</span>
            <select className="form-input" value={level} onChange={(event) => setLevel(event.target.value)} disabled={!canUseAi || isGenerating}>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Khó hơn một chút</option>
            </select>
          </label>

          <label>
            <span>Độ dài</span>
            <select className="form-input" value={targetTurns} onChange={(event) => setTargetTurns(Number(event.target.value))} disabled={!canUseAi || isGenerating}>
              <option value={5}>Ngắn - 5 câu</option>
              <option value={10}>Dài - 10 câu</option>
            </select>
          </label>
        </div>

        <button type="button" className="btn btn-primary speaking-ai-start" onClick={handleGenerate} disabled={isGenerating || !topic.trim()}>
          <FiCpu /> {canUseAi ? (isGenerating ? 'Đang tạo tình huống...' : 'Bắt đầu hội thoại') : 'Nâng cấp Plus'}
        </button>
      </motion.section>
    </div>
  );
}

export default SpeakingAiBuilder;
