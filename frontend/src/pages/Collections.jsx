// ============================================
// Collections Page
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiPlus, FiTrash2, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { collectionApi } from '../api/collectionApi';
import Loading from '../components/common/Loading';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [selectedCol, setSelectedCol] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showColModal, setShowColModal] = useState(false);
  const [colForm, setColForm] = useState({ name: '', description: '' });

  const [showWordModal, setShowWordModal] = useState(false);
  const [wordForm, setWordForm] = useState({ customWord: '', customMeaning: '', customExample: '' });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    setLoading(true);
    collectionApi.getMyCollections()
      .then(res => setCollections(res.data || []))
      .catch(() => toast.error('Failed to load collections'))
      .finally(() => setLoading(false));
  };

  const loadWords = (colId) => {
    collectionApi.getWords(colId)
      .then(res => setWords(res.data || []))
      .catch(() => toast.error('Failed to load words'));
  };

  const handleSelectCol = (col) => {
    setSelectedCol(col);
    setWords([]);
    loadWords(col.Id);
  };

  const handleCreateCol = async (e) => {
    e.preventDefault();
    try {
      await collectionApi.createCollection(colForm);
      toast.success('Collection created!');
      setShowColModal(false);
      setColForm({ name: '', description: '' });
      loadCollections();
    } catch {
      toast.error('Failed to create collection');
    }
  };

  const handleDeleteCol = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this collection and all its words?')) return;
    try {
      await collectionApi.deleteCollection(id);
      toast.success('Deleted');
      if (selectedCol?.Id === id) setSelectedCol(null);
      loadCollections();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleAddCustomWord = async (e) => {
    e.preventDefault();
    if (!selectedCol) return;
    try {
      await collectionApi.addWord(selectedCol.Id, wordForm);
      toast.success('Word added!');
      setShowWordModal(false);
      setWordForm({ customWord: '', customMeaning: '', customExample: '' });
      loadWords(selectedCol.Id);
      loadCollections(); // refresh counts
    } catch {
      toast.error('Failed to add word');
    }
  };

  const handleRemoveWord = async (wordId) => {
    if (!window.confirm('Remove this word?')) return;
    try {
      await collectionApi.removeWord(selectedCol.Id, wordId);
      toast.success('Removed');
      loadWords(selectedCol.Id);
      loadCollections();
    } catch {
      toast.error('Failed to remove word');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1>📚 My Collections</h1>
          <p>Organize and review your vocabulary</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowColModal(true)}>
          <FiPlus /> New Collection
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
        {/* Collections List */}
        <div>
          {collections.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
              No collections yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {collections.map(c => (
                <div key={c.Id} onClick={() => handleSelectCol(c)} className="card" style={{
                  cursor: 'pointer',
                  border: selectedCol?.Id === c.Id ? '2px solid var(--color-primary)' : undefined,
                  background: selectedCol?.Id === c.Id ? 'var(--color-primary-light)' : undefined,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <FiFolder size={20} style={{ color: selectedCol?.Id === c.Id ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                    <div>
                      <h3 style={{ fontWeight: 600 }}>{c.Name}</h3>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{c.WordCount || 0} words</div>
                    </div>
                  </div>
                  <button className="btn btn-icon btn-ghost" onClick={(e) => handleDeleteCol(c.Id, e)} style={{ color: 'var(--color-error)' }}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Collection Panel */}
        <div>
          {selectedCol ? (
            <div className="card">
              <div className="flex-between" style={{ marginBottom: 'var(--space-6)' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{selectedCol.Name}</h2>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{selectedCol.Description}</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowWordModal(true)}>
                  <FiPlus /> Add Word
                </button>
              </div>

              {words.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
                  This collection is empty.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {words.map(w => {
                    const isDict = !!w.DictWord;
                    const wordText = isDict ? w.DictWord : w.CustomWord;
                    const meaningText = isDict ? w.DictMeaningVI : w.CustomMeaning;
                    const exampleText = isDict ? w.DictExample : w.CustomExample;
                    const phonetic = isDict ? w.Phonetic : null;
                    const pos = isDict ? w.PartOfSpeech : null;

                    return (
                      <div key={w.Id} style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                        <div className="flex-between">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>{wordText}</span>
                            {phonetic && <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>/{phonetic}/</span>}
                            {pos && <span className="badge badge-primary">{pos}</span>}
                            {!isDict && <span className="badge badge-warning">Custom</span>}
                          </div>
                          <button className="btn btn-icon btn-ghost" onClick={() => handleRemoveWord(w.Id)} style={{ color: 'var(--color-error)' }}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>{meaningText}</p>
                        {exampleText && <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontStyle: 'italic', marginTop: 4 }}>"{exampleText}"</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="card flex-center flex-col" style={{ height: '300px', color: 'var(--color-text-muted)' }}>
              <FiFolder size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.3 }} />
              <p>Select a collection to view its vocabulary</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showColModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 400 }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>New Collection</h3>
            <form onSubmit={handleCreateCol}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" type="text" autoFocus required value={colForm.name} onChange={e => setColForm({...colForm, name: e.target.value})} placeholder="e.g. IELTS Work" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" type="text" value={colForm.description} onChange={e => setColForm({...colForm, description: e.target.value})} placeholder="Optional" />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                <button type="button" className="btn btn-secondary w-full" onClick={() => setShowColModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-full">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 400 }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Add Custom Word</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Tip: You can also add words directly from the Dictionary page.
            </p>
            <form onSubmit={handleAddCustomWord}>
              <div className="form-group">
                <label className="form-label">Word/Phrase</label>
                <input className="form-input" type="text" autoFocus required value={wordForm.customWord} onChange={e => setWordForm({...wordForm, customWord: e.target.value})} placeholder="e.g. piece of cake" />
              </div>
              <div className="form-group">
                <label className="form-label">Meaning (Vietnamese)</label>
                <input className="form-input" type="text" required value={wordForm.customMeaning} onChange={e => setWordForm({...wordForm, customMeaning: e.target.value})} placeholder="Dễ như ăn bánh" />
              </div>
              <div className="form-group">
                <label className="form-label">Example (Optional)</label>
                <input className="form-input" type="text" value={wordForm.customExample} onChange={e => setWordForm({...wordForm, customExample: e.target.value})} placeholder="The test was a piece of cake." />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                <button type="button" className="btn btn-secondary w-full" onClick={() => setShowWordModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-full">Add Word</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collections;
