const SOUND_ENABLED_KEY = 'sound_effects_enabled';

let audioContext = null;
let unlocked = false;
let lastPlayedAt = 0;

const isSoundEnabled = () => localStorage.getItem(SOUND_ENABLED_KEY) !== 'false';

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
};

const unlockAudio = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  unlocked = true;
};

const tone = (frequency, start, duration, options = {}) => {
  const ctx = getAudioContext();
  if (!ctx || !isSoundEnabled()) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const now = ctx.currentTime;
  const at = now + start;
  const volume = options.volume ?? 0.045;

  oscillator.type = options.type || 'sine';
  oscillator.frequency.setValueAtTime(frequency, at);
  if (options.slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(options.slideTo, at + duration);
  }

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(options.filter || 4200, at);

  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.02);
};

const playSound = (name) => {
  if (!unlocked || !isSoundEnabled()) return;

  const now = performance.now();
  if (now - lastPlayedAt < 45) return;
  lastPlayedAt = now;

  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  switch (name) {
    case 'confirm':
      tone(520, 0, 0.055, { type: 'triangle', volume: 0.045 });
      tone(780, 0.045, 0.08, { type: 'triangle', volume: 0.05 });
      break;
    case 'success':
      tone(523.25, 0, 0.07, { type: 'triangle', volume: 0.05 });
      tone(659.25, 0.065, 0.07, { type: 'triangle', volume: 0.05 });
      tone(880, 0.13, 0.11, { type: 'triangle', volume: 0.055 });
      break;
    case 'error':
      tone(220, 0, 0.09, { type: 'sawtooth', volume: 0.035, slideTo: 180, filter: 1800 });
      tone(164.81, 0.085, 0.11, { type: 'sawtooth', volume: 0.032, slideTo: 130, filter: 1600 });
      break;
    case 'select':
      tone(420, 0, 0.045, { type: 'square', volume: 0.025, filter: 2600 });
      tone(560, 0.035, 0.045, { type: 'square', volume: 0.023, filter: 2600 });
      break;
    case 'nav':
      tone(360, 0, 0.045, { type: 'triangle', volume: 0.032 });
      break;
    default:
      tone(460, 0, 0.04, { type: 'triangle', volume: 0.025 });
  }
};

const getElementSound = (target) => {
  const element = target.closest('button, a, [role="button"]');
  if (!element || element.disabled || element.getAttribute('aria-disabled') === 'true') return null;

  if (element.closest('.lingo-sidebar')) return 'nav';
  if (element.classList.contains('is-correct') || element.closest('.is-completed')) return 'success';
  if (element.classList.contains('is-wrong')) return 'error';
  if (
    element.classList.contains('speaking-answer-option')
    || element.closest('.receptive-options')
    || element.classList.contains('game-answer-btn')
    || element.closest('.game-word-bank')
    || element.closest('.game-sentence-board')
  ) return 'select';
  if (element.classList.contains('btn-primary')) return 'confirm';

  return 'tap';
};

const installSoundEffects = () => {
  if (typeof window === 'undefined' || window.__lingoSoundEffectsInstalled) {
    return () => {};
  }

  window.__lingoSoundEffectsInstalled = true;

  const onPointerDown = () => unlockAudio();
  const onClick = (event) => {
    const sound = getElementSound(event.target);
    if (sound) playSound(sound);
  };
  const onSoundEvent = (event) => playSound(event.detail?.name || 'tap');

  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.addEventListener('click', onClick, true);
  window.addEventListener('lingo:sound', onSoundEvent);

  return () => {
    window.__lingoSoundEffectsInstalled = false;
    window.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('click', onClick, true);
    window.removeEventListener('lingo:sound', onSoundEvent);
  };
};

export { installSoundEffects, playSound };
