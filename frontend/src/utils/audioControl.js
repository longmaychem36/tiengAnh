const trackedAudio = new Set();
let speechSessionId = 0;

export const hasSpeechSupport = () => (
  typeof window !== 'undefined' && 'speechSynthesis' in window
);

export const stopSpeechPlayback = () => {
  if (hasSpeechSupport()) {
    speechSessionId += 1;
    window.speechSynthesis.cancel();
  }
};

const speakUtterance = (utterance) => {
  if (!hasSpeechSupport()) return;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
};

export const registerAudioElement = (audio) => {
  if (!audio) return audio;

  trackedAudio.add(audio);

  const unregister = () => trackedAudio.delete(audio);
  audio.addEventListener('ended', unregister, { once: true });
  audio.addEventListener('error', unregister, { once: true });

  return audio;
};

export const stopAllPlayback = () => {
  stopSpeechPlayback();

  trackedAudio.forEach((audio) => {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Ignore media elements that are no longer controllable.
    }
  });
  trackedAudio.clear();

  if (typeof document !== 'undefined') {
    document.querySelectorAll('audio, video').forEach((media) => {
      try {
        media.pause();
      } catch {
        // Ignore detached or unsupported media nodes.
      }
    });
  }
};

export const speakText = (text, options = {}) => {
  if (!text || !hasSpeechSupport()) return null;
  if (typeof document !== 'undefined' && document.hidden) return null;

  const {
    lang = 'en-US',
    rate = 1,
    pitch = 1,
    volume = 1,
    voice,
    onstart,
    onend,
    onerror
  } = options;

  stopSpeechPlayback();
  const sessionId = speechSessionId;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = Number(rate) || 1;
  utterance.pitch = pitch;
  utterance.volume = volume;
  if (voice) utterance.voice = voice;
  if (onstart) utterance.onstart = () => {
    if (sessionId === speechSessionId) onstart();
  };
  if (onend) utterance.onend = () => {
    if (sessionId === speechSessionId) onend();
  };
  if (onerror) utterance.onerror = (event) => {
    if (sessionId === speechSessionId) onerror(event);
  };

  window.setTimeout(() => {
    if (sessionId === speechSessionId) speakUtterance(utterance);
  }, 30);
  return utterance;
};

export const speakTextQueue = (items, defaultOptions = {}) => {
  if (!Array.isArray(items) || items.length === 0 || !hasSpeechSupport()) return [];
  if (typeof document !== 'undefined' && document.hidden) return [];

  stopSpeechPlayback();
  const sessionId = speechSessionId;

  const utterances = items
    .filter((item) => item?.text)
    .map((item) => {
      const options = { ...defaultOptions, ...item };
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = Number(options.rate) || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume ?? 1;
      if (options.voice) utterance.voice = options.voice;
      utterance.__speechOptions = options;
      return utterance;
    });

  const speakAt = (index) => {
    if (sessionId !== speechSessionId || index >= utterances.length) return;

    const utterance = utterances[index];
    const options = utterance.__speechOptions || {};

    utterance.onstart = () => {
      if (sessionId === speechSessionId && options.onstart) options.onstart();
    };

    utterance.onend = () => {
      if (sessionId !== speechSessionId) return;
      if (options.onend) options.onend();
      speakAt(index + 1);
    };

    utterance.onerror = (event) => {
      if (sessionId !== speechSessionId) return;
      if (options.onerror) options.onerror(event);
      speakAt(index + 1);
    };

    speakUtterance(utterance);
  };

  window.setTimeout(() => speakAt(0), 30);
  return utterances;
};

export const playTrackedAudio = (url, fallback) => {
  if (!url || typeof Audio === 'undefined') {
    if (fallback) fallback();
    return null;
  }

  stopAllPlayback();

  const audio = registerAudioElement(new Audio(url));
  audio.onerror = () => {
    trackedAudio.delete(audio);
    if (fallback) fallback();
  };
  audio.play().catch(() => {
    trackedAudio.delete(audio);
    if (fallback) fallback();
  });

  return audio;
};
