// ============================================
// Dictionary Module - Service
// API-only lookup. This module does not read from or write to database tables.
// ============================================

const normalizeDirection = (direction) => (direction === 'vi-en' ? 'vi-en' : 'en-vi');

const DATAMUSE_PARTS_OF_SPEECH = {
  adj: 'tính từ',
  adv: 'trạng từ',
  n: 'danh từ',
  v: 'động từ'
};

const PART_OF_SPEECH_VI = {
  noun: 'danh từ',
  verb: 'động từ',
  adjective: 'tính từ',
  adverb: 'trạng từ',
  pronoun: 'đại từ',
  preposition: 'giới từ',
  conjunction: 'liên từ',
  interjection: 'thán từ',
  determiner: 'từ hạn định',
  article: 'mạo từ',
  numeral: 'số từ',
  auxiliary: 'trợ động từ'
};

const localizePartOfSpeech = (value = '') => PART_OF_SPEECH_VI[String(value).toLowerCase()] || value;

const getDatamuseFrequency = (tags = []) => {
  const frequencyTag = tags.find((tag) => String(tag).startsWith('f:'));
  return frequencyTag ? Number(String(frequencyTag).slice(2)) || 0 : 0;
};

const getDatamusePartOfSpeech = (tags = []) => tags
  .map((tag) => DATAMUSE_PARTS_OF_SPEECH[tag])
  .filter(Boolean)
  .join(', ');

const AUTOCOMPLETE_MIN_FREQUENCY = 1;
const MAX_DEFINITIONS = 4;
const MAX_DEFINITIONS_PER_PART_OF_SPEECH = 1;

const rankAutocompleteCandidates = (items = [], query = '', limit = 8) => {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  const seen = new Set();

  const ranked = items
    .filter((item) => {
      const word = String(item?.word || '').trim().toLowerCase();
      if (!word || !word.startsWith(normalizedQuery) || seen.has(word)) return false;
      seen.add(word);
      return true;
    })
    .map((item) => ({
      ...item,
      exactMatch: String(item.word).toLowerCase() === normalizedQuery,
      lengthDelta: Math.max(0, String(item.word).length - normalizedQuery.length),
      frequency: getDatamuseFrequency(item.tags)
    }))
    .sort((a, b) => (
      Number(b.exactMatch) - Number(a.exactMatch)
      || b.frequency - a.frequency
      || Number(b.score || 0) - Number(a.score || 0)
      || a.lengthDelta - b.lengthDelta
      || String(a.word).localeCompare(String(b.word))
    ));

  const common = ranked.filter((item) => item.exactMatch || item.frequency >= AUTOCOMPLETE_MIN_FREQUENCY);
  return (common.length > 0 ? common : ranked.slice(0, 1)).slice(0, limit);
};

const isSpecializedDefinition = (definition = '') => /\([^)]*\)|\b(?:Amerind|First Nations|electromagnetic spectrum|color charge|heraldry|taxonomy|snooker|billiards|political party|revolutionary socialist|Communist|Bolshevik|obsolete|archaic)\b|To (?:govern, protect|discuss, deliberate)\.?$/i.test(definition);

const safeFetch = async (url, timeoutMs = 6000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch {
    clearTimeout(timer);
    return null;
  }
};

const makeExternalId = (source, word) => {
  const value = Buffer.from(`${source}:${word || ''}`).toString('base64url');
  return `external_${value}`;
};

const parseExternalId = (id) => {
  if (!id || !String(id).startsWith('external_')) return null;
  try {
    const decoded = Buffer.from(String(id).replace(/^external_/, ''), 'base64url').toString('utf8');
    const separator = decoded.indexOf(':');
    if (separator === -1) return null;
    return {
      source: decoded.slice(0, separator),
      value: decoded.slice(separator + 1)
    };
  } catch {
    return null;
  }
};

const getUniqueTranslations = (matches = [], originalWord = '', primaryTranslation = '') => {
  const original = String(originalWord || '').trim().toLowerCase();
  const ranked = [...matches].sort((a, b) => (
    Number(b['usage-count'] || 0) - Number(a['usage-count'] || 0)
    || Number(b.match || 0) - Number(a.match || 0)
    || Number(b.quality || 0) - Number(a.quality || 0)
  ));
  const candidates = [primaryTranslation, ...ranked.map((item) => item.translation)];
  const seen = new Set();

  return candidates.map((item) => String(item || '').trim()).filter((item) => {
    const key = item.toLowerCase();
    if (!item || key === original || seen.has(key) || item.length > 60) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
};

const translateWord = async (text, langpair) => {
  const res = await safeFetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`,
    6000
  );
  if (!res || !res.ok) return '';
  const data = await res.json();
  return (data.responseData?.translatedText || '').trim();
};

const parseDictionaryApiEntry = async ({ apiEntry, originalQuery, direction }) => {
  const meaningCandidates = [];
  const meaningKeys = new Set();
  const synonyms = new Set();

  apiEntry.meanings?.forEach((meaning) => {
    meaning.definitions?.forEach((definition) => {
      const partOfSpeech = localizePartOfSpeech(meaning.partOfSpeech || '');
      const key = `${partOfSpeech}|${definition.definition || ''}|${definition.example || ''}`.toLowerCase();
      if (meaningKeys.has(key)) return;
      meaningKeys.add(key);
      meaningCandidates.push({
        partOfSpeech,
        definition: definition.definition || '',
        example: definition.example || ''
      });
    });
    meaning.synonyms?.forEach((synonym) => synonyms.add(synonym));
  });

  const commonCandidates = meaningCandidates.filter((item) => (
    !isSpecializedDefinition(item.definition)
    && !(item.partOfSpeech === 'động từ' && !item.example && item.definition.length < 24)
  ));
  const partOfSpeechStats = commonCandidates.reduce((stats, item) => {
    const key = item.partOfSpeech || 'khác';
    const current = stats.get(key) || { count: 0, hasExample: false };
    current.count += 1;
    current.hasExample ||= Boolean(item.example);
    stats.set(key, current);
    return stats;
  }, new Map());
  const frequentPartOfSpeech = new Set([...partOfSpeechStats.entries()]
    .filter(([, stats]) => stats.count >= 4)
    .map(([partOfSpeech]) => partOfSpeech));
  const frequentCandidates = commonCandidates.filter((item) => frequentPartOfSpeech.has(item.partOfSpeech || 'khác'));
  const definitionPool = frequentCandidates.length > 0 ? frequentCandidates : (commonCandidates.length > 0 ? commonCandidates.slice(0, 1) : meaningCandidates.slice(0, 1));
  const definitionsPerPartOfSpeech = new Map();
  const allMeanings = definitionPool.filter((item) => {
    const key = item.partOfSpeech || 'khác';
    const count = definitionsPerPartOfSpeech.get(key) || 0;
    if (count >= MAX_DEFINITIONS_PER_PART_OF_SPEECH) return false;
    definitionsPerPartOfSpeech.set(key, count + 1);
    return true;
  }).slice(0, MAX_DEFINITIONS);

  let phonetic = apiEntry.phonetic || '';
  const audios = { uk: '', us: '' };
  apiEntry.phonetics?.forEach((item) => {
    if (item.text && !phonetic) phonetic = item.text;
    if (!item.audio) return;
    if (item.audio.includes('-uk')) audios.uk = item.audio;
    else if (item.audio.includes('-us')) audios.us = item.audio;
    else if (!audios.us) audios.us = item.audio;
  });

  let meaningVI = direction === 'vi-en' ? originalQuery : '';
  const transRes = await safeFetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(apiEntry.word)}&langpair=en|vi`,
    6000
  );
  if (transRes && transRes.ok) {
    const transData = await transRes.json();
    const filtered = getUniqueTranslations(transData.matches || [], apiEntry.word, transData.responseData?.translatedText).join('; ');
    meaningVI = filtered || transData.responseData?.translatedText || meaningVI;
  }

  return {
    Id: makeExternalId('dictionaryapi', apiEntry.word),
    Word: apiEntry.word?.toLowerCase() || originalQuery.toLowerCase(),
    Phonetic: phonetic.replaceAll('/', ''),
    PartOfSpeech: [...new Set(allMeanings.map((meaning) => meaning.partOfSpeech).filter(Boolean))].join(', '),
    MeaningEN: JSON.stringify(allMeanings),
    MeaningVI: meaningVI || 'No Vietnamese translation available',
    Example: allMeanings.find((item) => item.example)?.example || '',
    AudioUrl: JSON.stringify(audios),
    LevelId: null,
    LevelCode: null,
    LevelName: null,
    synonyms: [...synonyms].slice(0, 5),
    Source: 'dictionaryapi'
  };
};

const mergeDictionaryApiEntries = (items = []) => {
  const merged = new Map();

  items.forEach((item) => {
    const key = String(item?.word || '').trim().toLowerCase();
    if (!key) return;

    if (!merged.has(key)) {
      merged.set(key, {
        ...item,
        word: key,
        meanings: [...(item.meanings || [])],
        phonetics: [...(item.phonetics || [])]
      });
      return;
    }

    const target = merged.get(key);
    target.meanings.push(...(item.meanings || []));
    target.phonetics.push(...(item.phonetics || []));
    if (!target.phonetic && item.phonetic) target.phonetic = item.phonetic;
  });

  return [...merged.values()];
};

const dictionaryService = {
  async search({ query, page = 1, limit = 20, direction = 'en-vi' }) {
    const normalizedQuery = String(query || '').trim();
    if (!normalizedQuery) return { entries: [], total: 0, suggestions: [] };

    const pageNumber = Number.parseInt(page, 10) || 1;
    const resultLimit = Number.parseInt(limit, 10) || 20;
    if (pageNumber > 1) return { entries: [], total: 0, suggestions: [] };

    const safeDirection = normalizeDirection(direction);
    let targetWord = normalizedQuery;
    if (safeDirection === 'vi-en') {
      const translated = await translateWord(normalizedQuery, 'vi|en');
      if (translated) targetWord = translated.toLowerCase();
    }

    const entries = [];
    const extRes = await safeFetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(targetWord)}`,
      7000
    );

    if (extRes && extRes.ok) {
      const data = await extRes.json();
      for (const item of mergeDictionaryApiEntries(data).slice(0, resultLimit)) {
        entries.push(await parseDictionaryApiEntry({
          apiEntry: item,
          originalQuery: normalizedQuery,
          direction: safeDirection
        }));
      }
    }

    if (entries.length === 0) {
      const fallback = await this._translateFallback(targetWord, normalizedQuery, safeDirection);
      if (fallback) entries.push(fallback);
    }

    const suggestions = entries.length === 0
      ? await this._getSpellSuggestions(targetWord)
      : [];

    return { entries, total: entries.length, suggestions };
  },

  async _translateFallback(targetWord, originalQuery, direction) {
    const langpair = direction === 'en-vi' ? 'en|vi' : 'vi|en';
    const sourceText = direction === 'en-vi' ? targetWord : originalQuery;
    const translated = await translateWord(sourceText, langpair);
    if (!translated || translated.toLowerCase() === String(sourceText).toLowerCase()) return null;

    return {
      Id: makeExternalId('translation', `${direction}:${originalQuery}`),
      Word: direction === 'vi-en' ? translated.toLowerCase() : targetWord.toLowerCase(),
      Phonetic: '',
      PartOfSpeech: '',
      MeaningEN: direction === 'vi-en' ? translated : '',
      MeaningVI: direction === 'en-vi' ? translated : originalQuery,
      Example: '',
      AudioUrl: JSON.stringify({ uk: '', us: '' }),
      LevelId: null,
      LevelCode: null,
      LevelName: null,
      synonyms: [],
      Source: 'translation'
    };
  },

  async _getSpellSuggestions(word) {
    const suggestions = [];

    const addSuggestion = (item) => {
      if (item?.word && item.word.toLowerCase() !== word.toLowerCase()) {
        suggestions.push(item.word);
      }
    };

    const sugRes = await safeFetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(word)}&max=6`, 4000);
    if (sugRes && sugRes.ok) {
      const data = await sugRes.json();
      data.forEach(addSuggestion);
    }

    if (suggestions.length < 3) {
      const soundRes = await safeFetch(`https://api.datamuse.com/words?sl=${encodeURIComponent(word)}&max=5`, 4000);
      if (soundRes && soundRes.ok) {
        const data = await soundRes.json();
        data.forEach(addSuggestion);
      }
    }

    return [...new Set(suggestions)].slice(0, 8);
  },

  async getById(id) {
    const parsed = parseExternalId(id);
    if (!parsed?.value) return null;

    let direction = 'en-vi';
    let word = parsed.value;
    if (parsed.source === 'translation') {
      const [storedDirection, ...queryParts] = parsed.value.split(':');
      direction = normalizeDirection(storedDirection);
      word = queryParts.join(':') || parsed.value;
    }

    const result = await this.search({ query: word, limit: 1, direction });
    return result.entries[0] || null;
  },

  async logSearch() {
    return null;
  },

  async getHistory() {
    return [];
  },

  async create() {
    const error = new Error('Dictionary is API-only. Creating database dictionary entries is disabled.');
    error.statusCode = 400;
    throw error;
  },

  async autocomplete(query, limit = 8, direction = 'en-vi') {
    const normalizedQuery = String(query || '').trim();
    if (!normalizedQuery) return [];

    const resultLimit = Math.min(5, Math.max(1, Number.parseInt(limit, 10) || 5));
    const safeDirection = normalizeDirection(direction);
    if (safeDirection === 'vi-en') {
      const translated = await translateWord(normalizedQuery, 'vi|en');
      if (!translated) return [];
      return [{
        Word: translated.toLowerCase(),
        PartOfSpeech: null,
        MeaningVI: normalizedQuery
      }];
    }

    const candidateLimit = Math.min(100, Math.max(50, resultLimit * 10));
    let res = await safeFetch(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(normalizedQuery)}*&max=${candidateLimit}&md=pf`,
      3500
    );

    if (!res || !res.ok) {
      res = await safeFetch(
        `https://api.datamuse.com/sug?s=${encodeURIComponent(normalizedQuery)}&max=${candidateLimit}`,
        3000
      );
    }
    if (!res || !res.ok) return [];

    const data = await res.json();
    return rankAutocompleteCandidates(data, normalizedQuery, resultLimit).map((item) => ({
      Word: item.word,
      PartOfSpeech: getDatamusePartOfSpeech(item.tags) || null,
      MeaningVI: null
    }));
  },

  async translateSentence(text, direction = 'en-vi') {
    const safeDirection = normalizeDirection(direction);
    const langpair = safeDirection === 'en-vi' ? 'en|vi' : 'vi|en';
    const translated = await translateWord(text, langpair);
    return {
      translated: translated || null,
      source: text,
      direction: safeDirection
    };
  }
};

module.exports = dictionaryService;
