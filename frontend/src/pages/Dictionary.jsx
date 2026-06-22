import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck,
  FiCopy,
  FiRepeat,
  FiSearch,
  FiVolume2,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { dictionaryApi } from '../api/dictionaryApi';
import { useDebounce } from '../hooks/useDebounce';
import { playTrackedAudio, speakText as speakWithBrowser, stopAllPlayback } from '../utils/audioControl';

const getErrorMessage = (err, fallback) => err?.message || err?.errors?.[0]?.msg || fallback;

const isSentence = (text) => text.trim().split(/\s+/).filter(Boolean).length >= 3;
const pickValue = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) return item[key];
  }
  return undefined;
};
const getWord = (item) => pickValue(item, 'Word', 'word') || '';
const getMeaningVI = (item) => pickValue(item, 'MeaningVI', 'meaningVI', 'meaningvi') || '';
const getPartOfSpeech = (item) => pickValue(item, 'PartOfSpeech', 'partOfSpeech', 'partofspeech') || '';

const PART_OF_SPEECH_LABELS = {
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

const formatPartOfSpeech = (value = '') => String(value).split(',').map((part) => part.trim())
  .filter(Boolean)
  .map((part) => PART_OF_SPEECH_LABELS[part.toLowerCase()] || part)
  .join(', ');

const parseJson = (value, fallback) => {
  if (!value || typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

function Dictionary() {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState('en-vi');
  const [results, setResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autocomplete, setAutocomplete] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [sentenceResult, setSentenceResult] = useState(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [retryToken, setRetryToken] = useState(0);

  const debouncedQuery = useDebounce(query, 380);
  const autocompleteQuery = useDebounce(query, 160);
  const autocompleteRef = useRef(null);
  const requestIdRef = useRef(0);
  const autocompleteRequestIdRef = useRef(0);
  const searchInputRef = useRef(null);
  const selectedAutocompleteQueryRef = useRef('');

  const langFrom = direction === 'en-vi' ? 'English' : 'Tiếng Việt';
  const langTo = direction === 'en-vi' ? 'Tiếng Việt' : 'English';
  const trimmedQuery = query.trim();
  const sentenceMode = isSentence(trimmedQuery);
  const starterQueries = direction === 'en-vi'
    ? ['apple', 'appointment', 'How are you today?']
    : ['quả táo', 'cuộc hẹn', 'Hôm nay bạn thế nào?'];

  const meanings = useMemo(() => {
    if (!selectedWord) return [];
    if (selectedWord.MeaningEN?.startsWith('[')) {
      return parseJson(selectedWord.MeaningEN, []);
    }
    return [{
      partOfSpeech: selectedWord.PartOfSpeech,
      definition: selectedWord.MeaningEN || selectedWord.MeaningVI,
      example: selectedWord.Example,
    }];
  }, [selectedWord]);

  const audios = useMemo(() => {
    if (!selectedWord) return { uk: '', us: '' };
    if (selectedWord.AudioUrl?.startsWith('{')) {
      return parseJson(selectedWord.AudioUrl, { uk: '', us: '' });
    }
    return { uk: selectedWord.AudioUrl || '', us: selectedWord.AudioUrl || '' };
  }, [selectedWord]);

  useEffect(() => {
    const handler = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      stopAllPlayback();
    };
  }, []);

  useEffect(() => {
    const q = autocompleteQuery.trim();
    if (selectedAutocompleteQueryRef.current === q) {
      setAutocomplete([]);
      setShowAutocomplete(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const requestId = autocompleteRequestIdRef.current + 1;
    autocompleteRequestIdRef.current = requestId;

    if (q.length < 1 || isSentence(q)) {
      setAutocomplete([]);
      setShowAutocomplete(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    dictionaryApi.autocomplete({ q, limit: 5, direction })
      .then((res) => {
        if (autocompleteRequestIdRef.current !== requestId) return;
        const entries = res.data || [];
        setAutocomplete(entries);
        setShowAutocomplete(entries.length > 0);
        setActiveSuggestionIndex(-1);
      })
      .catch(() => {
        if (autocompleteRequestIdRef.current !== requestId) return;
        setAutocomplete([]);
        setShowAutocomplete(false);
      });
  }, [autocompleteQuery, direction]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    if (q.length < 2) {
      setResults([]);
      setSelectedWord(null);
      setSuggestions([]);
      setSentenceResult(null);
      setError('');
      setLoading(false);
      setSentenceLoading(false);
      return;
    }

    if (isSentence(q)) {
      setResults([]);
      setSelectedWord(null);
      setSuggestions([]);
      setError('');
      setSentenceLoading(true);
      dictionaryApi.translate({ text: q, direction })
        .then((res) => {
          if (requestIdRef.current === requestId) setSentenceResult(res.data);
        })
        .catch((err) => {
          if (requestIdRef.current === requestId) {
            setSentenceResult(null);
            setError(getErrorMessage(err, 'Không dịch được câu này. Vui lòng thử lại.'));
          }
        })
        .finally(() => {
          if (requestIdRef.current === requestId) setSentenceLoading(false);
        });
      return;
    }

    setSentenceResult(null);
    setLoading(true);
    setError('');
    setSuggestions([]);

    dictionaryApi.search({ q, limit: 20, direction })
      .then((res) => {
        if (requestIdRef.current !== requestId) return;
        const entries = res.data || [];
        setResults(entries);
        setSuggestions(res.suggestions || []);

        const exactMatch = entries.find((entry) => getWord(entry).toLowerCase() === q.toLowerCase());
        setSelectedWord(exactMatch || entries[0] || null);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        setResults([]);
        setSelectedWord(null);
        setSuggestions([]);
        setError(getErrorMessage(err, 'Không thể tra từ lúc này.'));
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });
  }, [debouncedQuery, direction, retryToken]);

  const selectQuery = (word) => {
    const nextQuery = String(word || '').trim();
    if (!nextQuery) return;
    selectedAutocompleteQueryRef.current = nextQuery;
    autocompleteRequestIdRef.current += 1;
    setAutocomplete([]);
    setQuery(nextQuery);
    setShowAutocomplete(false);
    setActiveSuggestionIndex(-1);

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setSentenceResult(null);
    setLoading(true);
    setError('');
    setSuggestions([]);

    dictionaryApi.search({ q: nextQuery, limit: 20, direction })
      .then((res) => {
        if (requestIdRef.current !== requestId) return;
        const entries = res.data || [];
        setResults(entries);
        setSuggestions(res.suggestions || []);
        const exactMatch = entries.find((entry) => getWord(entry).toLowerCase() === nextQuery.toLowerCase());
        setSelectedWord(exactMatch || entries[0] || null);
      })
      .catch((err) => {
        if (requestIdRef.current !== requestId) return;
        setResults([]);
        setSelectedWord(null);
        setSuggestions([]);
        setError(getErrorMessage(err, 'Không thể tra từ lúc này.'));
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });
  };

  const clearSearch = () => {
    requestIdRef.current += 1;
    autocompleteRequestIdRef.current += 1;
    selectedAutocompleteQueryRef.current = '';
    setQuery('');
    setResults([]);
    setSelectedWord(null);
    setSuggestions([]);
    setAutocomplete([]);
    setShowAutocomplete(false);
    setSentenceResult(null);
    setError('');
    setLoading(false);
    setSentenceLoading(false);
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (event) => {
    if (!showAutocomplete || autocomplete.length === 0) {
      if (event.key === 'Escape') setShowAutocomplete(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveSuggestionIndex((current) => (current + step + autocomplete.length) % autocomplete.length);
      return;
    }

    if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
      event.preventDefault();
      const item = autocomplete[activeSuggestionIndex];
      selectQuery(direction === 'vi-en' ? getMeaningVI(item) || getWord(item) : getWord(item));
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setShowAutocomplete(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'en-vi' ? 'vi-en' : 'en-vi'));
    setResults([]);
    setSelectedWord(null);
    setSuggestions([]);
    setSentenceResult(null);
    setError('');
    setAutocomplete([]);
    setShowAutocomplete(false);
    setActiveSuggestionIndex(-1);
    autocompleteRequestIdRef.current += 1;
    selectedAutocompleteQueryRef.current = '';
  };

  const viewWordDetail = (entry) => {
    setSelectedWord(entry);
  };

  const speakText = (text, lang = 'en-US') => {
    speakWithBrowser(text, { lang, rate: 0.9 });
  };

  const playAudio = (url, text) => {
    if (!url) {
      speakText(text);
      return;
    }
    playTrackedAudio(url, () => speakText(text));
  };

  const copyTranslation = async () => {
    const text = sentenceResult?.translated || selectedWord?.MeaningVI;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error('Không sao chép được nội dung.');
    }
  };

  return (
    <div className="dictionary-page">
      <section className="dictionary-header">
        <div>
          <span className="lingo-eyebrow">Dictionary</span>
          <h1>Từ điển thông minh</h1>
          <p>Tra từ, dịch câu và nghe phát âm bằng dữ liệu từ API.</p>
        </div>
        <button className="dictionary-direction" type="button" onClick={toggleDirection}>
          <span>{langFrom}</span>
          <FiRepeat />
          <span>{langTo}</span>
        </button>
      </section>

      <section className="dictionary-search-shell" ref={autocompleteRef}>
        <FiSearch className="dictionary-search-icon" />
        <input aria-label="Trường nhập"
          ref={searchInputRef}
          role="combobox"
          aria-autocomplete="list"
          aria-controls="dictionary-autocomplete-list"
          aria-activedescendant={activeSuggestionIndex >= 0 ? `dictionary-suggestion-${activeSuggestionIndex}` : undefined}
          aria-expanded={showAutocomplete && autocomplete.length > 0}
          autoComplete="off"
          spellCheck={false}
          className="dictionary-search-input"
          value={query}
          onChange={(event) => {
            selectedAutocompleteQueryRef.current = '';
            setQuery(event.target.value);
          }}
          onFocus={() => autocomplete.length > 0 && !sentenceMode && setShowAutocomplete(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder={direction === 'en-vi' ? 'Nhập từ hoặc câu tiếng Anh...' : 'Nhập từ hoặc câu tiếng Việt...'}

        />
        {query && (
          <button className="dictionary-clear" type="button" onClick={clearSearch} aria-label="Xóa tìm kiếm">
            <FiX />
          </button>
        )}

        {showAutocomplete && autocomplete.length > 0 && !sentenceMode && (
          <div id="dictionary-autocomplete-list" className="dictionary-autocomplete" role="listbox">
            {autocomplete.map((item, index) => (
              <button id={`dictionary-suggestion-${index}`} key={`${getWord(item)}-${getMeaningVI(item)}`} type="button" role="option" aria-selected={activeSuggestionIndex === index} className={activeSuggestionIndex === index ? 'is-active' : ''} onMouseEnter={() => setActiveSuggestionIndex(index)} onClick={() => selectQuery(direction === 'vi-en' ? getMeaningVI(item) || getWord(item) : getWord(item))}>
                <strong>{direction === 'vi-en' ? getMeaningVI(item) || getWord(item) : getWord(item)}</strong>
                <span>{direction === 'vi-en' ? `→ ${getWord(item)}` : getMeaningVI(item) || getPartOfSpeech(item) || 'Gợi ý từ vựng'}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="dictionary-mode-hint" aria-live="polite">
        <strong>{sentenceMode ? 'Dịch câu' : 'Tra từ'}</strong>
        <span>{sentenceMode ? 'Nhận diện câu tự động và dịch toàn bộ nội dung.' : 'Hiển thị nghĩa, loại từ, ví dụ và phát âm.'}</span>
      </div>

      {error && (
        <div className="dictionary-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setRetryToken((value) => value + 1)}>Thử lại</button>
        </div>
      )}

      {(sentenceLoading || sentenceResult) && (
        <motion.section className="dictionary-translation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {sentenceLoading ? (
            <div className="dictionary-loading">Đang dịch...</div>
          ) : sentenceResult?.translated ? (
            <>
              <div className="dictionary-section-head">
                <span>Bản dịch</span>
                <div>
                  <button type="button" onClick={() => speakText(direction === 'en-vi' ? sentenceResult.source : sentenceResult.translated, direction === 'en-vi' ? 'en-US' : 'vi-VN')} aria-label="Nghe">
                    <FiVolume2 />
                  </button>
                  <button type="button" onClick={copyTranslation} aria-label="Sao chép">
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>
              <small className="dictionary-translation-source">{sentenceResult.source}</small>
              <p>{sentenceResult.translated}</p>
            </>
          ) : (
            <div className="dictionary-empty">Không có bản dịch phù hợp.</div>
          )}
        </motion.section>
      )}

      {!sentenceMode && suggestions.length > 0 && results.length === 0 && !loading && (
        <section className="dictionary-suggestions">
          <strong>Không tìm thấy "{trimmedQuery}". Bạn muốn thử:</strong>
          <div>
            {suggestions.map((word) => (
              <button key={word} type="button" onClick={() => selectQuery(word)}>{word}</button>
            ))}
          </div>
        </section>
      )}

      {!sentenceMode && (
        <section className={`dictionary-workspace ${selectedWord ? 'has-detail' : ''}`}>
          <div className="dictionary-results">
            {loading && (
              <div className="dictionary-result-skeletons" aria-label="Đang tìm kiếm" role="status">
                {[0, 1, 2].map((item) => <span key={item} />)}
              </div>
            )}
            {!loading && trimmedQuery.length >= 2 && results.length === 0 && suggestions.length === 0 && !error && (
              <div className="dictionary-empty">Không tìm thấy kết quả cho "{trimmedQuery}".</div>
            )}
            {!loading && trimmedQuery.length < 2 && (
              <div className="dictionary-starter">
                <strong>Bắt đầu bằng một từ hoặc một câu</strong>
                <span>Chọn gợi ý hoặc nhập nội dung vào ô tìm kiếm.</span>
                <div>
                  {starterQueries.map((item) => <button key={item} type="button" onClick={() => selectQuery(item)}>{item}</button>)}
                </div>
              </div>
            )}

            <AnimatePresence>
              {results.map((entry) => (
                <motion.button
                  key={entry.Id || entry.Word}
                  type="button"
                  className={`dictionary-result ${selectedWord?.Id === entry.Id ? 'is-active' : ''}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => viewWordDetail(entry)}
                  aria-pressed={selectedWord?.Id === entry.Id}
                >
                  <span>
                    <strong>{entry.Word}</strong>
                    {entry.PartOfSpeech && <em>{formatPartOfSpeech(entry.PartOfSpeech)}</em>}
                  </span>
                  <small>{entry.MeaningVI || entry.MeaningEN}</small>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {selectedWord && (
            <motion.article className="dictionary-detail" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
              <div className="dictionary-detail-top">
                <div>
                  <h2>{selectedWord.Word}</h2>
                  {selectedWord.Phonetic && <p>/{selectedWord.Phonetic}/</p>}
                </div>
                <div className="dictionary-actions">
                  <button type="button" onClick={() => playAudio(audios.uk || audios.us, selectedWord.Word)} aria-label="Nghe phát âm">
                    <FiVolume2 />
                  </button>
                  <button type="button" onClick={copyTranslation} aria-label="Sao chép nghĩa">
                    {copied ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>

              <div className="dictionary-meaning-vi">
                <span>Nghĩa tiếng Việt</span>
                <strong>{selectedWord.MeaningVI || 'Chưa có bản dịch'}</strong>
              </div>

              <div className="dictionary-definitions">
                {meanings.map((meaning, index) => (
                  <div key={`${meaning.definition}-${index}`} className="dictionary-definition">
                    {meaning.partOfSpeech && <span>{formatPartOfSpeech(meaning.partOfSpeech)}</span>}
                    <p>{meaning.definition}</p>
                    {meaning.example && <blockquote>{meaning.example}</blockquote>}
                  </div>
                ))}
              </div>

              {selectedWord.synonyms?.length > 0 && (
                <div className="dictionary-synonyms">
                  <span>Từ đồng nghĩa</span>
                  <div>
                    {selectedWord.synonyms.map((word) => (
                      <button key={word} type="button" onClick={() => selectQuery(word)}>{word}</button>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>
          )}
        </section>
      )}

    </div>
  );
}

export default Dictionary;
