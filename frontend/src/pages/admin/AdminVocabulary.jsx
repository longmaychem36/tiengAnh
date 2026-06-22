import { useEffect, useState } from 'react';
import { FiCheck, FiEdit2, FiGlobe, FiPlus, FiRefreshCw, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

const emptyDeck = { Name: '', Description: '' };
const emptyWord = { CustomWord: '', CustomMeaning: '', CustomExample: '' };
const getData = (res, fallback) => res?.data ?? fallback;
const getErrorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;
const isAdminCreatedDeck = (deck) => String(deck?.CreatorRole || '').toLowerCase() === 'admin';

function AdminVocabulary() {
  const [status, setStatus] = useState('pending');
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeckForm, setShowDeckForm] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckForm, setDeckForm] = useState(emptyDeck);

  const [showWordForm, setShowWordForm] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [wordForm, setWordForm] = useState(emptyWord);
  const canManageSelectedWords = isAdminCreatedDeck(selected);

  useEffect(() => {
    loadCollections();
  }, [status]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getVocabularyCollections(status);
      setCollections(getData(res, []));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được Vocabulary.'));
    } finally {
      setLoading(false);
    }
  };

  const loadWords = async (deck) => {
    setSelected(deck);
    setWords([]);
    try {
      const res = await adminApi.getVocabularyWords(deck.Id);
      setWords(getData(res, []));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được từ vựng.'));
    }
  };

  const openCreateDeck = () => {
    setEditingDeck(null);
    setDeckForm(emptyDeck);
    setShowDeckForm(true);
  };

  const openEditDeck = (deck) => {
    setEditingDeck(deck);
    setDeckForm({ Name: deck.Name || '', Description: deck.Description || '' });
    setShowDeckForm(true);
  };

  const saveDeck = async (event) => {
    event.preventDefault();
    if (!deckForm.Name.trim()) return toast.error('Nhập tên học phần.');
    try {
      if (editingDeck) {
        await adminApi.updateVocabularyCollection(editingDeck.Id, deckForm);
        toast.success('Đã cập nhật học phần.');
      } else {
        await adminApi.createVocabularyCollection(deckForm);
        toast.success('Đã tạo học phần public bằng tài khoản admin.');
      }
      setShowDeckForm(false);
      setEditingDeck(null);
      setDeckForm(emptyDeck);
      await loadCollections();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không lưu được học phần.'));
    }
  };

  const reviewDeck = async (deck, nextStatus) => {
    try {
      await adminApi.reviewVocabularyCollection(deck.Id, nextStatus);
      toast.success(nextStatus === 'approved' ? 'Đã duyệt học phần.' : 'Đã từ chối học phần.');
      if (selected?.Id === deck.Id) setSelected({ ...selected, ReviewStatus: nextStatus });
      await loadCollections();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không cập nhật trạng thái.'));
    }
  };

  const deleteDeck = async (deck) => {
    if (!window.confirm('Xóa học phần public này?')) return;
    try {
      await adminApi.deleteVocabularyCollection(deck.Id);
      toast.success('Đã xóa học phần.');
      if (selected?.Id === deck.Id) {
        setSelected(null);
        setWords([]);
      }
      await loadCollections();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không xóa được học phần.'));
    }
  };

  const openAddWord = () => {
    if (!canManageSelectedWords) {
      toast.error('Admin chỉ được quản lý từ vựng của học phần do admin tạo.');
      return;
    }
    setEditingWord(null);
    setWordForm(emptyWord);
    setShowWordForm(true);
  };

  const openEditWord = (word) => {
    if (!canManageSelectedWords) {
      toast.error('Admin chỉ được quản lý từ vựng của học phần do admin tạo.');
      return;
    }
    setEditingWord(word);
    setWordForm({
      CustomWord: word.CustomWord || '',
      CustomMeaning: word.CustomMeaning || '',
      CustomExample: word.CustomExample || ''
    });
    setShowWordForm(true);
  };

  const saveWord = async (event) => {
    event.preventDefault();
    if (!selected) return;
    if (!canManageSelectedWords) return toast.error('Admin chỉ được quản lý từ vựng của học phần do admin tạo.');
    if (!wordForm.CustomWord.trim() || !wordForm.CustomMeaning.trim()) return toast.error('Nhập từ và nghĩa.');
    try {
      if (editingWord) {
        await adminApi.updateVocabularyWord(editingWord.Id, wordForm);
        toast.success('Đã cập nhật từ.');
      } else {
        await adminApi.createVocabularyWord(selected.Id, wordForm);
        toast.success('Đã thêm từ.');
      }
      setShowWordForm(false);
      setEditingWord(null);
      setWordForm(emptyWord);
      await loadWords(selected);
      await loadCollections();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không lưu được từ.'));
    }
  };

  const deleteWord = async (word) => {
    if (!canManageSelectedWords) {
      toast.error('Admin chỉ được quản lý từ vựng của học phần do admin tạo.');
      return;
    }
    if (!window.confirm('Xóa từ này?')) return;
    try {
      await adminApi.deleteVocabularyWord(word.Id);
      toast.success('Đã xóa từ.');
      await loadWords(selected);
      await loadCollections();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không xóa được từ.'));
    }
  };

  return (
    <div className="fade-in" style={{ padding: 'var(--space-6)' }}>
      <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>Vocabulary Public</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Duyệt học phần public và tạo học phần từ vựng bằng tài khoản admin.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button type="button" className="btn btn-secondary" onClick={loadCollections}><FiRefreshCw /> Tải lại</button>
          <button type="button" className="btn btn-primary" onClick={openCreateDeck}><FiPlus /> Tạo học phần</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {['pending', 'approved', 'rejected', 'all'].map((item) => (
          <button key={item} type="button" className={`btn ${status === item ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatus(item)}>
            {item === 'all' ? 'Tất cả' : item}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 0.95fr) minmax(0, 1.45fr)', gap: 'var(--space-6)' }}>
        <section style={{ display: 'grid', gap: 'var(--space-3)', alignContent: 'start' }}>
          {loading && <div className="card">Đang tải...</div>}
          {!loading && collections.length === 0 && <div className="card">Không có học phần nào.</div>}
          {collections.map((deck) => (
            <article
              key={deck.Id}
              className="card"
              onClick={() => loadWords(deck)}
              style={{
                cursor: 'pointer',
                padding: 'var(--space-4)',
                border: selected?.Id === deck.Id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
              }}
            >
              <div className="flex-between" style={{ alignItems: 'flex-start', gap: 10 }}>
                <div>
                  <h3 style={{ fontWeight: 800 }}>{deck.Name}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{deck.Description}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    <span className="badge badge-primary"><FiGlobe /> {deck.ReviewStatus}</span>
                    <span className="badge badge-secondary">{Number(deck.WordCount || 0)} từ</span>
                    <span className="badge badge-secondary">{deck.CreatorName || 'Admin'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }} onClick={(event) => event.stopPropagation()}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEditDeck(deck)}>Sửa</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteDeck(deck)} style={{ color: 'var(--color-error)' }}>Xóa</button>
                </div>
              </div>
              {deck.ReviewStatus === 'pending' && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }} onClick={(event) => event.stopPropagation()}>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => reviewDeck(deck, 'approved')}><FiCheck /> Duyệt</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => reviewDeck(deck, 'rejected')}><FiX /> Từ chối</button>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="card">
          {selected ? (
            <>
              <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{selected.Name}</h2>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{selected.Description}</p>
                </div>
                {canManageSelectedWords && (
                  <button type="button" className="btn btn-primary btn-sm" onClick={openAddWord}><FiPlus /> Thêm từ</button>
                )}
              </div>

              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {words.map((word) => (
                  <div key={word.Id} style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-secondary)' }}>
                    <div className="flex-between" style={{ alignItems: 'flex-start', gap: 10 }}>
                      <div>
                        <strong style={{ color: 'var(--color-primary)' }}>{word.CustomWord}</strong>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>{word.CustomMeaning}</p>
                        {word.CustomExample && <small style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>"{word.CustomExample}"</small>}
                      </div>
                      {canManageSelectedWords && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEditWord(word)}>Sửa</button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteWord(word)} style={{ color: 'var(--color-error)' }}>Xóa</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {words.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>Chưa có từ vựng.</div>}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-10)' }}>
              Chọn học phần để xem và quản lý từ.
            </div>
          )}
        </section>
      </div>

      {showDeckForm && (
        <Modal title={editingDeck ? 'Sửa học phần' : 'Tạo học phần public'} onClose={() => setShowDeckForm(false)}>
          <form onSubmit={saveDeck}>
            <label className="form-group">
              <span className="form-label">Tên học phần</span>
              <input className="form-input" value={deckForm.Name} onChange={(e) => setDeckForm({ ...deckForm, Name: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Mô tả</span>
              <input className="form-input" value={deckForm.Description} onChange={(e) => setDeckForm({ ...deckForm, Description: e.target.value })} />
            </label>
            <div className="flex gap-2" style={{ marginTop: 'var(--space-5)' }}>
              <button type="button" className="btn btn-secondary w-full" onClick={() => setShowDeckForm(false)}>Hủy</button>
              <button type="submit" className="btn btn-primary w-full">Lưu</button>
            </div>
          </form>
        </Modal>
      )}

      {showWordForm && (
        <Modal title={editingWord ? 'Sửa từ' : 'Thêm từ'} onClose={() => setShowWordForm(false)}>
          <form onSubmit={saveWord}>
            <label className="form-group">
              <span className="form-label">Từ / cụm từ</span>
              <input className="form-input" value={wordForm.CustomWord} onChange={(e) => setWordForm({ ...wordForm, CustomWord: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Nghĩa</span>
              <input className="form-input" value={wordForm.CustomMeaning} onChange={(e) => setWordForm({ ...wordForm, CustomMeaning: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Ví dụ</span>
              <input className="form-input" value={wordForm.CustomExample} onChange={(e) => setWordForm({ ...wordForm, CustomExample: e.target.value })} />
            </label>
            <div className="flex gap-2" style={{ marginTop: 'var(--space-5)' }}>
              <button type="button" className="btn btn-secondary w-full" onClick={() => setShowWordForm(false)}>Hủy</button>
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
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Đóng</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AdminVocabulary;
