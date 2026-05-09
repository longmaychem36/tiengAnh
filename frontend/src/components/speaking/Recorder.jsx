import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiMic, FiSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Recorder = ({ onRecordingComplete, isAnalyzing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioLevel(0);
  };

  // Visualize audio level
  const startVisualization = (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(Math.min(avg / 128, 1)); // 0-1 range
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (e) {
      console.warn('Audio visualization not supported:', e);
    }
  };

  const startRecording = async () => {
    if (isAnalyzing) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Determine supported MIME type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/ogg;codecs=opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = ''; // Let browser decide
      }

      const options = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mimeType || 'audio/webm' 
        });
        
        stopMediaStream();

        if (audioBlob.size < 1000) {
          toast.error('Vui lòng đọc to và rõ ràng hơn!');
          return;
        }
        
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('Lỗi ghi âm, vui lòng thử lại.');
        stopMediaStream();
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Start audio visualization
      startVisualization(stream);

    } catch (err) {
      console.error('Failed to access microphone:', err);
      if (err.name === 'NotAllowedError') {
        toast.error('Vui lòng cho phép truy cập microphone trong cài đặt trình duyệt.');
      } else if (err.name === 'NotFoundError') {
        toast.error('Không tìm thấy microphone. Vui lòng kết nối microphone.');
      } else {
        toast.error('Không thể truy cập microphone: ' + err.message);
      }
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    try {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setIsRecording(false);
    }
  };

  // Dynamic ring effect based on audio level
  const ringScale = isRecording ? 1 + audioLevel * 0.4 : 1;
  const ringOpacity = isRecording ? 0.15 + audioLevel * 0.35 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      
      {/* Pulsing ring effect */}
      <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Outer animated ring */}
        <div style={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
          transition: 'transform 0.1s ease, opacity 0.1s ease'
        }} />

        {/* Second ring */}
        {isRecording && (
          <div style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            transform: `scale(${1 + audioLevel * 0.6})`,
            opacity: ringOpacity * 0.5,
            transition: 'transform 0.15s ease'
          }} />
        )}

        {/* Main button */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={() => { if (isRecording) stopRecording(); }}
          onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
          onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
          disabled={isAnalyzing}
          style={{
            position: 'relative',
            zIndex: 2,
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: 'none',
            background: isRecording 
              ? `radial-gradient(circle, #f87171, #ef4444)` 
              : 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            boxShadow: isRecording 
              ? `0 0 0 ${4 + audioLevel * 8}px rgba(239, 68, 68, ${0.2 + audioLevel * 0.15})` 
              : '0 4px 16px rgba(16, 185, 129, 0.3)',
            transition: 'box-shadow 0.15s ease, transform 0.2s ease',
            transform: isRecording ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {isRecording ? <FiSquare size={32} /> : <FiMic size={32} />}
        </button>
      </div>
      
      <div style={{ 
        color: 'var(--color-text-muted)', 
        fontSize: 'var(--font-size-sm)', 
        fontWeight: 500,
        textAlign: 'center'
      }}>
        <span>
          {isAnalyzing 
            ? '⏳ Đang nhận diện giọng nói...' 
            : isRecording 
              ? '🔴 Đang ghi âm (Thả ra để kết thúc)...' 
              : '🎤 Nhấn giữ để nói'}
        </span>
      </div>
    </div>
  );
};

export default Recorder;
