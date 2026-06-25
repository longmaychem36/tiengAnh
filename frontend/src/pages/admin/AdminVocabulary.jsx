import { useEffect, useState } from 'react';
import { FiCheck, FiEdit2, FiGlobe, FiPlus, FiRefreshCw, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';

const emptyDeck = { Name: '', Description: '' };
const emptyWord = { CustomWord: '', CustomMeaning: '', CustomExample: '' };

const sourceOptions = [
  ['user', 'User gửi duyệt'],
  ['admin', 'Admin tạo'],
  ['all', 'Tất cả']
];

const statusOptions = [
  ['pending', 'Chờ duyệt'],
  ['approved', 'Đã duyệt'],
  ['rejected', 'Từ chối'],
  ['all', 'Tất cả']
];

const statusLabels = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối'
};

const getData = (res, fallback) => res?.data ?? fallback;
const getErrorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;
const isAdminCreatedDeck = (deck) => String(deck?.CreatorRole || '').toLowerCase() === 'admin';

function AdminVocabulary() {
  const [status, setStatus] = useState('pending');
  const [source, setSource] = useState('user');
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
  }, [status, source]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getVocabularyCollections(status, source);
      setCollections(getData(res, []));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không tải được học phần.'));
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
    if (!isAdminCreatedDeck(deck)) {
      toast.error('Bài user gửi chỉ được duyệt, từ chối hoặc xóa.');
      return;
    }
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
        toast.success('Đã tạo học phần.');
        setSource('admin');
        setStatus('approved');
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
      const res = await adminApi.reviewVocabularyCollection(deck.Id, nextStatus);
      const updatedDeck = getData(res, { ...deck, ReviewStatus: nextStatus });
      toast.success(nextStatus === 'approved' ? 'Đã duyệt học phần.' : 'Đã từ chối học phần.');
      if (selected?.Id === deck.Id) setSelected(updatedDeck);
      setCollections((prev) => {
        const shouldRemainInCurrentFilter = status === 'all' || status === nextStatus;
        if (!shouldRemainInCurrentFilter) return prev.filter((item) => item.Id !== deck.Id);
        return prev.map((item) => (item.Id === deck.Id ? updatedDeck : item));
      });
      await loadCollections();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Không cập nhật trạng thái.'));
    }
  };

  const deleteDeck = async (deck) => {
    if (!window.confirm('Xóa học phần này?')) return;
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
    <div className="fade-in admin-receptive-page">
      <div className="admin-receptive-header">
        <div>
          <h1>Vocabulary</h1>
        </div>
        <div className="admin-inline-actions">
          <button type="button" className="btn btn-secondary" onClick={loadCollections}><FiRefreshCw /> Tải lại</button>
          <button type="button" className="btn btn-primary" onClick={openCreateDeck}><FiPlus /> Tạo học phần</button>
        </div>
      </div>

      <div className="admin-inline-actions" style={{ marginBottom: 'var(--space-2)', justifyContent: 'flex-start' }}>
        {sourceOptions.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`btn ${source === value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setSource(value);
              if (value === 'admin' && status === 'pending') setStatus('approved');
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="admin-inline-actions" style={{ marginBottom: 'var(--space-2)', justifyContent: 'flex-start' }}>
        {statusOptions.map(([value, label]) => (
          <button key={value} type="button" className={`btn ${status === value ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatus(value)}>
            {label}
          </button>
        ))}
      </div>

      <div className="admin-dashboard-grid" style={{ gridTemplateColumns: 'minmax(300px, 0.95fr) minmax(0, 1.45fr)' }}>
        <section className="admin-receptive-list">
          {loading && <div className="admin-empty-inline">Đang tải...</div>}
          {!loading && collections.length === 0 && <div className="admin-empty-inline">Không có học phần nào.</div>}
          {collections.map((deck) => (
            <article
              key={deck.Id}
              className={`admin-receptive-card ${selected?.Id === deck.Id ? 'is-active' : ''}`}
              onClick={() => loadWords(deck)}
              style={{ cursor: 'pointer' }}
            >
              <div className="admin-receptive-card-head" style={{ border: 0 }}>
                <button type="button" className="admin-receptive-title" style={{ cursor: 'pointer' }}>
                  <div>
                    <strong>{deck.Name}</strong>
                    <span>{deck.Description}</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      <span className="badge badge-primary"><FiGlobe /> {statusLabels[deck.ReviewStatus] || deck.ReviewStatus}</span>
                      <span className="badge badge-secondary">{Number(deck.WordCount || 0)} từ</span>
                      <span className="badge badge-secondary">{isAdminCreatedDeck(deck) ? 'Admin tạo' : 'User gửi'}</span>
                      <span className="badge badge-secondary">{deck.CreatorName || 'Admin'}</span>
                    </div>
                  </div>
                </button>
                <div className="admin-inline-actions" onClick={(event) => event.stopPropagation()}>
                  {isAdminCreatedDeck(deck) && (
                    <button type="button" className="btn btn-icon btn-sm" title="Sửa" aria-label="Sửa học phần" onClick={() => openEditDeck(deck)}><FiEdit2 /></button>
                  )}
                  <button type="button" className="btn btn-icon btn-sm is-danger" title="Xóa" aria-label="Xóa học phần" onClick={() => deleteDeck(deck)}><FiTrash2 /></button>
                </div>
              </div>
              {!isAdminCreatedDeck(deck) && deck.ReviewStatus === 'pending' && (
                <div className="admin-form-actions" style={{ padding: '0 10px 10px', marginTop: 0 }} onClick={(event) => event.stopPropagation()}>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => reviewDeck(deck, 'approved')}><FiCheck /> Duyệt</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => reviewDeck(deck, 'rejected')}><FiX /> Từ chối</button>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="admin-subpanel" style={{ padding: '14px 16px' }}>
          {selected ? (
            <>
              <div className="admin-subpanel-head" style={{ margin: '-14px -16px var(--space-4) -16px' }}>
                <div>
                  <h3>{selected.Name}</h3>
                  {selected.Description && <p style={{ display: 'block', fontSize: '12px', color: 'var(--admin-muted)', marginTop: 4 }}>{selected.Description}</p>}
                </div>
                {canManageSelectedWords && (
                  <button type="button" className="btn btn-primary btn-sm" onClick={openAddWord}><FiPlus /> Thêm từ</button>
                )}
              </div>

              <div className="admin-item-list">
                {words.map((word) => (
                  <div key={word.Id} className="admin-list-item">
                    <div>
                      <strong style={{ color: 'var(--admin-primary)' }}>{word.CustomWord}</strong>
                      <p>{word.CustomMeaning}</p>
                      {word.CustomExample && <small style={{ color: 'var(--admin-muted)', fontStyle: 'italic' }}>"{word.CustomExample}"</small>}
                    </div>
                    {canManageSelectedWords && (
                      <div className="admin-inline-actions">
                        <button type="button" className="btn btn-icon btn-sm" title="Sửa" aria-label="Sửa từ" onClick={() => openEditWord(word)}><FiEdit2 /></button>
                        <button type="button" className="btn btn-icon btn-sm is-danger" title="Xóa" aria-label="Xóa từ" onClick={() => deleteWord(word)}><FiTrash2 /></button>
                      </div>
                    )}
                  </div>
                ))}
                {words.length === 0 && <div className="admin-empty-inline">Chưa có từ vựng.</div>}
              </div>
            </>
          ) : (
            <div className="admin-empty-inline" style={{ padding: 'var(--space-10)' }}>
              Chọn học phần để xem từ.
            </div>
          )}
        </section>
      </div>

      {showDeckForm && (
        <Modal title={editingDeck ? 'Sửa học phần' : 'Tạo học phần'} onClose={() => setShowDeckForm(false)}>
          <form onSubmit={saveDeck}>
            <label className="form-group">
              <span className="form-label">Tên học phần</span>
              <input className="form-input" value={deckForm.Name} onChange={(e) => setDeckForm({ ...deckForm, Name: e.target.value })} required />
            </label>
            <label className="form-group">
              <span className="form-label">Mô tả</span>
              <input className="form-input" value={deckForm.Description} onChange={(e) => setDeckForm({ ...deckForm, Description: e.target.value })} />
            </label>
            <div className="admin-form-actions" style={{ display: 'flex', gap: 8, marginTop: 'var(--space-5)' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowDeckForm(false)}>Hủy</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Lưu</button>
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
            <div className="admin-form-actions" style={{ display: 'flex', gap: 8, marginTop: 'var(--space-5)' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowWordForm(false)}>Hủy</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Lưu</button>
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
      <div className="admin-nested-form" style={{ width: 'min(480px, 100%)', background: 'white', padding: '16px' }}>
        <div className="admin-subpanel-head" style={{ marginBottom: 'var(--space-4)', borderBottom: 0, background: 'transparent' }}>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{title}</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Đóng</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AdminVocabulary;
