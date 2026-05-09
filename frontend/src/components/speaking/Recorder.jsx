import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiSquare, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Recorder = ({ onRecordingComplete, isAnalyzing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      transcriptRef.current = currentTranscript;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error !== 'aborted') {
        toast.error('Lỗi nhận diện giọng nói: ' + event.error);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    try {
      transcriptRef.current = '';
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current || !isRecording) return;
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      const finalTranscript = transcriptRef.current.trim();
      if (!finalTranscript) {
        toast.error('Vui lòng đọc to và rõ ràng hơn!');
        return;
      }
      
      onRecordingComplete(finalTranscript);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={isAnalyzing}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: 'none',
          background: isRecording ? '#ef4444' : 'var(--color-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          boxShadow: isRecording ? '0 0 0 8px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.2s ease',
          transform: isRecording ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {isRecording ? <FiSquare size={32} /> : <FiMic size={32} />}
      </button>
      
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
        {isAnalyzing ? 'Đang phân tích...' : isRecording ? 'Đang ghi âm (Thả ra để kết thúc)...' : 'Nhấn giữ để nói'}
      </div>
    </div>
  );
};

export default Recorder;
