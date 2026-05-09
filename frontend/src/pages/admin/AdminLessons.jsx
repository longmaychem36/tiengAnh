import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiImage, FiMusic, FiVideo, FiPaperclip } from 'react-icons/fi';
import { lessonApi } from '../../api/lessonApi';
import { courseApi } from '../../api/courseApi';
import Loading from '../../components/common/Loading';

function AdminLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'reading', orderIndex: 0 });
  const [mediaData, setMediaData] = useState({ mediaType: 'image', mediaUrl: '', description: '' });
  const [activeLessonId, setActiveLessonId] = useState(null);

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resC, resL] = await Promise.all([
        courseApi.getById(courseId),
        lessonApi.getByCourse(courseId)
      ]);
      setCourse(resC.data);
      setLessons(resL.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openLessonModal = (lesson = null) => {
    if (lesson) {
      setEditId(lesson.Id);
      setFormData({ title: lesson.Title, content: lesson.Content || '', type: lesson.Type, orderIndex: lesson.OrderIndex });
    } else {
      setEditId(null);
      setFormData({ title: '', content: '', type: 'reading', orderIndex: lessons.length });
    }
    setShowLessonModal(true);
  };

  const openMediaModal = (lessonId) => {
    setActiveLessonId(lessonId);
    setMediaData({ mediaType: 'image', mediaUrl: '', description: '' });
    setShowMediaModal(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, courseId };
      if (editId) {
        await lessonApi.update(editId, payload);
        toast.success('Lesson updated');
      } else {
        await lessonApi.create(payload);
        toast.success('Lesson created');
      }
      setShowLessonModal(false);
      loadData();
    } catch {
      toast.error('Failed to save lesson');
    }
  };

  const handleLessonDelete = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await lessonApi.remove(id);
      toast.success('Lesson deleted');
      loadData();
    } catch {
      toast.error('Failed to delete lesson');
    }
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    try {
      await lessonApi.addMedia(activeLessonId, mediaData);
      toast.success('Media attached successfully!');
      setShowMediaModal(false);
      // Wait, we don't display media directly on this list currently, but we show a success message
    } catch {
      toast.error('Failed to attach media');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/courses')} style={{ marginBottom: 'var(--space-4)', padding: 0, color: 'var(--color-text-muted)' }}>
          <FiArrowLeft /> Back to Courses
        </button>
        <div className="flex-between" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ color: 'var(--color-primary)' }}>Lessons for: {course?.Title}</h1>
            <p>Manage lessons inside this course</p>
          </div>
          <button className="btn btn-primary" onClick={() => openLessonModal()}>
            <FiPlus /> Add Lesson
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 'var(--space-4)', width: '60px' }}>Order</th>
              <th style={{ padding: 'var(--space-4)' }}>Title</th>
              <th style={{ padding: 'var(--space-4)' }}>Type</th>
              <th style={{ padding: 'var(--space-4)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                  No lessons found in this course.
                </td>
              </tr>
            ) : (
              lessons.map(lesson => (
                <tr key={lesson.Id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-4)', fontWeight: 600, color: 'var(--color-text-muted)' }}>#{lesson.OrderIndex}</td>
                  <td style={{ padding: 'var(--space-4)', fontWeight: 600 }}>{lesson.Title}</td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{lesson.Type}</span>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-secondary btn-sm tooltip" data-tip="Attach Media" onClick={() => openMediaModal(lesson.Id)}>
                        <FiPaperclip size={14} />
                      </button>
                      <button className="btn btn-secondary btn-sm tooltip" data-tip="Edit Lesson" onClick={() => openLessonModal(lesson)}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn btn-icon btn-sm tooltip" style={{ color: 'var(--color-error)' }} data-tip="Delete Lesson" onClick={() => handleLessonDelete(lesson.Id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 600 }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              {editId ? 'Edit Lesson' : 'Add Lesson'}
            </h3>
            <form onSubmit={handleLessonSubmit}>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Lesson Title</label>
                  <input className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Unit 1: Present Simple" />
                </div>
                <div className="form-group" style={{ width: 100 }}>
                  <label className="form-label">Order #</label>
                  <input className="form-input" type="number" required value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Lesson Type</label>
                <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="reading">Reading</option>
                  <option value="listening">Listening</option>
                  <option value="speaking">Speaking</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Content (HTML/Text)</label>
                <textarea className="form-input" rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Lesson text content..." />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLessonModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Media Modal */}
      {showMediaModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 500 }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Attach Media</h3>
            <form onSubmit={handleMediaSubmit}>
              <div className="form-group">
                <label className="form-label">Media Type</label>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="mtype" checked={mediaData.mediaType === 'image'} onChange={() => setMediaData({...mediaData, mediaType: 'image'})} />
                    <FiImage /> Image
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="mtype" checked={mediaData.mediaType === 'audio'} onChange={() => setMediaData({...mediaData, mediaType: 'audio'})} />
                    <FiMusic /> Audio
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="radio" name="mtype" checked={mediaData.mediaType === 'video'} onChange={() => setMediaData({...mediaData, mediaType: 'video'})} />
                    <FiVideo /> Video
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL / File Path</label>
                <input className="form-input" required value={mediaData.mediaUrl} onChange={e => setMediaData({...mediaData, mediaUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Caption / Description</label>
                <input className="form-input" value={mediaData.description} onChange={e => setMediaData({...mediaData, description: e.target.value})} placeholder="Optional description..." />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMediaModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Attach</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminLessons;
