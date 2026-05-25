const trackedAudio = new Set();

export const hasSpeechSupport = () => (
  typeof window !== 'undefined' && 'speechSynthesis' in window
);

export const stopSpeechPlayback = () => {
  if (hasSpeechSupport()) {
    window.speechSynthesis.cancel();
  }
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
    voice,
    onend,
    onerror
  } = options;

  stopSpeechPlayback();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  if (voice) utterance.voice = voice;
  if (onend) utterance.onend = onend;
  if (onerror) utterance.onerror = onerror;

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const speakTextQueue = (items, defaultOptions = {}) => {
  if (!Array.isArray(items) || items.length === 0 || !hasSpeechSupport()) return [];
  if (typeof document !== 'undefined' && document.hidden) return [];

  stopSpeechPlayback();

  const utterances = items
    .filter((item) => item?.text)
    .map((item) => {
      const options = { ...defaultOptions, ...item };
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      if (options.voice) utterance.voice = options.voice;
      if (options.onend) utterance.onend = options.onend;
      if (options.onerror) utterance.onerror = options.onerror;
      return utterance;
    });

  utterances.forEach((utterance) => window.speechSynthesis.speak(utterance));
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
