import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBookmark,
  FiCheck,
  FiClock,
  FiCopy,
  FiPlus,
  FiRepeat,
  FiSearch,
  FiVolume2,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { dictionaryApi } from '../api/dictionaryApi';
import { collectionApi } from '../api/collectionApi';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { playTrackedAudio, speakText as speakWithBrowser, stopAllPlayback } from '../utils/audioControl';

const getErrorMessage = (err, fallback) => err?.message || err?.errors?.[0]?.msg || fallback;

const isSentence = (text) => text.trim().split(/\s+/).filter(Boolean).length >= 3;

const parseJson = (value, fallback) => {
  if (!value || typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

function Dictionary() {
  const { user } = useAuth();
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
  const [history, setHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savingCollection, setSavingCollection] = useState(false);
  const [copied, setCopied] = useState(false);

  const debouncedQuery = useDebounce(query, 550);
  const autocompleteQuery = useDebounce(query, 220);
  const autocompleteRef = useRef(null);
  const requestIdRef = useRef(0);

  const langFrom = direction === 'en-vi' ? 'English' : 'Tiếng Việt';
  const langTo = direction === 'en-vi' ? 'Tiếng Việt' : 'English';
  const trimmedQuery = query.trim();
  const sentenceMode = isSentence(trimmedQuery);

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
    if (!user) return;
    dictionaryApi.getHistory()
      .then((res) => setHistory((res.data || []).slice(0, 8)))
      .catch(() => setHistory([]));
    collectionApi.getMyCollections()
      .then((res) => setCollections(res.data || []))
      .catch(() => setCollections([]));
  }, [user]);

  useEffect(() => {
    const q = autocompleteQuery.trim();
    if (q.length < 1 || isSentence(q)) {
      setAutocomplete([]);
      return;
    }

    dictionaryApi.autocomplete({ q, limit: 8, direction })
      .then((res) => {
        setAutocomplete(res.data || []);
        setShowAutocomplete(true);
      })
      .catch(() => setAutocomplete([]));
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

        const exactMatch = entries.find((entry) => entry.Word?.toLowerCase() === q.toLowerCase());
        if (!exactMatch) {
          setSelectedWord(null);
          return;
        }

        dictionaryApi.getById(exactMatch.Id)
          .then((detailRes) => {
            if (requestIdRef.current === requestId) setSelectedWord(detailRes.data);
          })
          .catch(() => {
            if (requestIdRef.current === requestId) setSelectedWord(exactMatch);
          });
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
  }, [debouncedQuery, direction]);

  const selectQuery = (word) => {
    setQuery(word);
    setShowAutocomplete(false);
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'en-vi' ? 'vi-en' : 'en-vi'));
    setResults([]);
    setSelectedWord(null);
    setSuggestions([]);
    setSentenceResult(null);
    setError('');
  };

  const viewWordDetail = async (entry) => {
    setSelectedWord(entry);
    try {
      const res = await dictionaryApi.getById(entry.Id);
      setSelectedWord(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được chi tiết từ.'));
    }
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

  const saveToCollection = async (collectionId) => {
    if (!selectedWord) return;
    setSavingCollection(true);
    try {
      await collectionApi.addWord(collectionId, { dictionaryEntryId: selectedWord.Id });
      toast.success('Đã lưu từ vào bộ sưu tập.');
      setShowSaveModal(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Lưu từ thất bại.'));
    } finally {
      setSavingCollection(false);
    }
  };

  return (
    <div className="dictionary-page">
      <section className="dictionary-header">
        <div>
          <span className="lingo-eyebrow">Dictionary</span>
          <h1>Từ điển thông minh</h1>
          <p>Tra từ, dịch câu, nghe phát âm và lưu từ vào bộ sưu tập cá nhân.</p>
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
          className="dictionary-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => autocomplete.length > 0 && !sentenceMode && setShowAutocomplete(true)}
          placeholder={direction === 'en-vi' ? 'Nhập từ hoặc câu tiếng Anh...' : 'Nhập từ hoặc câu tiếng Việt...'}

        />
        {query && (
          <button className="dictionary-clear" type="button" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm">
            <FiX />
          </button>
        )}

        {showAutocomplete && autocomplete.length > 0 && !sentenceMode && (
          <div className="dictionary-autocomplete">
            {autocomplete.map((item) => (
              <button key={`${item.Word}-${item.MeaningVI || ''}`} type="button" onClick={() => selectQuery(direction === 'vi-en' ? item.MeaningVI || item.Word : item.Word)}>
                <strong>{direction === 'vi-en' ? item.MeaningVI || item.Word : item.Word}</strong>
                <span>{direction === 'vi-en' ? item.Word : item.MeaningVI}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && trimmedQuery.length < 2 && (
        <section className="dictionary-history">
          <span><FiClock /> Tra gần đây</span>
          {history.map((item) => (
            <button key={item.Id} type="button" onClick={() => selectQuery(item.Word)}>{item.Word}</button>
          ))}
        </section>
      )}

      {error && <div className="dictionary-error">{error}</div>}

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
            {loading && <div className="dictionary-loading">Đang tìm kiếm...</div>}
            {!loading && trimmedQuery.length >= 2 && results.length === 0 && suggestions.length === 0 && !error && (
              <div className="dictionary-empty">Không tìm thấy kết quả cho "{trimmedQuery}".</div>
            )}
            {!loading && trimmedQuery.length < 2 && history.length === 0 && (
              <div className="dictionary-empty">Nhập ít nhất 2 ký tự để bắt đầu tra cứu.</div>
            )}

            <AnimatePresence>
              {results.map((entry) => (
                <motion.button
                  key={entry.Id}
                  type="button"
                  className={`dictionary-result ${selectedWord?.Id === entry.Id ? 'is-active' : ''}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => viewWordDetail(entry)}
                >
                  <span>
                    <strong>{entry.Word}</strong>
                    {entry.PartOfSpeech && <em>{entry.PartOfSpeech}</em>}
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
                  {user && (
                    <button type="button" onClick={() => setShowSaveModal(true)} aria-label="Lưu từ">
                      <FiBookmark />
                    </button>
                  )}
                </div>
              </div>

              <div className="dictionary-meaning-vi">
                <span>Nghĩa tiếng Việt</span>
                <strong>{selectedWord.MeaningVI || 'Chưa có bản dịch'}</strong>
              </div>

              <div className="dictionary-definitions">
                {meanings.map((meaning, index) => (
                  <div key={`${meaning.definition}-${index}`} className="dictionary-definition">
                    {meaning.partOfSpeech && <span>{meaning.partOfSpeech}</span>}
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

      {showSaveModal && (
        <div className="dictionary-modal-backdrop">
          <motion.div className="dictionary-modal" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="dictionary-section-head">
              <span>Lưu "{selectedWord?.Word}"</span>
              <button type="button" onClick={() => setShowSaveModal(false)} aria-label="Đóng"><FiX /></button>
            </div>

            {collections.length > 0 ? (
              <div className="dictionary-collection-list">
                {collections.map((collection) => (
                  <button key={collection.Id} type="button" disabled={savingCollection} onClick={() => saveToCollection(collection.Id)}>
                    <FiBookmark />
                    <span>{collection.Name}</span>
                    <small>{collection.WordCount || 0} từ</small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="dictionary-empty">
                <p>Bạn chưa có bộ sưu tập nào.</p>
                <Link to="/collections" className="btn btn-primary no-underline"><FiPlus /> Tạo bộ sưu tập</Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Dictionary;
