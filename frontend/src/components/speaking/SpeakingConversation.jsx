import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiMessageCircle,
  FiRefreshCw,
  FiVolume2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import CharacterSvg from '../common/CharacterSvg';
import Recorder from './Recorder';
import { speakingApi } from '../../api/speakingApi';
import { hasSpeechSupport, speakText, stopAllPlayback } from '../../utils/audioControl';
import { useAuth } from '../../hooks/useAuth';
import {
  loadSpeakingConversation,
  saveSpeakingConversation
} from '../../utils/speakingConversationStorage';

const getInitialThreshold = () => Number.parseInt(localStorage.getItem('speaking_threshold'), 10) || 60;
const getInitialVoice = () => localStorage.getItem('speaking_voice') || '';
const DEFAULT_COMPLETION_SUMMARY = 'Bạn đã hoàn thành cuộc hội thoại.';
const HAS_VIETNAMESE_MARKS = /[\u0300-\u036f]/;
const BROKEN_ENCODING_MARKS = /[ÃÂÄ]/;

const getRecordDuration = (text = '') => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(32, Math.max(10, Math.ceil(words * 1.45)));
};

const getUserInitial = (user) => {
  const source = user?.fullName || user?.username || user?.email || 'Learner';
  return String(source).trim().charAt(0).toUpperCase() || 'L';
};

const getDisplaySummary = (summary) => {
  const value = String(summary || '').trim();
  if (!value || BROKEN_ENCODING_MARKS.test(value) || !HAS_VIETNAMESE_MARKS.test(value.normalize('NFD'))) {
    return DEFAULT_COMPLETION_SUMMARY;
  }
  return value;
};

function SpeakingConversation() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const autoSpokenRef = useRef(new Set());
  const autoSpeechPendingRef = useRef(new Set());
  const advancingTokenRef = useRef('');
  const chatEndRef = useRef(null);
  const [conversation, setConversation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [passThreshold] = useState(getInitialThreshold);
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

  const playMessage = useCallback((text, callbacks = {}) => {
    if (!hasSpeechSupport()) {
      toast.error('Trình duyệt không hỗ trợ đọc tự động.');
      return;
    }
    const voice = voices.find((item) => item.voiceURI === selectedVoiceURI) || null;
    return speakText(text, {
      lang: 'en-US',
      voice,
      onstart: () => {
        setIsCharacterSpeaking(true);
        callbacks.onstart?.();
      },
      onend: () => {
        setIsCharacterSpeaking(false);
        callbacks.onend?.();
      },
      onerror: (event) => {
        setIsCharacterSpeaking(false);
        callbacks.onerror?.(event);
      }
    });
  }, [selectedVoiceURI, voices]);

  const visibleMessages = useMemo(() => {
    const messages = conversation?.messages || [];
    if (conversation?.phase === 'completed' && messages[messages.length - 1]?.role === 'assistant') {
      return messages.slice(0, -1);
    }
    return messages;
  }, [conversation?.messages, conversation?.phase]);

  const latestMessage = visibleMessages[visibleMessages.length - 1];
  useEffect(() => {
    if (!latestMessage
      || latestMessage.role !== 'assistant'
      || autoSpokenRef.current.has(latestMessage.id)
      || autoSpeechPendingRef.current.has(latestMessage.id)) return undefined;

    autoSpeechPendingRef.current.add(latestMessage.id);
    const clearPending = () => autoSpeechPendingRef.current.delete(latestMessage.id);
    const pendingTimeout = window.setTimeout(clearPending, 3500);
    const timer = window.setTimeout(() => {
      const utterance = playMessage(latestMessage.text, {
        onstart: () => {
          autoSpokenRef.current.add(latestMessage.id);
          clearPending();
          window.clearTimeout(pendingTimeout);
        },
        onend: clearPending,
        onerror: clearPending
      });
      if (!utterance) clearPending();
    }, 420);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(pendingTimeout);
      clearPending();
    };
  }, [latestMessage, playMessage]);

  useEffect(() => {
    setSelectedOptionId('');
  }, [conversation?.currentTurn?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [visibleMessages.length, selectedOptionId, conversation?.phase]);

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
      const summary = data.summary && !BROKEN_ENCODING_MARKS.test(data.summary) ? data.summary : '';
      const messages = data.assistantMessage
        ? [...snapshot.messages, data.assistantMessage]
        : snapshot.messages;
      const next = persist({
        ...snapshot,
        messages,
        currentTurn: data.currentTurn,
        stateToken: data.stateToken,
        advanceToken: null,
        phase: data.completed ? 'completed' : 'ready',
        summary,
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
        toast.error('Hãy nói rõ hơn và thử lại.');
        return;
      }

      const nextMessages = [...analyzingSnapshot.messages, data.learnerMessage];
      const completed = Boolean(data.completed);
      const summary = data.summary && !BROKEN_ENCODING_MARKS.test(data.summary) ? data.summary : '';
      persist({
        ...analyzingSnapshot,
        phase: completed ? 'completed' : 'awaiting_ai',
        messages: nextMessages,
        currentTurn: null,
        stateToken: data.stateToken || null,
        advanceToken: completed ? null : data.advanceToken,
        summary,
        averageScore: data.averageScore ?? averageScore,
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

  const exitConversation = () => {
    if (conversation?.phase !== 'completed' && !window.confirm('Thoát khỏi màn hình? Hội thoại vẫn được lưu để tiếp tục sau.')) return;
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
  const isAnalyzing = conversation.phase === 'analyzing';

  return (
    <div className="ai-chat-shell fade-in">
      <header className="ai-chat-header">
        <button type="button" className="ai-chat-icon-button" onClick={exitConversation} aria-label="Thoát">
          <FiArrowLeft />
        </button>
      </header>

      <main className="ai-chat-messages">
        <section className="ai-chat-stage">
          {visibleMessages.map((message) => {
            const isAssistant = message.role === 'assistant';
            return (
              <motion.div
                key={message.id}
                className={`ai-chat-dialogue ${isAssistant ? 'is-coach' : 'is-learner'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isAssistant && (
                  <span className="ai-chat-coach-avatar">
                    <CharacterSvg width={82} className={isCharacterSpeaking && message.id === latestMessage?.id ? 'is-speaking' : ''} aria-hidden="true" />
                  </span>
                )}
                <div className={isAssistant ? 'ai-chat-coach-bubble' : 'ai-chat-learner-bubble'}>
                  {isAssistant && (
                    <div className="ai-chat-coach-meta">
                      <strong>Lingo Coach</strong>
                      <button type="button" onClick={() => playMessage(message.text)} aria-label="Nghe Lingo Coach">
                        <FiVolume2 />
                      </button>
                    </div>
                  )}
                  <p>{message.text}</p>
                </div>
                {!isAssistant && (
                  <span className="ai-chat-learner-avatar">
                    {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" /> : getUserInitial(user)}
                  </span>
                )}
              </motion.div>
            );
          })}

          {selectedOption && (
            <motion.div
              className="ai-chat-dialogue is-learner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="ai-chat-learner-bubble">
                <p>{selectedOption.text}</p>
              </div>
              <span className="ai-chat-learner-avatar">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" /> : getUserInitial(user)}
              </span>
            </motion.div>
          )}

          {conversation.phase === 'awaiting_ai' && (
            <div className="ai-chat-thinking-card" aria-label="Đang tạo phản hồi">
              <div className="ai-chat-typing"><span /><span /><span /></div>
            </div>
          )}

          {conversation.lastAttempt && !conversation.lastAttempt.passed && (
            <div className="ai-chat-failed-attempt">
              <strong>Hãy thử lại</strong>
              {conversation.lastAttempt.transcript && <p>Bạn vừa nói: "{conversation.lastAttempt.transcript}"</p>}
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
              <div>
                <span>Đã hoàn thành</span>
                <h2>{getDisplaySummary(conversation.summary)}</h2>
                <p>{learnerMessages.length} lượt luyện nói trong cuộc hội thoại này.</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => navigate('/speaking/ai')}>Tạo hội thoại khác</button>
            </section>
          )}
          <div ref={chatEndRef} />
        </section>
      </main>

      {conversation.phase !== 'completed' && conversation.phase !== 'awaiting_ai' && (
        <footer className="ai-chat-composer">
          <div className="ai-chat-options">
            {currentOptions.map((option) => {
              const selected = option.id === selectedOptionId;
              return (
                <div
                  key={option.id}
                  role="button"
                  tabIndex={busy && !selected ? -1 : 0}
                  aria-disabled={busy && !selected}
                  className={`ai-chat-option ${selected ? 'is-selected' : ''} ${busy && !selected ? 'is-disabled' : ''}`}
                  onClick={() => !busy && setSelectedOptionId(option.id)}
                  onKeyDown={(event) => {
                    if (busy && !selected) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedOptionId(option.id);
                    }
                  }}
                >
                  <strong>{option.text}</strong>
                  <span className="ai-chat-option-actions">
                    <button
                      type="button"
                      className="ai-chat-option-listen"
                      onClick={(event) => {
                        event.stopPropagation();
                        playMessage(option.text);
                      }}
                      disabled={busy}
                      aria-label={`Nghe câu trả lời: ${option.text}`}
                    >
                      <FiVolume2 />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>

          {selectedOption && (
            <div className={`ai-chat-recorder ${isAnalyzing ? 'is-analyzing' : ''}`}>
              <Recorder
                onRecordingComplete={handleRecordingComplete}
                onRecordingStateChange={handleRecordingState}
                isAnalyzing={isAnalyzing}
                maxDuration={recordDuration}
              />
            </div>
          )}
        </footer>
      )}
    </div>
  );
}

export default SpeakingConversation;
