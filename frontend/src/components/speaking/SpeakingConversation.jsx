import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiMessageCircle,
  FiRefreshCw,
  FiSettings,
  FiVolume2,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import CharacterSvg from '../common/CharacterSvg';
import Recorder from './Recorder';
import { speakingApi } from '../../api/speakingApi';
import { hasSpeechSupport, speakText, stopAllPlayback } from '../../utils/audioControl';
import {
  loadSpeakingConversation,
  saveSpeakingConversation
} from '../../utils/speakingConversationStorage';

const getInitialThreshold = () => Number.parseInt(localStorage.getItem('speaking_threshold'), 10) || 60;
const getInitialVoice = () => localStorage.getItem('speaking_voice') || '';

const getRecordDuration = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(32, Math.max(10, Math.ceil(words * 1.45)));
};

function SpeakingConversation() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const autoSpokenRef = useRef(new Set());
  const advancingTokenRef = useRef('');
  const [conversation, setConversation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [visibleTranslations, setVisibleTranslations] = useState(() => new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [passThreshold, setPassThreshold] = useState(getInitialThreshold);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(getInitialVoice);
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);

  const persist = useCallback((snapshot) => {
    const stored = saveSpeakingConversation(snapshot);
    setConversation(stored);
    return stored;
  }, []);

  useEffect(() => {
    const snapshot = loadSpeakingConversation(sessionId);
    if (!snapshot) {
      setNotFound(true);
      setConversation(null);
      return;
    }
    setNotFound(false);
    persist(snapshot);
  }, [persist, sessionId]);

  useEffect(() => {
    const loadVoices = () => {
      if (!hasSpeechSupport()) return setVoices([]);
      const englishVoices = window.speechSynthesis.getVoices().filter((voice) => voice.lang?.startsWith('en'));
      setVoices(englishVoices);
      if (!selectedVoiceURI && englishVoices[0]) setSelectedVoiceURI(englishVoices[0].voiceURI);
    };
    loadVoices();
    if (hasSpeechSupport()) window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (hasSpeechSupport()) window.speechSynthesis.onvoiceschanged = null;
      stopAllPlayback();
    };
  }, [selectedVoiceURI]);

  const playMessage = useCallback((text) => {
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt không hỗ trợ đọc tự động.');
      return;
    }
    const voice = voices.find((item) => item.voiceURI === selectedVoiceURI) || null;
    speakText(text, {
      lang: 'en-US',
      voice,
      onstart: () => setIsCharacterSpeaking(true),
      onend: () => setIsCharacterSpeaking(false),
      onerror: () => setIsCharacterSpeaking(false)
    });
  }, [selectedVoiceURI, voices]);

  const latestMessage = conversation?.messages?.[conversation.messages.length - 1];
  useEffect(() => {
    if (!latestMessage || latestMessage.role !== 'assistant' || autoSpokenRef.current.has(latestMessage.id)) return;
    autoSpokenRef.current.add(latestMessage.id);
    const timer = window.setTimeout(() => playMessage(latestMessage.text), 420);
    return () => window.clearTimeout(timer);
  }, [latestMessage, playMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversation?.messages?.length, conversation?.phase, conversation?.lastAttempt]);

  useEffect(() => {
    setSelectedOptionId('');
  }, [conversation?.currentTurn?.id]);

  const currentOptions = conversation?.currentTurn?.options || [];
  const selectedOption = currentOptions.find((option) => option.id === selectedOptionId) || null;
  const learnerMessages = useMemo(
    () => (conversation?.messages || []).filter((message) => message.role === 'learner'),
    [conversation?.messages]
  );
  const averageScore = learnerMessages.length
    ? Math.round(learnerMessages.reduce((total, message) => total + Number(message.score || 0), 0) / learnerMessages.length)
    : 0;

  const requestNextTurn = useCallback(async (snapshot) => {
    try {
      const response = await speakingApi.generateNextPersonalizedTurn(sessionId, {
        advanceToken: snapshot.advanceToken,
        history: snapshot.messages
      });
      const data = response.data;
      const next = persist({
        ...snapshot,
        messages: [...snapshot.messages, data.assistantMessage],
        currentTurn: data.currentTurn,
        stateToken: data.stateToken,
        advanceToken: null,
        phase: data.completed ? 'completed' : 'ready',
        summary: data.summary || '',
        averageScore: data.averageScore ?? averageScore,
        aiError: '',
        lastAttempt: null
      });
      if (next.phase === 'completed') toast.success('Lingo Coach đã khép lại cuộc hội thoại.');
    } catch (error) {
      persist({
        ...snapshot,
        phase: 'awaiting_ai',
        aiError: error.message || 'Không thể tạo phản hồi tiếp theo.'
      });
      toast.error('AI chưa thể trả lời. Bạn có thể thử lại mà không cần ghi âm lại.');
    }
  }, [averageScore, persist, sessionId]);

  useEffect(() => {
    if (conversation?.phase !== 'awaiting_ai'
      || !conversation.advanceToken
      || conversation.aiError
      || advancingTokenRef.current === conversation.advanceToken) return;
    advancingTokenRef.current = conversation.advanceToken;
    requestNextTurn(conversation);
  }, [conversation, requestNextTurn]);

  const handleRecordingComplete = async (audioBlob) => {
    if (!conversation || !selectedOption) {
      toast.error('Hãy chọn một câu trả lời trước khi ghi âm.');
      return;
    }

    const analyzingSnapshot = persist({ ...conversation, phase: 'analyzing', lastAttempt: null, aiError: '' });
    try {
      const response = await speakingApi.analyzePersonalizedTurn(sessionId, {
        audioBlob,
        stateToken: analyzingSnapshot.stateToken,
        history: analyzingSnapshot.messages,
        option: selectedOption,
        passThreshold
      });
      const data = response.data;

      if (!data.passed) {
        persist({ ...analyzingSnapshot, phase: 'ready', lastAttempt: data });
        toast.error(`Bạn cần đạt ít nhất ${passThreshold}% để tiếp tục.`);
        return;
      }

      persist({
        ...analyzingSnapshot,
        phase: 'awaiting_ai',
        messages: [...analyzingSnapshot.messages, data.learnerMessage],
        currentTurn: null,
        stateToken: null,
        advanceToken: data.advanceToken,
        lastAttempt: null,
        aiError: ''
      });
      setSelectedOptionId('');
    } catch (error) {
      persist({ ...analyzingSnapshot, phase: 'ready' });
      toast.error(error.message || 'Không thể chấm phần ghi âm.');
    }
  };

  const handleRecordingState = (isRecording) => {
    if (!conversation || conversation.phase === 'analyzing') return;
    if (isRecording) setIsCharacterSpeaking(false);
    persist({ ...conversation, phase: isRecording ? 'recording' : 'ready' });
  };

  const toggleTranslation = (messageId) => {
    setVisibleTranslations((current) => {
      const next = new Set(current);
      if (next.has(messageId)) next.delete(messageId);
      else next.add(messageId);
      return next;
    });
  };

  const saveSettings = () => {
    localStorage.setItem('speaking_threshold', String(passThreshold));
    localStorage.setItem('speaking_voice', selectedVoiceURI);
    setShowSettings(false);
    toast.success('Đã lưu cài đặt.');
  };

  const exitConversation = () => {
    if (conversation?.phase !== 'completed' && !window.confirm('Thoát khỏi màn hình? Hội thoại vẫn được lưu trên trình duyệt để tiếp tục sau.')) return;
    navigate('/speaking/ai');
  };

  if (notFound) {
    return (
      <div className="ai-chat-empty fade-in">
        <FiMessageCircle />
        <h1>Không tìm thấy hội thoại</h1>
        <p>Phiên này đã hết hạn hoặc không được lưu trên trình duyệt hiện tại.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/speaking/ai')}>Tạo hội thoại mới</button>
      </div>
    );
  }

  if (!conversation) return <div className="ai-chat-loading">Đang mở hội thoại...</div>;

  const busy = ['recording', 'analyzing', 'awaiting_ai'].includes(conversation.phase);
  const recordDuration = getRecordDuration(selectedOption?.text);

  return (
    <div className="ai-chat-shell fade-in">
      <header className="ai-chat-header">
        <button type="button" className="ai-chat-icon-button" onClick={exitConversation} aria-label="Thoát">
          <FiArrowLeft />
        </button>
        <div className="ai-chat-profile">
          <span className="ai-chat-header-avatar">
            <CharacterSvg width={48} className={isCharacterSpeaking ? 'is-speaking' : ''} aria-hidden="true" />
          </span>
          <div>
            <strong>Lingo Coach</strong>
            <span>{conversation.phase === 'awaiting_ai' ? 'Đang nhập...' : isCharacterSpeaking ? 'Đang nói...' : 'Sẵn sàng trò chuyện'}</span>
          </div>
        </div>
        <div className="ai-chat-header-meta">
          <span>{conversation.topic}</span>
          <strong>Lượt {learnerMessages.length}/12</strong>
        </div>
        <button type="button" className="ai-chat-icon-button" onClick={() => setShowSettings(true)} aria-label="Cài đặt">
          <FiSettings />
        </button>
      </header>

      <main className="ai-chat-messages">
        <div className="ai-chat-date">Hội thoại mới · {conversation.level}</div>
        {conversation.messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          const translationVisible = visibleTranslations.has(message.id);
          return (
            <motion.div
              key={message.id}
              className={`ai-chat-row ${isAssistant ? 'is-assistant' : 'is-learner'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isAssistant && (
                <span className="ai-chat-avatar">
                  <CharacterSvg width={42} className={isCharacterSpeaking && message.id === latestMessage?.id ? 'is-speaking' : ''} aria-hidden="true" />
                </span>
              )}
              <div className="ai-chat-message-wrap">
                <div className="ai-chat-bubble">
                  <p>{message.text}</p>
                  {translationVisible && message.translation && <small>{message.translation}</small>}
                </div>
                <div className="ai-chat-bubble-actions">
                  {message.translation && (
                    <button type="button" onClick={() => toggleTranslation(message.id)}>
                      {translationVisible ? <FiEyeOff /> : <FiEye />} {translationVisible ? 'Ẩn nghĩa' : 'Xem nghĩa'}
                    </button>
                  )}
                  {isAssistant && <button type="button" onClick={() => playMessage(message.text)}><FiVolume2 /> Nghe</button>}
                  {!isAssistant && <span className="ai-chat-score"><FiCheckCircle /> {message.score}%</span>}
                </div>
              </div>
            </motion.div>
          );
        })}

        {conversation.phase === 'awaiting_ai' && (
          <div className="ai-chat-row is-assistant">
            <span className="ai-chat-avatar"><CharacterSvg width={42} className="is-thinking" aria-hidden="true" /></span>
            <div className="ai-chat-typing"><span /><span /><span /></div>
          </div>
        )}

        {conversation.aiError && (
          <div className="ai-chat-retry-card">
            <p>{conversation.aiError}</p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => requestNextTurn(conversation)}>
              <FiRefreshCw /> Thử tạo phản hồi lại
            </button>
          </div>
        )}

        {conversation.phase === 'completed' && (
          <section className="ai-chat-summary">
            <FiCheckCircle />
            <div>
              <span>Đã hoàn thành</span>
              <h2>{conversation.summary || 'Bạn đã hoàn thành cuộc hội thoại.'}</h2>
              <p>{learnerMessages.length} lượt · Điểm phát âm trung bình {conversation.averageScore || averageScore}%</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/speaking/ai')}>Tạo hội thoại khác</button>
          </section>
        )}
        <div ref={chatEndRef} />
      </main>

      {conversation.phase !== 'completed' && conversation.phase !== 'awaiting_ai' && (
        <footer className="ai-chat-composer">
          <div className="ai-chat-options">
            {currentOptions.map((option) => {
              const selected = option.id === selectedOptionId;
              const translationKey = `option-${conversation.currentTurn?.id}-${option.id}`;
              const translationVisible = visibleTranslations.has(translationKey);
              return (
                <button
                  type="button"
                  key={option.id}
                  className={`ai-chat-option ${selected ? 'is-selected' : ''}`}
                  onClick={() => !busy && setSelectedOptionId(option.id)}
                  disabled={busy && !selected}
                >
                  <strong>{option.text}</strong>
                  {translationVisible && <small>{option.translation}</small>}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleTranslation(translationKey);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') toggleTranslation(translationKey);
                    }}
                  >
                    {translationVisible ? <FiEyeOff /> : <FiEye />}
                  </span>
                </button>
              );
            })}
          </div>

          {conversation.lastAttempt && !conversation.lastAttempt.passed && (
            <div className="ai-chat-failed-attempt">
              <strong>{conversation.lastAttempt.score}% · Hãy thử lại</strong>
              <p>{conversation.lastAttempt.feedback}</p>
              {conversation.lastAttempt.transcript && <small>Bạn nói: “{conversation.lastAttempt.transcript}”</small>}
            </div>
          )}

          <div className="ai-chat-record-row">
            <div>
              <span>{selectedOption ? 'Câu đã chọn' : 'Chọn một câu để trả lời'}</span>
              <strong>{selectedOption?.text || 'Ba hướng trả lời sẽ dẫn cuộc hội thoại đi tiếp.'}</strong>
            </div>
            {selectedOption && (
              <div className="ai-chat-recorder">
                <Recorder
                  onRecordingComplete={handleRecordingComplete}
                  onRecordingStateChange={handleRecordingState}
                  isAnalyzing={conversation.phase === 'analyzing'}
                  maxDuration={recordDuration}
                />
              </div>
            )}
          </div>
        </footer>
      )}

      {showSettings && (
        <div className="ai-chat-modal-backdrop">
          <div className="ai-chat-modal">
            <div className="ai-chat-modal-head">
              <h2>Cài đặt hội thoại</h2>
              <button type="button" onClick={() => setShowSettings(false)}><FiX /></button>
            </div>
            <label>
              <span>Ngưỡng phát âm: {passThreshold}%</span>
              <input type="range" min="50" max="100" step="5" value={passThreshold} onChange={(event) => setPassThreshold(Number(event.target.value))} />
            </label>
            <label>
              <span>Giọng đọc của Lingo Coach</span>
              <select value={selectedVoiceURI} onChange={(event) => setSelectedVoiceURI(event.target.value)}>
                {voices.length === 0 && <option value="">Giọng mặc định</option>}
                {voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>)}
              </select>
            </label>
            <button type="button" className="btn btn-primary" onClick={saveSettings}>Lưu cài đặt</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpeakingConversation;
