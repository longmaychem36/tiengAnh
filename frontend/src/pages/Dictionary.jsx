// ============================================
// Dictionary Page — Unified Search + Translation + Pronunciation
// ============================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiVolume2, FiBookmark, FiPlus, FiX, FiRepeat } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { dictionaryApi } from '../api/dictionaryApi';
import { collectionApi } from '../api/collectionApi';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';

function Dictionary() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Autocomplete
  const [acResults, setAcResults] = useState([]);
  const [showAc, setShowAc] = useState(false);
  const acRef = useRef(null);
  const acDebounced = useDebounce(query, 250);

  // Sentence translation result (shown inline when query has multiple words)
  const [sentenceResult, setSentenceResult] = useState(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);

  const [direction, setDirection] = useState('en-vi');
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [savingCollection, setSavingCollection] = useState(false);

  const debouncedQuery = useDebounce(query, 600);

  // Detect: is this a sentence (3+ words)?
  const isSentence = (text) => text.trim().split(/\s+/).length >= 3;

  // Autocomplete — only for short queries
  useEffect(() => {
    if (acDebounced.trim().length < 1 || isSentence(acDebounced)) { setAcResults([]); return; }
    dictionaryApi.autocomplete({ q: acDebounced.trim(), limit: 8 })
      .then(res => { setAcResults(res.data || []); setShowAc(true); })
      .catch(() => setAcResults([]));
  }, [acDebounced]);

  // Close autocomplete on outside click
  useEffect(() => {
    const handler = (e) => { if (acRef.current && !acRef.current.contains(e.target)) setShowAc(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Main search effect
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) { setResults([]); setSuggestions([]); setSentenceResult(null); return; }

    if (isSentence(q)) {
      // Sentence → translate
      setResults([]); setSuggestions([]); setSelectedWord(null);
      setSentenceLoading(true);
      dictionaryApi.translate({ text: q, direction })
        .then(res => setSentenceResult(res.data))
        .catch(() => setSentenceResult(null))
        .finally(() => setSentenceLoading(false));
    } else {
      // Word → dictionary search
      setSentenceResult(null);
      setLoading(true); setSuggestions([]);
      dictionaryApi.search({ q, limit: 20, direction })
        .then(res => { 
          const entries = res.data || [];
          setResults(entries); 
          setSuggestions(res.suggestions || []); 
          
          // Auto-select exact match
          const exactMatch = entries.find(e => e.Word.toLowerCase() === q.toLowerCase());
          if (exactMatch) {
            dictionaryApi.getById(exactMatch.Id)
              .then(detailRes => setSelectedWord(detailRes.data))
              .catch(() => setSelectedWord(null));
          } else {
            setSelectedWord(null);
          }
        })
        .catch(() => { setResults([]); setSuggestions([]); setSelectedWord(null); })
        .finally(() => setLoading(false));
    }
  }, [debouncedQuery, direction]);

  useEffect(() => {
    if (user) collectionApi.getMyCollections().then(res => setCollections(res.data || [])).catch(() => {});
  }, [user]);

  const toggleDirection = () => {
    setDirection(prev => prev === 'en-vi' ? 'vi-en' : 'en-vi');
    setResults([]); setSelectedWord(null); setSuggestions([]); setSentenceResult(null);
  };

  const handleAcSelect = (word) => { setQuery(word); setShowAc(false); };

  const viewWordDetail = async (id) => {
    try { const res = await dictionaryApi.getById(id); setSelectedWord(res.data); }
    catch { setSelectedWord(null); }
  };

  const handleSaveToCollection = async (collectionId) => {
    if (!selectedWord) return;
    setSavingCollection(true);
    try {
      await collectionApi.addWord(collectionId, { dictionaryEntryId: selectedWord.Id });
      toast.success('Đã lưu từ vào bộ sưu tập!'); setShowModal(false);
    } catch (err) { toast.error(err.message || 'Lưu từ thất bại'); }
    finally { setSavingCollection(false); }
  };

  const parseJson = (str, fallback) => {
    if (!str) return fallback;
    try { return JSON.parse(str); } catch { return fallback; }
  };

  const playAudio = (url, text) => {
    if (url) {
      const audio = new Audio(url);
      audio.onerror = () => speakTTS(text);
      audio.play().catch(() => speakTTS(text));
    } else { speakTTS(text); }
  };

  const speakTTS = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  let meanings = [], audios = { uk: '', us: '' };
  if (selectedWord) {
    meanings = (selectedWord.MeaningEN && selectedWord.MeaningEN.startsWith('['))
      ? parseJson(selectedWord.MeaningEN, [])
      : [{ partOfSpeech: selectedWord.PartOfSpeech, definition: selectedWord.MeaningEN, example: selectedWord.Example }];
    audios = (selectedWord.AudioUrl && selectedWord.AudioUrl.startsWith('{'))
      ? parseJson(selectedWord.AudioUrl, { uk: '', us: '' })
      : { uk: selectedWord.AudioUrl, us: selectedWord.AudioUrl };
  }

  const langFrom = direction === 'en-vi' ? 'English' : 'Tiếng Việt';
  const langTo = direction === 'en-vi' ? 'Tiếng Việt' : 'English';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header" style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ color: '#1d2a57', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ background: '#1d2a57', color: 'white', padding: '4px 12px', borderRadius: 4, fontSize: '0.8em' }}>
            {direction === 'en-vi' ? 'EN→VI' : 'VI→EN'}
          </span>
          Từ Điển
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>
          Nhập từ để tra nghĩa, nhập câu để dịch — tự động nhận diện
        </p>
      </div>

      {/* Direction Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <button onClick={toggleDirection} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: '10px 20px', borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #1d2a57, #3b4fa3)',
          color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 'var(--font-size-sm)',
          boxShadow: '0 4px 12px rgba(29,42,87,0.25)'
        }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-xs)', fontWeight: 800 }}>{langFrom}</span>
          <FiRepeat size={16} />
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-xs)', fontWeight: 800 }}>{langTo}</span>
        </button>
      </div>

      {/* Unified Search Bar */}
      <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }} ref={acRef}>
        <FiSearch size={22} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#1d2a57' }} />
        <input className="form-input" type="text"
          placeholder={direction === 'en-vi' ? 'Nhập từ hoặc câu tiếng Anh...' : 'Nhập từ hoặc câu tiếng Việt...'}
          value={query} onChange={e => setQuery(e.target.value)}
          onFocus={() => acResults.length > 0 && !isSentence(query) && setShowAc(true)}
          style={{ paddingLeft: 56, fontSize: 'var(--font-size-xl)', height: 64, borderRadius: 32, border: '2px solid #1d2a57', boxShadow: '0 4px 12px rgba(29,42,87,0.1)' }}
          autoFocus
        />
        {/* Autocomplete dropdown */}
        {showAc && acResults.length > 0 && !isSentence(query) && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 320, overflowY: 'auto', marginTop: 4 }}>
            {acResults.map((item, i) => (
              <div key={i} onClick={() => handleAcSelect(item.Word)}
                style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < acResults.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#1d2a57' }}>{item.Word}</span>
                  {item.PartOfSpeech && <span style={{ marginLeft: 8, color: '#94a3b8', fontStyle: 'italic', fontSize: 'var(--font-size-xs)' }}>{item.PartOfSpeech}</span>}
                </div>
                {item.MeaningVI && <span style={{ color: '#64748b', fontSize: 'var(--font-size-sm)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.MeaningVI}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === SENTENCE TRANSLATION RESULT === */}
      {(sentenceLoading || sentenceResult) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #e5e7eb' }}>
          {sentenceLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-4)' }}>Đang dịch...</div>
          ) : sentenceResult?.translated ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontWeight: 700, color: '#1d2a57', textTransform: 'uppercase', fontSize: 'var(--font-size-xs)' }}>Bản dịch</span>
                <button onClick={() => speakTTS(direction === 'en-vi' ? sentenceResult.source : sentenceResult.translated)}
                  style={{ background: '#1d2a57', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <FiVolume2 size={16} />
                </button>
              </div>
              <p style={{ fontSize: 'var(--font-size-xl)', color: '#0f172a', fontWeight: 600, lineHeight: 1.6 }}>{sentenceResult.translated}</p>
            </>
          ) : (
            <div style={{ color: '#dc2626', fontWeight: 600 }}>Không thể dịch câu này. Vui lòng thử lại.</div>
          )}
        </motion.div>
      )}

      {/* === WORD RESULTS === */}
      {!isSentence(query) && (
        <>
          {/* Spell Suggestions */}
          {suggestions.length > 0 && results.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderRadius: 'var(--radius-lg)', border: '1px solid #fbbf24' }}>
              <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 'var(--space-3)' }}>
                Không tìm thấy "{query}". Có phải bạn muốn tìm:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s); setSuggestions([]); }}
                    style={{ padding: '6px 16px', background: '#fff', border: '2px solid #f59e0b', borderRadius: 'var(--radius-full)', color: '#92400e', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
                    onMouseOver={e => { e.target.style.background = '#f59e0b'; e.target.style.color = '#fff'; }}
                    onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = '#92400e'; }}
                  >{s}</button>
                ))}
              </div>
            </motion.div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: selectedWord ? '350px 1fr' : '1fr', gap: 'var(--space-8)' }}>
            <div>
              {loading && <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>Đang tìm kiếm...</div>}
              {!loading && results.length === 0 && query.trim().length >= 2 && suggestions.length === 0 && !sentenceResult && (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>Không tìm thấy kết quả cho "{query}"</div>
              )}
              <AnimatePresence>
                {results.map((entry, i) => (
                  <motion.div key={entry.Id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => viewWordDetail(entry.Id)}
                    style={{ cursor: 'pointer', marginBottom: 'var(--space-3)', padding: 'var(--space-4)', borderRadius: 8, background: selectedWord?.Id === entry.Id ? '#f3f4f6' : 'white', border: '1px solid #e5e7eb', borderLeft: selectedWord?.Id === entry.Id ? '4px solid #1d2a57' : '1px solid #e5e7eb', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', color: '#1d2a57' }}>{entry.Word}</span>
                      {entry.PartOfSpeech && <span style={{ color: '#0059b3', fontStyle: 'italic', fontSize: 'var(--font-size-sm)' }}>{entry.PartOfSpeech}</span>}
                    </div>
                    <p style={{ color: '#4b5563', marginTop: 8, fontSize: 'var(--font-size-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.MeaningVI}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Word Detail */}
            {selectedWord && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <div style={{ borderBottom: '1px solid #e5e7eb', padding: 'var(--space-6)', position: 'relative' }}>
                    {user && (
                      <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(true)} style={{ position: 'absolute', right: 24, top: 24, background: '#facc15', color: '#854d0e', border: 'none' }}>
                        <FiBookmark /> Lưu
                      </button>
                    )}
                    <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#1d2a57', marginBottom: 16 }}>{selectedWord.Word}</h2>
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#e60000', fontWeight: 700, fontSize: '0.85em' }}>UK</span>
                        <button onClick={() => playAudio(audios.uk, selectedWord.Word)} style={{ background: '#e60000', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiVolume2 size={16} /></button>
                        {selectedWord.Phonetic && <span style={{ color: '#4b5563', fontFamily: 'monospace', fontSize: '1.1em' }}>/{selectedWord.Phonetic}/</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#0059b3', fontWeight: 700, fontSize: '0.85em' }}>US</span>
                        <button onClick={() => playAudio(audios.us, selectedWord.Word)} style={{ background: '#0059b3', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FiVolume2 size={16} /></button>
                        {selectedWord.Phonetic && <span style={{ color: '#4b5563', fontFamily: 'monospace', fontSize: '1.1em' }}>/{selectedWord.Phonetic}/</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-4) var(--space-6)', background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: 600, color: '#1d2a57', marginRight: 8, textTransform: 'uppercase', fontSize: '0.8em' }}>Bản Dịch:</span>
                    <span style={{ fontSize: '1.1em', color: '#0f172a', fontWeight: 600 }}>{selectedWord.MeaningVI}</span>
                  </div>
                  <div style={{ padding: 'var(--space-6)' }}>
                    {meanings.map((m, idx) => (
                      <div key={idx} style={{ marginBottom: 32 }}>
                        {m.partOfSpeech && <div style={{ marginBottom: 12 }}><span style={{ background: '#1d2a57', color: 'white', padding: '2px 8px', borderRadius: 4, fontStyle: 'italic', fontSize: '0.9em' }}>{m.partOfSpeech}</span></div>}
                        <div style={{ paddingLeft: 16, borderLeft: '3px solid #facc15' }}>
                          <p style={{ fontSize: '1.15em', color: '#1d2a57', fontWeight: 500, lineHeight: 1.5, marginBottom: 8 }}>{m.definition}</p>
                          {m.example && <p style={{ color: '#4b5563', fontStyle: 'italic', fontSize: '1.05em', borderLeft: '2px solid #e5e7eb', paddingLeft: 12, marginTop: 8 }}>"{m.example}"</p>}
                        </div>
                      </div>
                    ))}
                    {selectedWord.synonyms?.length > 0 && (
                      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px dotted #e5e7eb' }}>
                        <h4 style={{ fontSize: '0.9em', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', marginBottom: 12 }}>Từ đồng nghĩa</h4>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {selectedWord.synonyms.map((s, i) => (
                            <span key={i} onClick={() => setQuery(s)} style={{ padding: '4px 12px', background: '#f1f5f9', color: '#0f172a', borderRadius: 16, fontSize: '0.9em', fontWeight: 500, border: '1px solid #cbd5e1', cursor: 'pointer' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Save Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 400, padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Lưu "{selectedWord?.Word}"</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            {collections.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Chọn bộ sưu tập:</p>
                {collections.map(c => (
                  <button key={c.Id} onClick={() => handleSaveToCollection(c.Id)} disabled={savingCollection} className="btn w-full text-left" style={{ justifyContent: 'flex-start', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}>
                    <FiBookmark /> {c.Name} <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{c.WordCount || 0} từ</span>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>Bạn chưa có bộ sưu tập nào.</p>
                <a href="/collections" className="btn btn-primary no-underline"><FiPlus /> Tạo bộ sưu tập</a>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Dictionary;
