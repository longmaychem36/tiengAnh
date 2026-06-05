import { useEffect, useRef, useState } from 'react';
import { FiMic, FiSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
  const secs = String(safeSeconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const WAVEFORM_BARS = Array.from({ length: 18 }, (_, index) => ({
  id: `wave-${index}`,
  delay: `${(index % 6) * 80}ms`
}));

const Recorder = ({ onRecordingComplete, isAnalyzing, maxDuration = 14 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const autoStopRef = useRef(null);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    return () => {
      stopMediaStream();
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setAudioLevel(0);
  };

  const startVisualization = (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(Math.min(avg / 128, 1));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (e) {
      console.warn('Audio visualization not supported:', e);
    }
  };

  const startTimer = () => {
    startedAtRef.current = Date.now();
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
  };

  const startRecording = async () => {
    if (isAnalyzing || isRecording) return;

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

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/ogg;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        clearTimers();
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm'
        });

        stopMediaStream();
        setIsRecording(false);

        if (audioBlob.size < 1000) {
          toast.error('Vui lòng đọc to và rõ ràng hơn.');
          return;
        }

        onRecordingComplete(audioBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('Lỗi ghi âm, vui lòng thử lại.');
        clearTimers();
        stopMediaStream();
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setIsRecording(true);
      startTimer();
      startVisualization(stream);

      autoStopRef.current = setTimeout(() => {
        stopRecording();
      }, maxDuration * 1000);
    } catch (err) {
      console.error('Failed to access microphone:', err);
      if (err.name === 'NotAllowedError') {
        toast.error('Vui lòng cho phép truy cập microphone trong cài đặt trình duyệt.');
      } else if (err.name === 'NotFoundError') {
        toast.error('Không tìm thấy microphone. Vui lòng kết nối microphone.');
      } else {
        toast.error(`Không thể truy cập microphone: ${err.message}`);
      }
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    try {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      clearTimers();
      stopMediaStream();
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const ringScale = isRecording ? 1 + audioLevel * 0.4 : 1;
  const ringOpacity = isRecording ? 0.15 + audioLevel * 0.35 : 0;
  const remainingSeconds = Math.max(0, maxDuration - recordingSeconds);

  return (
    <div className="speaking-recorder">
      <div className="speaking-recorder-ring">
        <div
          className="speaking-recorder-pulse"
          style={{
            transform: `scale(${ringScale})`,
            opacity: ringOpacity
          }}
        />
        {isRecording && (
          <div
            className="speaking-recorder-outline"
            style={{
              transform: `scale(${1 + audioLevel * 0.6})`,
              opacity: ringOpacity * 0.6
            }}
          />
        )}

        <button
          type="button"
          className={`speaking-recorder-button ${isRecording ? 'is-recording' : ''}`}
          onClick={handleToggleRecording}
          disabled={isAnalyzing}
        >
          {isRecording ? <FiSquare size={32} /> : <FiMic size={32} />}
        </button>
      </div>

      <div className="speaking-recorder-status">
        {isAnalyzing ? (
          <span>Đang nhận diện giọng nói…</span>
        ) : isRecording ? (
          <>
            <strong>{formatTime(recordingSeconds)}</strong>
            <span>Bấm lại để dừng · còn {remainingSeconds}s</span>
          </>
        ) : (
          <span>Bấm micro để ghi âm</span>
        )}
      </div>

      <div className={`speaking-waveform ${isRecording || isAnalyzing ? 'is-active' : ''}`} aria-hidden="true">
        {WAVEFORM_BARS.map((bar) => (
          <span key={bar.id} style={{ animationDelay: bar.delay }} />
        ))}
      </div>
    </div>
  );
};

export default Recorder;
