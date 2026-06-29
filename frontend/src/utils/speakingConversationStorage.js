const STORAGE_PREFIX = 'speaking-ai-conversation:v1:';
const INDEX_KEY = 'speaking-ai-conversation:index:v1';
const MAX_STORED_CONVERSATIONS = 5;

const storageAvailable = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readIndex = () => {
  if (!storageAvailable()) return [];
  try {
    const value = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const writeIndex = (items) => {
  if (!storageAvailable()) return;
  localStorage.setItem(INDEX_KEY, JSON.stringify(items));
};

export const removeSpeakingConversation = (sessionId) => {
  if (!storageAvailable() || !sessionId) return;
  localStorage.removeItem(`${STORAGE_PREFIX}${sessionId}`);
  writeIndex(readIndex().filter((item) => item.sessionId !== sessionId));
};

const isExpired = (snapshot) => !snapshot?.expiresAt
  || new Date(snapshot.expiresAt).getTime() <= Date.now();

export const loadSpeakingConversation = (sessionId) => {
  if (!storageAvailable() || !sessionId) return null;
  try {
    const snapshot = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${sessionId}`) || 'null');
    if (!snapshot || snapshot.version !== 1 || isExpired(snapshot)) {
      removeSpeakingConversation(sessionId);
      return null;
    }
    if (['recording', 'analyzing'].includes(snapshot.phase)) snapshot.phase = 'ready';
    return snapshot;
  } catch {
    removeSpeakingConversation(sessionId);
    return null;
  }
};

export const saveSpeakingConversation = (snapshot) => {
  if (!storageAvailable() || !snapshot?.sessionId) return snapshot;
  const stored = {
    ...snapshot,
    version: 1,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(`${STORAGE_PREFIX}${snapshot.sessionId}`, JSON.stringify(stored));

  const activeIndex = readIndex()
    .filter((item) => item.sessionId !== snapshot.sessionId)
    .filter((item) => loadSpeakingConversation(item.sessionId));
  const nextIndex = [
    { sessionId: snapshot.sessionId, updatedAt: stored.updatedAt },
    ...activeIndex
  ].slice(0, MAX_STORED_CONVERSATIONS);

  const retainedIds = new Set(nextIndex.map((item) => item.sessionId));
  readIndex().forEach((item) => {
    if (!retainedIds.has(item.sessionId)) localStorage.removeItem(`${STORAGE_PREFIX}${item.sessionId}`);
  });
  writeIndex(nextIndex);
  return stored;
};

export const getLatestActiveSpeakingConversation = () => {
  const index = readIndex()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  for (const item of index) {
    const snapshot = loadSpeakingConversation(item.sessionId);
    if (snapshot && snapshot.phase !== 'completed') return snapshot;
  }
  return null;
};

export const createSpeakingConversationSnapshot = (data) => saveSpeakingConversation({
  version: 1,
  sessionId: data.sessionId,
  topic: data.topic,
  level: data.level,
  phase: data.phase || 'ready',
  messages: data.messages || [],
  currentTurn: data.currentTurn || null,
  stateToken: data.stateToken,
  advanceToken: null,
  summary: '',
  averageScore: 0,
  expiresAt: data.expiresAt
});
