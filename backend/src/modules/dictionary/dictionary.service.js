// ============================================
// Dictionary Module — Service
// ============================================
const { sql, getPool } = require('../../config/database');
const { parsePagination } = require('../../utils/pagination');

// Safe fetch wrapper with timeout
const safeFetch = async (url, timeoutMs = 5000) => {
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

const dictionaryService = {
  /**
   * Main search — accepts direction: 'en-vi' | 'vi-en'
   */
  async search({ query, page, limit, levelId, direction = 'en-vi' }) {
    const pool = getPool();
    const { offset } = parsePagination({ page, limit });

    let whereClause = 'WHERE d.Word LIKE @query OR d.MeaningVI LIKE @query';
    const request = pool.request()
      .input('query', sql.NVarChar, `%${query}%`)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit));

    if (levelId) {
      whereClause += ' AND d.LevelId = @levelId';
      request.input('levelId', sql.Int, parseInt(levelId));
    }

    const countReq = pool.request().input('query', sql.NVarChar, `%${query}%`);
    if (levelId) countReq.input('levelId', sql.Int, parseInt(levelId));
    const countResult = await countReq.query(
      `SELECT COUNT(*) as total FROM DictionaryEntries d ${whereClause}`
    );

    const result = await request.query(`
      SELECT d.Id, d.Word, d.Phonetic, d.PartOfSpeech, d.MeaningEN, d.MeaningVI,
             d.Example, d.AudioUrl, d.LevelId,
             ll.Code as LevelCode, ll.Name as LevelName
      FROM DictionaryEntries d
      LEFT JOIN LearningLevels ll ON d.LevelId = ll.Id
      ${whereClause}
      ORDER BY d.Word ASC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);
    
    let entries = result.recordset;
    let total = countResult.recordset[0].total;
    let suggestions = [];

    const trimmedQuery = query.trim();

    // Exact match check
    const exactMatch = entries.find(e => e.Word.toLowerCase() === trimmedQuery.toLowerCase() || (e.MeaningVI && e.MeaningVI.toLowerCase().includes(trimmedQuery.toLowerCase())));
    
    if (!exactMatch && trimmedQuery.length >= 2 && parseInt(page) === 1 && !query.includes('%')) {
      try {
        let targetWord = trimmedQuery;
        
        // Direction-based translation
        if (direction === 'vi-en') {
          // Step 1: Translate VI → EN using MyMemory
          const vi2en = await safeFetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(targetWord)}&langpair=vi|en`);
          if (vi2en && vi2en.ok) {
            const viData = await vi2en.json();
            if (viData.responseData && viData.responseData.translatedText) {
              targetWord = viData.responseData.translatedText.toLowerCase().trim();
            }
          }
        }

        // Step 2: Fetch Free Dictionary API (always EN)
        const extRes = await safeFetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(targetWord)}`, 6000);
        
        if (extRes && extRes.ok) {
          const extData = await extRes.json();
          const first = extData[0];
          
          let allMeanings = [];
          let allSynonyms = new Set();
          
          first.meanings?.forEach(m => {
            let pos = m.partOfSpeech;
            m.definitions?.forEach(d => {
              allMeanings.push({
                partOfSpeech: pos,
                definition: d.definition,
                example: d.example || ''
              });
            });
            m.synonyms?.forEach(s => allSynonyms.add(s));
          });

          const meaningEN = JSON.stringify(allMeanings);

          let audios = { uk: '', us: '' };
          let phonetic = first.phonetic || '';
          
          first.phonetics?.forEach(p => {
             if (p.text && !phonetic) phonetic = p.text;
             if (p.audio) {
               if (p.audio.includes('-uk')) audios.uk = p.audio;
               else if (p.audio.includes('-us')) audios.us = p.audio;
               else if (!audios.us) audios.us = p.audio;
             }
          });
          const audioUrl = JSON.stringify(audios);

          // Step 3: Translate EN → VI
          let meaningVI = '';
          if (direction === 'vi-en') {
            meaningVI = trimmedQuery; // original Vietnamese input
          }
          try {
            const en2vi = await safeFetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(first.word)}&langpair=en|vi`);
            if (en2vi && en2vi.ok) {
              const transData = await en2vi.json();
              if (transData.matches && transData.matches.length > 0) {
                const uniqueTrans = [...new Set(transData.matches.map(m => m.translation))];
                const viMeaning = uniqueTrans.filter(t => t.toLowerCase() !== first.word.toLowerCase()).join('; ');
                if (viMeaning) meaningVI = viMeaning;
              } else if (transData.responseData && transData.responseData.translatedText) {
                if (!meaningVI) meaningVI = transData.responseData.translatedText;
              }
            }
          } catch(e) { console.error('EN->VI Translation error', e); }
          if (!meaningVI) meaningVI = "Chưa có bản dịch";

          const synonymsArray = Array.from(allSynonyms).slice(0, 8);

          // Step 4: Create in Local DB
          const newEntry = await this.create({
            word: first.word.toLowerCase(),
            phonetic: phonetic.split('/').join(''),
            partOfSpeech: first.meanings?.[0]?.partOfSpeech || '',
            meaningEN,
            meaningVI,
            example: '',
            audioUrl,
            synonyms: synonymsArray
          });

          entries.unshift(newEntry);
          total += 1;
        } else {
          // Dictionary API failed — try translation fallback for compound words/phrases
          const fallbackEntry = await this._translateFallback(targetWord, trimmedQuery, direction);
          if (fallbackEntry) {
            entries.unshift(fallbackEntry);
            total += 1;
          } else {
            suggestions = await this._getSpellSuggestions(targetWord, direction, pool);
          }
        }
      } catch (err) {
        console.error('External Dictionary API error:', err.message);
      }
    }

    return { entries, total, suggestions };
  },

  /**
   * Fallback: translate compound words / phrases via MyMemory when dictionary API fails
   */
  async _translateFallback(targetWord, originalQuery, direction) {
    try {
      let translated = null;

      if (direction === 'en-vi') {
        const res = await safeFetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(targetWord)}&langpair=en|vi`,
          6000
        );
        if (!res || !res.ok) return null;
        const data = await res.json();
        translated = data.responseData?.translatedText;
        if (!translated || translated.toLowerCase() === targetWord.toLowerCase()) return null;
      } else {
        // For vi-en, originalQuery is VI, targetWord is EN (translated in step 1).
        if (targetWord.toLowerCase() === originalQuery.toLowerCase()) return null;
        translated = targetWord;
      }

      // Check if already exists in DB
      const englishWord = direction === 'vi-en' ? translated.toLowerCase() : targetWord.toLowerCase();
      
      const pool = getPool();
      const existing = await pool.request()
        .input('w', sql.NVarChar, englishWord)
        .query('SELECT TOP 1 * FROM DictionaryEntries WHERE LOWER(Word) = @w');
      if (existing.recordset.length > 0) return existing.recordset[0];

      // Create new entry
      const meaningVI = direction === 'vi-en' ? originalQuery : translated;
      const meaningEN = direction === 'vi-en' ? translated : null;

      const newEntry = await this.create({
        word: englishWord,
        phonetic: '',
        partOfSpeech: '',
        meaningEN: meaningEN || '',
        meaningVI,
        example: '',
        audioUrl: '',
        synonyms: []
      });
      return newEntry;
    } catch (e) {
      console.error('Translate fallback error:', e.message);
      return null;
    }
  },

  /**
   * Spell-check / suggestion engine
   * Tries multiple sources to suggest correct words
   */
  async _getSpellSuggestions(word, direction, pool) {
    const suggestions = [];

    try {
      // Source 1: Datamuse API — free spell-check + suggestions
      const datamuseRes = await safeFetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(word)}&max=6`);
      if (datamuseRes && datamuseRes.ok) {
        const datamuseData = await datamuseRes.json();
        datamuseData.forEach(item => {
          if (item.word && item.word.toLowerCase() !== word.toLowerCase()) {
            suggestions.push(item.word);
          }
        });
      }
    } catch (e) { /* ignore */ }

    try {
      // Source 2: Datamuse "sounds like" for phonetic misspellings
      if (suggestions.length < 3) {
        const soundsLikeRes = await safeFetch(`https://api.datamuse.com/words?sl=${encodeURIComponent(word)}&max=4`);
        if (soundsLikeRes && soundsLikeRes.ok) {
          const slData = await soundsLikeRes.json();
          slData.forEach(item => {
            if (item.word && !suggestions.includes(item.word) && item.word.toLowerCase() !== word.toLowerCase()) {
              suggestions.push(item.word);
            }
          });
        }
      }
    } catch (e) { /* ignore */ }

    try {
      // Source 3: Local DB — fuzzy match with LIKE
      const fuzzyResult = await pool.request()
        .input('fuzzy', sql.NVarChar, `${word.substring(0, Math.max(2, Math.floor(word.length * 0.6)))}%`)
        .query('SELECT TOP 5 Word FROM DictionaryEntries WHERE Word LIKE @fuzzy ORDER BY Word');
      fuzzyResult.recordset.forEach(r => {
        if (!suggestions.includes(r.Word) && r.Word.toLowerCase() !== word.toLowerCase()) {
          suggestions.push(r.Word);
        }
      });
    } catch (e) { /* ignore */ }

    // Deduplicate + limit
    return [...new Set(suggestions)].slice(0, 8);
  },

  async getById(entryId) {
    const pool = getPool();

    const entryResult = await pool.request()
      .input('entryId', sql.UniqueIdentifier, entryId)
      .query(`
        SELECT d.*, ll.Code as LevelCode, ll.Name as LevelName
        FROM DictionaryEntries d
        LEFT JOIN LearningLevels ll ON d.LevelId = ll.Id
        WHERE d.Id = @entryId
      `);

    if (entryResult.recordset.length === 0) return null;
    const entry = entryResult.recordset[0];

    // Get synonyms
    const synonymResult = await pool.request()
      .input('wordId', sql.UniqueIdentifier, entryId)
      .query('SELECT Id, Synonym FROM DictionarySynonyms WHERE WordId = @wordId');

    entry.synonyms = synonymResult.recordset.map(s => s.Synonym);
    return entry;
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
        SELECT TOP 50 Id, Word, SearchedAt
        FROM DictionarySearchHistory
        WHERE UserId = @userId
        ORDER BY SearchedAt DESC
      `);
    return result.recordset;
  },

  async create(data) {
    const pool = getPool();
    const result = await pool.request()
      .input('word', sql.NVarChar, data.word)
      .input('phonetic', sql.NVarChar, data.phonetic || null)
      .input('partOfSpeech', sql.NVarChar, data.partOfSpeech || null)
      .input('meaningEN', sql.NVarChar, data.meaningEN || null)
      .input('meaningVI', sql.NVarChar, data.meaningVI)
      .input('example', sql.NVarChar, data.example || null)
      .input('audioUrl', sql.NVarChar, data.audioUrl || null)
      .input('levelId', sql.Int, data.levelId || null)
      .query(`
        INSERT INTO DictionaryEntries (Word, Phonetic, PartOfSpeech, MeaningEN, MeaningVI, Example, AudioUrl, LevelId)
        OUTPUT INSERTED.*
        VALUES (@word, @phonetic, @partOfSpeech, @meaningEN, @meaningVI, @example, @audioUrl, @levelId)
      `);

    // Add synonyms if provided
    if (data.synonyms && data.synonyms.length > 0) {
      for (const synonym of data.synonyms) {
        await pool.request()
          .input('wordId', sql.UniqueIdentifier, result.recordset[0].Id)
          .input('synonym', sql.NVarChar, synonym)
          .query('INSERT INTO DictionarySynonyms (WordId, Synonym) VALUES (@wordId, @synonym)');
      }
    }

    return result.recordset[0];
  },

  /**
   * Autocomplete — fast keyword suggestions as user types
   */
  async autocomplete(query, limit = 8) {
    const pool = getPool();
    const result = await pool.request()
      .input('q', sql.NVarChar, `${query}%`)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP (@limit) Word, PartOfSpeech, MeaningVI
        FROM DictionaryEntries
        WHERE Word LIKE @q OR MeaningVI LIKE @q
        ORDER BY 
          CASE WHEN Word LIKE @q THEN 0 ELSE 1 END,
          LEN(Word) ASC, 
          Word ASC
      `);
    
    // Also try Datamuse for words not in local DB
    let external = [];
    if (result.recordset.length < limit && query.length >= 2) {
      try {
        const res = await safeFetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(query)}&max=${limit}`, 3000);
        if (res && res.ok) {
          const data = await res.json();
          const localWords = result.recordset.map(r => r.Word.toLowerCase());
          external = data
            .filter(d => !localWords.includes(d.word.toLowerCase()))
            .map(d => ({ Word: d.word, PartOfSpeech: null, MeaningVI: null }))
            .slice(0, limit - result.recordset.length);
        }
      } catch (e) { /* ignore */ }
    }

    return [...result.recordset, ...external];
  },

  /**
   * Translate a full sentence (EN->VI or VI->EN)
   */
  async translateSentence(text, direction = 'en-vi') {
    const langpair = direction === 'en-vi' ? 'en|vi' : 'vi|en';
    
    try {
      const res = await safeFetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`,
        8000
      );
      if (!res || !res.ok) return { translated: null, error: 'Translation service unavailable' };
      
      const data = await res.json();
      const translated = data.responseData?.translatedText || null;
      
      return { 
        translated,
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
