// ============================================
// Dictionary Module - Service
// API-only lookup. This module does not read from or write to database tables.
// ============================================

const normalizeDirection = (direction) => (direction === 'vi-en' ? 'vi-en' : 'en-vi');

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

const getUniqueTranslations = (matches = [], originalWord = '') => {
  const original = String(originalWord || '').trim().toLowerCase();
  return [...new Set(matches.map((item) => item.translation).filter(Boolean))]
    .map((item) => item.trim())
    .filter((item) => item && item.toLowerCase() !== original)
    .slice(0, 6);
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
  const allMeanings = [];
  const synonyms = new Set();

  apiEntry.meanings?.forEach((meaning) => {
    meaning.definitions?.forEach((definition) => {
      allMeanings.push({
        partOfSpeech: meaning.partOfSpeech || '',
        definition: definition.definition || '',
        example: definition.example || ''
      });
    });
    meaning.synonyms?.forEach((synonym) => synonyms.add(synonym));
  });

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
    const filtered = getUniqueTranslations(transData.matches || [], apiEntry.word).join('; ');
    meaningVI = filtered || transData.responseData?.translatedText || meaningVI;
  }

  return {
    Id: makeExternalId('dictionaryapi', apiEntry.word),
    Word: apiEntry.word?.toLowerCase() || originalQuery.toLowerCase(),
    Phonetic: phonetic.replaceAll('/', ''),
    PartOfSpeech: apiEntry.meanings?.[0]?.partOfSpeech || '',
    MeaningEN: JSON.stringify(allMeanings),
    MeaningVI: meaningVI || 'No Vietnamese translation available',
    Example: allMeanings.find((item) => item.example)?.example || '',
    AudioUrl: JSON.stringify(audios),
    LevelId: null,
    LevelCode: null,
    LevelName: null,
    synonyms: [...synonyms].slice(0, 8),
    Source: 'dictionaryapi'
  };
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
      for (const item of data.slice(0, resultLimit)) {
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
    const word = parsed.source === 'translation'
      ? parsed.value.split(':').slice(1).join(':') || parsed.value
      : parsed.value;
    const result = await this.search({ query: word, limit: 1, direction: 'en-vi' });
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

    const res = await safeFetch(
      `https://api.datamuse.com/sug?s=${encodeURIComponent(normalizedQuery)}&max=${Number.parseInt(limit, 10) || 8}`,
      3000
    );
    if (!res || !res.ok) return [];
    const data = await res.json();
    return data.map((item) => ({
      Word: item.word,
      PartOfSpeech: null,
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
