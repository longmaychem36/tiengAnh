// ============================================
// Dictionary Module - Service
// API-only lookup. Database is used for search history and saved collections only.
// ============================================
const { sql, getPool } = require('../../config/database');

const safeFetch = async (url, timeoutMs = 6000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
};

const makeExternalId = (source, word) => {
  const value = Buffer.from(`${source}:${word || ''}`).toString('base64url');
  return `external_${value}`;
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
    const matches = transData.matches || [];
    const uniqueTranslations = [...new Set(matches.map((m) => m.translation).filter(Boolean))];
    const filtered = uniqueTranslations
      .filter((item) => item.toLowerCase() !== apiEntry.word.toLowerCase())
      .slice(0, 6)
      .join('; ');
    meaningVI = filtered || transData.responseData?.translatedText || meaningVI;
  }

  return {
    Id: makeExternalId('dictionaryapi', apiEntry.word),
    Word: apiEntry.word?.toLowerCase() || originalQuery.toLowerCase(),
    Phonetic: phonetic.replaceAll('/', ''),
    PartOfSpeech: apiEntry.meanings?.[0]?.partOfSpeech || '',
    MeaningEN: JSON.stringify(allMeanings),
    MeaningVI: meaningVI || 'Chưa có bản dịch',
    Example: allMeanings.find((item) => item.example)?.example || '',
    AudioUrl: JSON.stringify(audios),
    LevelId: null,
    LevelCode: null,
    LevelName: null,
    synonyms: [...synonyms].slice(0, 8),
    Source: 'dictionaryapi'
  };
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

const dictionaryService = {
  async search({ query, page = 1, limit = 20, direction = 'en-vi' }) {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return { entries: [], total: 0, suggestions: [] };

    const pageNumber = Number.parseInt(page, 10) || 1;
    const resultLimit = Number.parseInt(limit, 10) || 20;
    if (pageNumber > 1) return { entries: [], total: 0, suggestions: [] };

    let targetWord = normalizedQuery;
    if (direction === 'vi-en') {
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
          direction
        }));
      }
    }

    if (entries.length === 0) {
      const fallback = await this._translateFallback(targetWord, normalizedQuery, direction);
      if (fallback) entries.push(fallback);
    }

    const suggestions = entries.length === 0
      ? await this._getSpellSuggestions(targetWord)
      : [];

    return { entries, total: entries.length, suggestions };
  },

  async _translateFallback(targetWord, originalQuery, direction) {
    const langpair = direction === 'en-vi' ? 'en|vi' : 'vi|en';
    const translated = await translateWord(direction === 'en-vi' ? targetWord : originalQuery, langpair);
    if (!translated || translated.toLowerCase() === String(targetWord).toLowerCase()) return null;

    const word = direction === 'vi-en' ? translated.toLowerCase() : targetWord.toLowerCase();
    return {
      Id: makeExternalId('translation', `${direction}:${originalQuery}`),
      Word: word,
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

  async getById() {
    return null;
  },

  async logSearch(userId, word) {
    const pool = getPool();
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('word', sql.NVarChar, word)
      .query('INSERT INTO DictionarySearchHistory (UserId, Word) VALUES (@userId, @word)');
  },

  async getHistory(userId) {
    const pool = getPool();
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT Id, Word, SearchedAt
        FROM DictionarySearchHistory
        WHERE UserId = @userId
        ORDER BY SearchedAt DESC
        LIMIT 50
      `);
    return result.recordset;
  },

  async create(data) {
    return {
      Id: makeExternalId('manual', data.word),
      Word: data.word,
      Phonetic: data.phonetic || '',
      PartOfSpeech: data.partOfSpeech || '',
      MeaningEN: data.meaningEN || '',
      MeaningVI: data.meaningVI || '',
      Example: data.example || '',
      AudioUrl: data.audioUrl || '',
      synonyms: data.synonyms || [],
      Source: 'manual'
    };
  },

  async autocomplete(query, limit = 8, direction = 'en-vi') {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return [];

    if (direction === 'vi-en') {
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
    const langpair = direction === 'en-vi' ? 'en|vi' : 'vi|en';
    try {
      const translated = await translateWord(text, langpair);
      return {
        translated: translated || null,
        source: text,
        direction
      };
    } catch (e) {
      console.error('Sentence translation error:', e.message);
      return { translated: null, error: e.message };
    }
  }
};

module.exports = dictionaryService;
