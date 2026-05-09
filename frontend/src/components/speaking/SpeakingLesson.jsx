import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiRefreshCw, FiArrowRight, FiVolume2, FiSettings, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { speakingApi } from '../../api/speakingApi';
import ProgressBar from './ProgressBar';
import Recorder from './Recorder';
import Loading from '../common/Loading';

const SpeakingLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState(null);
  const [sentences, setSentences] = useState([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null); // { score, transcript, feedback, matchedText }

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [passThreshold, setPassThreshold] = useState(() => {
    return parseInt(localStorage.getItem('speaking_threshold')) || 60;
  });
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(() => {
    return localStorage.getItem('speaking_voice') || '';
  });

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      setVoices(availableVoices);
      // set default if not selected
      if (availableVoices.length > 0 && !localStorage.getItem('speaking_voice')) {
        setSelectedVoiceURI(availableVoices[0].voiceURI);
      }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('speaking_threshold', passThreshold);
    localStorage.setItem('speaking_voice', selectedVoiceURI);
    setShowSettings(false);
    toast.success('Đã lưu cài đặt');
  };

  useEffect(() => {
    speakingApi.getLessonDetails(id)
      .then(res => {
        setLessonData(res.data.lesson);
        setSentences(res.data.sentences || []);
      })
      .catch(err => {
        toast.error('Lỗi tải chủ đề');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const currentSentence = sentences[currentIndex];

  const playTTS = (text) => {
    if (!window.speechSynthesis) {
      toast.error('Trình duyệt không hỗ trợ đọc tự động.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    if (selectedVoiceURI && voices.length > 0) {
      const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (voice) utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Auto-play question when current index changes
  useEffect(() => {
    if (currentSentence && !loading && !showSettings) {
      const timer = setTimeout(() => playTTS(currentSentence.question), 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentSentence, loading, showSettings]);

  const handleRecordingComplete = async (transcript) => {
    setIsAnalyzing(true);
    
    try {
      const res = await speakingApi.analyzeText({
        targetTexts: currentSentence.options,
        transcript: transcript
      });
      
      const newResult = {
        score: res.data.score,
        transcript: res.data.transcript,
        feedback: res.data.feedback,
        matchedText: res.data.matchedText
      };
      
      setResult(newResult);

      // Auto-advance if passed threshold
      if (newResult.score >= passThreshold) {
        setTimeout(() => {
          handleNext(true);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi phân tích giọng nói');
      setResult({
        score: 0,
        transcript: transcript,
        feedback: 'Không thể phân tích, vui lòng thử lại.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
  };

  const handleNext = async (auto = false) => {
    setCurrentIndex(prevIndex => {
      if (prevIndex + 1 < sentences.length) {
        setResult(null);
        return prevIndex + 1;
      } else {
        // Topic complete!
        setLoading(true);
        speakingApi.saveProgress({ lessonId: id, completed: true })
          .then(() => {
            toast.success('Chúc mừng! Bạn đã hoàn thành chủ đề!');
            navigate('/speaking/lessons');
          })
          .catch(err => {
            toast.error('Lỗi lưu tiến độ');
            setLoading(false);
          });
        return prevIndex;
      }
    });
  };

  if (loading) return <Loading />;
  if (!currentSentence) return <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>Chủ đề không có dữ liệu.</div>;

  const isPassed = result && result.score >= passThreshold;

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 'var(--space-12)', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/speaking/lessons')} style={{ padding: 0 }}>
          <FiArrowLeft /> Thoát
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowSettings(true)} style={{ color: 'var(--color-text-secondary)' }}>
          <FiSettings size={18} /> Cài đặt
        </button>
      </div>

      <ProgressBar current={currentIndex + 1} total={sentences.length} />

      {/* Main Card */}
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Step 1: Show Question & Options */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ color: 'var(--color-primary)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Câu hỏi:</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              "{currentSentence.question}"
            </h2>
            <button 
              onClick={() => playTTS(currentSentence.question)} 
              className="btn btn-ghost" 
              style={{ padding: 8, borderRadius: '50%', color: 'var(--color-primary)' }}
              title="Nghe mẫu"
            >
              <FiVolume2 size={24} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Hãy chọn và đọc một trong các câu trả lời sau:
            </div>
            {currentSentence.options?.map((opt, idx) => {
               let isMatched = result && result.matchedText === opt;
               let opacity = result && !isMatched ? 0.4 : 1;
               return (
                 <div key={idx} style={{ 
                   display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                   padding: '12px 24px', 
                   borderRadius: 'var(--radius-lg)', 
                   border: isMatched ? '2px solid #10b981' : '1px solid var(--color-border)',
                   background: isMatched ? 'rgba(16,185,129,0.1)' : 'var(--color-bg-secondary)',
                   color: isMatched ? '#059669' : 'var(--color-text)',
                   fontWeight: 600,
                   fontSize: 'var(--font-size-lg)',
                   opacity: opacity,
                   transition: 'all 0.3s',
                   cursor: 'pointer'
                 }} onClick={() => playTTS(opt)}>
                   <span>{opt}</span>
                   <button className="btn btn-ghost" style={{ padding: 4, margin: 0, color: isMatched ? '#059669' : 'var(--color-text-muted)' }} onClick={(e) => { e.stopPropagation(); playTTS(opt); }}>
                     <FiVolume2 size={18} />
                   </button>
                 </div>
               );
            })}
          </div>
        </div>

        {/* Step 2: Recording or Reviewing */}
        <div style={{ minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="recording" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Recorder onRecordingComplete={handleRecordingComplete} isAnalyzing={isAnalyzing} />
              </motion.div>
            ) : (
              <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%' }}>
                
                {/* Result Feedback */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 'var(--radius-full)', 
                    background: isPassed ? '#d1fae5' : '#fee2e2',
                    color: isPassed ? '#047857' : '#b91c1c',
                    fontWeight: 800, fontSize: 'var(--font-size-xl)'
                  }}>
                    {isPassed ? '🌟 Tuyệt vời! (Chuyển câu...)' : '💪 Chưa chính xác, thử lại nhé!'} 
                    ({result.score}%)
                  </div>
                  
                  <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', display: 'inline-block', minWidth: 250 }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                      Hệ thống nghe được:
                    </div>
                    <strong style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-lg)' }}>
                      "{result.transcript || '...'}"
                    </strong>
                  </div>
                </div>

                {/* Actions: only show if failed, otherwise auto-advancing */}
                {!isPassed && (
                  <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
                    <button className="btn btn-secondary" onClick={handleRetry} style={{ minWidth: 140 }}>
                      <FiRefreshCw /> Thử lại
                    </button>
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handleNext()} 
                      style={{ minWidth: 100 }}
                    >
                      Bỏ qua <FiArrowRight />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '90%', maxWidth: 400, padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0 }}>Cài đặt phần nói</h3>
              <button className="btn btn-ghost" onClick={() => setShowSettings(false)} style={{ padding: 4 }}><FiX size={24} /></button>
            </div>
            
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Yêu cầu độ chính xác ({passThreshold}%)</label>
              <input 
                type="range" 
                min="50" max="100" step="5"
                value={passThreshold} 
                onChange={(e) => setPassThreshold(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                Nhận diện tự động có thể sai sót nhỏ, nên để mức 60-70% để dễ dàng vượt qua. 100% đòi hỏi đọc chuẩn xác tuyệt đối.
              </p>
            </div>

            <div style={{ marginBottom: 'var(--space-8)' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Giọng đọc mẫu (TTS)</label>
              <select 
                className="input" 
                value={selectedVoiceURI} 
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                style={{ width: '100%' }}
              >
                {voices.length === 0 && <option value="">Đang tải giọng đọc...</option>}
                {voices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleSaveSettings} style={{ width: '100%' }}>
              Lưu cài đặt
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default SpeakingLesson;
