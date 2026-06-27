// ============================================
// Vocabulary Page - My Decks + Public Decks
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiEdit2,
  FiGlobe,
  FiPlus,
  FiSearch,
  FiSend,
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

const emptyDeckForm = { name: '', description: '' };
const emptyWordForm = { customWord: '', customMeaning: '', customExample: '' };
const DECKS_PER_PAGE = 6;
const getData = (res, fallback) => res?.data ?? fallback;
const getErrorMessage = (err, fallback) => err?.message || err?.response?.data?.message || fallback;
const isSubmissionsRouteMissing = (err) => {
  const message = err?.response?.data?.message || err?.message || '';
  return err?.response?.status === 404 && /collections\/submissions/i.test(message);
};

function normalizeWord(item = {}) {
  return {
    id: item.Id || item.id,
    word: item.CustomWord || item.customword || item.word || '',
    meaning: item.CustomMeaning || item.custommeaning || item.meaning || '',
    example: item.CustomExample || item.customexample || item.example || ''
  };
}

function statusLabel(status) {
  if (status === 'draft') return 'Bản nháp';
  if (status === 'pending') return 'Chờ duyệt';
  if (status === 'rejected') return 'Bị từ chối';
  return 'Đã duyệt';
}

function Vocabulary() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('mine');
  const [myDecks, setMyDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [submissionDecks, setSubmissionDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [practiceMode, setPracticeMode] = useState(false);
  const [submissionsUnavailable, setSubmissionsUnavailable] = useState(false);
  const [deckSearch, setDeckSearch] = useState('');
  const [deckPage, setDeckPage] = useState(1);

  const [showDeckModal, setShowDeckModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckForm, setDeckForm] = useState(emptyDeckForm);

  const [showWordModal, setShowWordModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [wordForm, setWordForm] = useState(emptyWordForm);

  const visibleDecks = activeTab === 'mine' ? myDecks : activeTab === 'submissions' ? submissionDecks : publicDecks;
  const filteredDecks = useMemo(() => {
    const keyword = deckSearch.trim().toLowerCase();
    if (!keyword) return visibleDecks;

    return visibleDecks.filter((deck) => {
      const searchable = [
        deck.Name,
        deck.Description,
        deck.CreatorName,
        deck.ReviewStatus,
        statusLabel(deck.ReviewStatus)
      ].filter(Boolean).join(' ').toLowerCase();
      return searchable.includes(keyword);
    });
  }, [deckSearch, visibleDecks]);
  const totalDeckPages = Math.max(1, Math.ceil(filteredDecks.length / DECKS_PER_PAGE));
  const safeDeckPage = Math.min(deckPage, totalDeckPages);
  const paginatedDecks = filteredDecks.slice((safeDeckPage - 1) * DECKS_PER_PAGE, safeDeckPage * DECKS_PER_PAGE);
  const deckStart = filteredDecks.length === 0 ? 0 : (safeDeckPage - 1) * DECKS_PER_PAGE + 1;
  const deckEnd = Math.min(filteredDecks.length, safeDeckPage * DECKS_PER_PAGE);
  const editable = (activeTab === 'mine' || activeTab === 'submissions') && selectedDeck?.UserId === user?.id;
  const vocabularyItems = useMemo(() => words.map(normalizeWord).filter((item) => item.word && item.meaning), [words]);

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    setSelectedDeck(null);
    setWords([]);
    setPracticeMode(false);
    setDeckSearch('');
    setDeckPage(1);
  }, [activeTab]);

  useEffect(() => {
    setDeckPage(1);
  }, [deckSearch]);

  useEffect(() => {
    if (deckPage > totalDeckPages) setDeckPage(totalDeckPages);
  }, [deckPage, totalDeckPages]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [mineRes, publicRes] = await Promise.all([
        collectionApi.getMyCollections(),
        collectionApi.getPublicCollections()
      ]);
      setMyDecks(getData(mineRes, []));
      setPublicDecks(getData(publicRes, []));

      try {
        const submissionsRes = await collectionApi.getMyPublicSubmissions();
        setSubmissionDecks(getData(submissionsRes, []));
        setSubmissionsUnavailable(false);
      } catch (submissionErr) {
        if (!isSubmissionsRouteMissing(submissionErr)) throw submissionErr;
        setSubmissionDecks([]);
        setSubmissionsUnavailable(true);
      }
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
      description: deck.Description || ''
    });
    setShowDeckModal(true);
  };

  const saveDeck = async (event) => {
    event.preventDefault();
    if (!deckForm.name.trim()) return toast.error('Nhập tên học phần.');

    try {
      if (editingDeck) {
        if (activeTab === 'submissions') {
          await collectionApi.updatePublicSubmission(editingDeck.Id, deckForm);
          toast.success('Đã lưu bản nháp học phần công khai.');
        } else {
          await collectionApi.updateCollection(editingDeck.Id, deckForm);
          toast.success('Đã cập nhật học phần.');
        }
      } else {
        if (activeTab === 'submissions') {
          await collectionApi.createPublicSubmission(deckForm);
          toast.success('Đã tạo bản nháp học phần công khai. Thêm từ rồi gửi duyệt khi sẵn sàng.');
        } else {
          await collectionApi.createCollection(deckForm);
          toast.success('Đã tạo học phần.');
        }
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
      if (activeTab === 'submissions') {
        await collectionApi.deletePublicSubmission(deck.Id);
      } else {
        await collectionApi.deleteCollection(deck.Id);
      }
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
        toast.success(activeTab === 'submissions' ? 'Đã sửa từ, học phần trở về bản nháp.' : 'Đã sửa từ.');
      } else {
        await collectionApi.addWord(selectedDeck.Id, wordForm);
        toast.success(activeTab === 'submissions' ? 'Đã thêm từ vào bản nháp học phần công khai.' : 'Đã thêm từ.');
      }
      setShowWordModal(false);
      setEditingWord(null);
      setWordForm(emptyWordForm);
      if (activeTab === 'submissions') setSelectedDeck({ ...selectedDeck, ReviewStatus: 'draft' });
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
      toast.success(activeTab === 'submissions' ? 'Đã xóa từ, học phần trở về bản nháp.' : 'Đã xóa từ.');
      if (activeTab === 'submissions') setSelectedDeck({ ...selectedDeck, ReviewStatus: 'draft' });
      await loadWords(selectedDeck);
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không xóa được từ.'));
    }
  };

  const submitForReview = async () => {
    if (!selectedDeck) return;
    try {
      await collectionApi.submitPublicSubmission(selectedDeck.Id);
      toast.success('Đã gửi học phần công khai để admin duyệt.');
      setSelectedDeck({ ...selectedDeck, ReviewStatus: 'pending' });
      await loadAll();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không gửi duyệt được học phần.'));
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
        {(activeTab === 'mine' || activeTab === 'submissions') && (
          <button type="button" className="btn btn-primary" disabled={activeTab === 'submissions' && submissionsUnavailable} onClick={openCreateDeck}>
            <FiPlus /> {activeTab === 'submissions' ? 'Gửi học phần công khai' : 'Tạo học phần'}
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
        <button type="button" className={`btn ${activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('submissions')}>
          <FiGlobe /> Bài công khai của tôi
        </button>
      </div>

      {activeTab === 'submissions' && submissionsUnavailable && (
        <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: '#fee2e2', color: '#991b1b', marginBottom: 'var(--space-4)' }}>
          Server chưa có route gửi học phần công khai. Vui lòng deploy lại backend để dùng tính năng này.
        </div>
      )}

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
                {activeTab === 'submissions' && ['draft', 'rejected'].includes(selectedDeck.ReviewStatus) && (
                  <button type="button" className="btn btn-primary btn-sm" disabled={vocabularyItems.length === 0} onClick={submitForReview}>
                    <FiSend /> Gửi duyệt
                  </button>
                )}
                <button type="button" className="btn btn-primary btn-sm" disabled={vocabularyItems.length === 0} onClick={() => setPracticeMode(true)}>
                  <FiCheckCircle /> Ôn luyện
                </button>
              </div>
            </div>

            {activeTab === 'submissions' && selectedDeck.ReviewStatus === 'draft' && (
              <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: '#fef3c7', color: '#92400e', marginBottom: 'var(--space-4)' }}>
                Đây là bản nháp. Thêm đầy đủ từ vựng rồi bấm Gửi duyệt để admin xét duyệt.
              </div>
            )}

            {activeTab === 'submissions' && selectedDeck.ReviewStatus === 'pending' && (
              <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: '#dbeafe', color: '#1e40af', marginBottom: 'var(--space-4)' }}>
                Học phần đang chờ admin duyệt. Nếu chỉnh sửa, học phần sẽ trở về bản nháp.
              </div>
            )}

            {activeTab === 'submissions' && selectedDeck.ReviewStatus === 'rejected' && (
              <div style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', background: '#fee2e2', color: '#991b1b', marginBottom: 'var(--space-4)' }}>
                Học phần đã bị từ chối. Chỉnh sửa nội dung rồi gửi duyệt lại.
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
          <div className="vocabulary-list-tools">
            <label className="vocabulary-search">
              <FiSearch />
              <input
                value={deckSearch}
                onChange={(event) => setDeckSearch(event.target.value)}
                placeholder="Tìm học phần, mô tả hoặc tác giả"
              />
            </label>
            <div className="vocabulary-result-count">
              {filteredDecks.length === visibleDecks.length
                ? `${visibleDecks.length} học phần`
                : `${filteredDecks.length}/${visibleDecks.length} học phần`}
            </div>
          </div>

          {visibleDecks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
              {activeTab === 'mine'
                ? 'Chưa có học phần từ vựng.'
                : activeTab === 'submissions'
                  ? 'Chưa có học phần công khai nào đang gửi duyệt.'
                  : 'Chưa có học phần công khai nào.'}
            </div>
          ) : filteredDecks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
              Không tìm thấy học phần phù hợp.
            </div>
          ) : (
            <>
            <div className="vocabulary-deck-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
              {paginatedDecks.map((deck, index) => (
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
                      {activeTab === 'public' && <span className="badge badge-secondary"><FiGlobe /> Công khai</span>}
                      {activeTab === 'submissions' && <span className="badge badge-secondary">{statusLabel(deck.ReviewStatus)}</span>}
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{deck.Description}</p>
                    {deck.CreatorName && activeTab === 'public' && (
                      <small style={{ color: 'var(--color-text-muted)' }}>Tác giả: {deck.CreatorName}</small>
                    )}
                  </div>
                  {(activeTab === 'mine' || activeTab === 'submissions') && (
                    <div style={{ display: 'flex', gap: 4 }} onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="btn btn-icon btn-ghost" onClick={(event) => openEditDeck(deck, event)}><FiEdit2 /></button>
                      <button type="button" className="btn btn-icon btn-ghost" onClick={(event) => deleteDeck(deck, event)} style={{ color: 'var(--color-error)' }}><FiTrash2 /></button>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>

            <div className="vocabulary-pagination">
              <span>Hiển thị {deckStart}-{deckEnd} / {filteredDecks.length}</span>
              <div>
                <button type="button" className="btn btn-secondary btn-sm" disabled={safeDeckPage <= 1} onClick={() => setDeckPage((page) => Math.max(1, page - 1))}>
                  <FiChevronLeft /> Trước
                </button>
                <strong>Trang {safeDeckPage}/{totalDeckPages}</strong>
                <button type="button" className="btn btn-secondary btn-sm" disabled={safeDeckPage >= totalDeckPages} onClick={() => setDeckPage((page) => Math.min(totalDeckPages, page + 1))}>
                  Sau <FiChevronRight />
                </button>
              </div>
            </div>
            </>
          )}
        </section>
      )}

      {showDeckModal && (
        <Modal
          title={editingDeck ? 'Sửa học phần' : activeTab === 'submissions' ? 'Gửi học phần công khai' : 'Tạo học phần'}
          onClose={() => setShowDeckModal(false)}
        >
          <form onSubmit={saveDeck}>
            <label className="form-group">
              <span className="form-label">Tên học phần</span>
              <input className="form-input" value={deckForm.name} onChange={(e) => setDeckForm({ ...deckForm, name: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Mô tả</span>
              <input className="form-input" value={deckForm.description} onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })} />
            </label>
            {activeTab === 'submissions' && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-3)' }}>
                Học phần này được tạo riêng để gửi công khai và sẽ cần admin duyệt trước khi hiển thị cho người khác.
              </p>
            )}
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
