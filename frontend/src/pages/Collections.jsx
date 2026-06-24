// ============================================
// Vocabulary Page - My Decks + Public Decks
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiEdit2,
  FiGlobe,
  FiLock,
  FiPlus,
  FiTrash2,
  FiVolume2,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { collectionApi } from '../api/collectionApi';
import Loading from '../components/common/Loading';
import VocabularyGate from '../components/common/VocabularyGate';
import { speakText } from '../utils/audioControl';
import { useAuth } from '../hooks/useAuth';

const emptyDeckForm = { name: '', description: '', isPublic: false };
const emptyWordForm = { customWord: '', customMeaning: '', customExample: '' };
const getData = (res, fallback) => res?.data ?? fallback;
const getErrorMessage = (err, fallback) => err?.message || err?.response?.data?.message || fallback;

function normalizeWord(item = {}) {
  return {
    id: item.Id || item.id,
    word: item.CustomWord || item.customword || item.word || '',
    meaning: item.CustomMeaning || item.custommeaning || item.meaning || '',
    example: item.CustomExample || item.customexample || item.example || ''
  };
}

function statusLabel(status) {
  if (status === 'pending') return 'Chờ duyệt';
  if (status === 'rejected') return 'Bị từ chối';
  return 'Đã duyệt';
}

function Vocabulary() {
  const { user } = useAuth();
  const isPlus = Boolean(user?.isPlus || user?.plan === 'plus');
  const [activeTab, setActiveTab] = useState('mine');
  const [myDecks, setMyDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [practiceMode, setPracticeMode] = useState(false);

  const [showDeckModal, setShowDeckModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckForm, setDeckForm] = useState(emptyDeckForm);

  const [showWordModal, setShowWordModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [wordForm, setWordForm] = useState(emptyWordForm);

  const visibleDecks = activeTab === 'mine' ? myDecks : publicDecks;
  const editable = activeTab === 'mine' && selectedDeck?.UserId === user?.id;
  const vocabularyItems = useMemo(() => words.map(normalizeWord).filter((item) => item.word && item.meaning), [words]);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setSelectedDeck(null);
    setWords([]);
    setPracticeMode(false);
  }, [activeTab]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [mineRes, publicRes] = await Promise.all([
        collectionApi.getMyCollections(),
        collectionApi.getPublicCollections()
      ]);
      setMyDecks(getData(mineRes, []));
      setPublicDecks(getData(publicRes, []));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được từ vựng.'));
    } finally {
      setLoading(false);
    }
  };

  const loadWords = async (deck) => {
    setSelectedDeck(deck);
    setWords([]);
    setPracticeMode(false);
    try {
      const res = await collectionApi.getWords(deck.Id);
      setWords(getData(res, []));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được từ vựng.'));
    }
  };

  const openCreateDeck = () => {
    setEditingDeck(null);
    setDeckForm(emptyDeckForm);
    setShowDeckModal(true);
  };

  const openEditDeck = (deck, event) => {
    event.stopPropagation();
    setEditingDeck(deck);
    setDeckForm({
      name: deck.Name || '',
      description: deck.Description || '',
      isPublic: Boolean(deck.IsPublic)
    });
    setShowDeckModal(true);
  };

  const saveDeck = async (event) => {
    event.preventDefault();
    if (!deckForm.name.trim()) return toast.error('Nhập tên học phần.');
    if (deckForm.isPublic && !isPlus) return toast.error('Tạo học phần công khai là tính năng Plus.');

    try {
      if (editingDeck) {
        await collectionApi.updateCollection(editingDeck.Id, deckForm);
        toast.success(deckForm.isPublic ? 'Đã gửi lại để admin duyệt.' : 'Đã cập nhật học phần.');
      } else {
        await collectionApi.createCollection(deckForm);
        toast.success(deckForm.isPublic ? 'Đã tạo học phần công khai, đang chờ duyệt.' : 'Đã tạo học phần.');
      }
      setShowDeckModal(false);
      setDeckForm(emptyDeckForm);
      setEditingDeck(null);
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không lưu được học phần.'));
    }
  };

  const deleteDeck = async (deck, event) => {
    event.stopPropagation();
    if (!window.confirm('Xóa học phần này và toàn bộ từ vựng?')) return;
    try {
      await collectionApi.deleteCollection(deck.Id);
      toast.success('Đã xóa học phần.');
      if (selectedDeck?.Id === deck.Id) {
        setSelectedDeck(null);
        setWords([]);
      }
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không xóa được học phần.'));
    }
  };

  const openAddWord = () => {
    setEditingWord(null);
    setWordForm(emptyWordForm);
    setShowWordModal(true);
  };

  const openEditWord = (word) => {
    setEditingWord(word);
    setWordForm({
      customWord: word.CustomWord || '',
      customMeaning: word.CustomMeaning || '',
      customExample: word.CustomExample || ''
    });
    setShowWordModal(true);
  };

  const saveWord = async (event) => {
    event.preventDefault();
    if (!selectedDeck) return;
    if (!wordForm.customWord.trim() || !wordForm.customMeaning.trim()) {
      return toast.error('Nhập từ và nghĩa.');
    }

    try {
      if (editingWord) {
        await collectionApi.updateWord(selectedDeck.Id, editingWord.Id, wordForm);
        toast.success(Boolean(selectedDeck.IsPublic) ? 'Đã sửa từ, học phần chờ duyệt lại.' : 'Đã sửa từ.');
      } else {
        await collectionApi.addWord(selectedDeck.Id, wordForm);
        toast.success(Boolean(selectedDeck.IsPublic) ? 'Đã thêm từ, học phần chờ duyệt lại.' : 'Đã thêm từ.');
      }
      setShowWordModal(false);
      setEditingWord(null);
      setWordForm(emptyWordForm);
      if (selectedDeck.IsPublic) setSelectedDeck({ ...selectedDeck, ReviewStatus: 'pending' });
      await loadWords(selectedDeck);
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không lưu được từ.'));
    }
  };

  const removeWord = async (wordId) => {
    if (!selectedDeck || !window.confirm('Xóa từ này?')) return;
    try {
      await collectionApi.removeWord(selectedDeck.Id, wordId);
      toast.success(Boolean(selectedDeck.IsPublic) ? 'Đã xóa từ, học phần chờ duyệt lại.' : 'Đã xóa từ.');
      if (selectedDeck.IsPublic) setSelectedDeck({ ...selectedDeck, ReviewStatus: 'pending' });
      await loadWords(selectedDeck);
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không xóa được từ.'));
    }
  };

  const speakWord = (word) => {
    speakText(word, { lang: 'en-US', rate: 0.92 });
  };

  if (loading) return <Loading />;
  if (practiceMode) {
    return (
      <VocabularyGate
        items={vocabularyItems}
        title={selectedDeck?.Name || 'Từ vựng'}
        skillLabel="Từ vựng"
        gateKey={`vocabulary-${selectedDeck?.Id}`}
        allowStudy={false}
        oneByOne={true}
        passMessage="Đã hoàn thành ôn từ vựng."
        continueLabel="Tiếp tục học bài khác"
        onPassed={() => {
          setPracticeMode(false);
          setSelectedDeck(null);
          setWords([]);
        }}
        onExit={() => setPracticeMode(false)}
      />
    );
  }

  return (
    <div className="vocabulary-page">
      <div className="page-header flex-between vocabulary-header" style={{ alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div>
          <h1>Từ vựng</h1>
        </div>
        {activeTab === 'mine' && (
          <button type="button" className="btn btn-primary" onClick={openCreateDeck}>
            <FiPlus /> Tạo học phần
          </button>
        )}
      </div>

      <div className="vocabulary-tabs" style={{ display: 'flex', gap: 'var(--space-2)', marginTop: '-4px', marginBottom: 'var(--space-5)' }}>
        <button type="button" className={`btn ${activeTab === 'mine' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('mine')}>
          <FiBookOpen /> Học phần của tôi
        </button>
        <button type="button" className={`btn ${activeTab === 'public' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('public')}>
          <FiGlobe /> Học phần công khai
        </button>
      </div>

      {selectedDeck ? (
        <section>
          <div className="card vocabulary-detail-card">
            <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedDeck(null);
                    setWords([]);
                    setPracticeMode(false);
                  }}
                  style={{ marginBottom: 'var(--space-3)' }}
                >
                  <FiArrowLeft /> Học phần
                </button>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{selectedDeck.Name}</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>{selectedDeck.Description}</p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {editable && (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={openAddWord}>
                    <FiPlus /> Thêm từ
                  </button>
                )}
                <button type="button" className="btn btn-primary btn-sm" disabled={vocabularyItems.length === 0} onClick={() => setPracticeMode(true)}>
                  <FiCheckCircle /> Ôn luyện
                </button>
              </div>
            </div>

            {selectedDeck.IsPublic && selectedDeck.ReviewStatus !== 'approved' && activeTab === 'mine' && (
              <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: '#fef3c7', color: '#92400e', marginBottom: 'var(--space-4)' }}>
                Học phần công khai chỉ hiển thị cho người khác sau khi admin duyệt.
              </div>
            )}

            {words.length === 0 ? (
              <div className="vocabulary-empty" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
                Học phần này chưa có từ vựng.
              </div>
            ) : (
              <div className="vocabulary-word-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
                {words.map((raw) => {
                  const item = normalizeWord(raw);
                  return (
                    <article key={item.id} className="vocabulary-word-card" style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-secondary)' }}>
                      <div className="flex-between" style={{ gap: 8, alignItems: 'flex-start' }}>
                        <button type="button" onClick={() => speakWord(item.word)} className="btn btn-icon btn-ghost" aria-label={`Nghe ${item.word}`}>
                          <FiVolume2 />
                        </button>
                        {editable && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button type="button" className="btn btn-icon btn-ghost" onClick={() => openEditWord(raw)}><FiEdit2 /></button>
                            <button type="button" className="btn btn-icon btn-ghost" onClick={() => removeWord(item.id)} style={{ color: 'var(--color-error)' }}><FiTrash2 /></button>
                          </div>
                        )}
                      </div>
                      <strong style={{ display: 'block', color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)', marginTop: 8 }}>{item.word}</strong>
                      <p style={{ color: 'var(--color-text-secondary)', marginTop: 6 }}>{item.meaning}</p>
                      {item.example && <small style={{ display: 'block', color: 'var(--color-text-muted)', marginTop: 8, fontStyle: 'italic' }}>"{item.example}"</small>}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section>
          {visibleDecks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
              {activeTab === 'mine' ? 'Chưa có học phần từ vựng.' : ''}
            </div>
          ) : (
            <div className="vocabulary-deck-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
              {visibleDecks.map((deck, index) => (
                <motion.article
                  key={deck.Id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="card vocabulary-deck-card"
                  onClick={() => loadWords(deck)}
                  style={{
                    cursor: 'pointer',
                    border: selectedDeck?.Id === deck.Id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)'
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: 800, marginBottom: 6 }}>{deck.Name}</h3>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span className="badge badge-primary">{Number(deck.WordCount || 0)} từ</span>
                      {deck.IsPublic && <span className="badge badge-secondary"><FiGlobe /> Công khai</span>}
                      {activeTab === 'mine' && deck.IsPublic && <span className="badge badge-secondary">{statusLabel(deck.ReviewStatus)}</span>}
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{deck.Description}</p>
                    {deck.CreatorName && activeTab === 'public' && (
                      <small style={{ color: 'var(--color-text-muted)' }}>Tác giả: {deck.CreatorName}</small>
                    )}
                  </div>
                  {activeTab === 'mine' && (
                    <div style={{ display: 'flex', gap: 4 }} onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="btn btn-icon btn-ghost" onClick={(event) => openEditDeck(deck, event)}><FiEdit2 /></button>
                      <button type="button" className="btn btn-icon btn-ghost" onClick={(event) => deleteDeck(deck, event)} style={{ color: 'var(--color-error)' }}><FiTrash2 /></button>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </section>
      )}

      {showDeckModal && (
        <Modal title={editingDeck ? 'Sửa học phần' : 'Tạo học phần'} onClose={() => setShowDeckModal(false)}>
          <form onSubmit={saveDeck}>
            <label className="form-group">
              <span className="form-label">Tên học phần</span>
              <input className="form-input" value={deckForm.name} onChange={(e) => setDeckForm({ ...deckForm, name: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Mô tả</span>
              <input className="form-input" value={deckForm.description} onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'var(--space-3)', color: !isPlus ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
              <input
                type="checkbox"
                checked={deckForm.isPublic}
                disabled={!isPlus}
                onChange={(e) => setDeckForm({ ...deckForm, isPublic: e.target.checked })}
              />
              <span>Đăng công khai {isPlus ? '(cần admin duyệt)' : '(Plus)'}</span>
              {!isPlus && <FiLock />}
            </label>
            <div className="flex gap-2" style={{ marginTop: 'var(--space-5)' }}>
              <button type="button" className="btn btn-secondary w-full" onClick={() => setShowDeckModal(false)}>Hủy</button>
              <button type="submit" className="btn btn-primary w-full">Lưu</button>
            </div>
          </form>
        </Modal>
      )}

      {showWordModal && (
        <Modal title={editingWord ? 'Sửa từ vựng' : 'Thêm từ vựng'} onClose={() => setShowWordModal(false)}>
          <form onSubmit={saveWord}>
            <label className="form-group">
              <span className="form-label">Từ / cụm từ</span>
              <input className="form-input" value={wordForm.customWord} onChange={(e) => setWordForm({ ...wordForm, customWord: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Nghĩa tiếng Việt</span>
              <input className="form-input" value={wordForm.customMeaning} onChange={(e) => setWordForm({ ...wordForm, customMeaning: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Ví dụ</span>
              <input className="form-input" value={wordForm.customExample} onChange={(e) => setWordForm({ ...wordForm, customExample: e.target.value })} />
            </label>
            <div className="flex gap-2" style={{ marginTop: 'var(--space-5)' }}>
              <button type="button" className="btn btn-secondary w-full" onClick={() => setShowWordModal(false)}>Hủy</button>
              <button type="submit" className="btn btn-primary w-full">Lưu</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: 'min(480px, 100%)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{title}</h3>
          <button type="button" className="btn btn-icon btn-ghost" onClick={onClose}><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Vocabulary;
