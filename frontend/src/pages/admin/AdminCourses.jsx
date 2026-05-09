import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import Loading from '../../components/common/Loading';

function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', levelId: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await courseApi.getAll({ limit: 100 });
      setCourses(res.data?.courses || res.data || []);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (course = null) => {
    if (course) {
      setEditId(course.Id);
      setFormData({ title: course.Title, description: course.Description, levelId: course.LevelId || '' });
    } else {
      setEditId(null);
      setFormData({ title: '', description: '', levelId: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await courseApi.update(editId, formData);
        toast.success('Course updated');
      } else {
        await courseApi.create(formData);
        toast.success('Course created');
      }
      setShowModal(false);
      loadCourses();
    } catch (err) {
      toast.error(err.message || 'Failed to save course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? All associated lessons will be lost.')) return;
    try {
      await courseApi.remove(id);
      toast.success('Course deleted');
      loadCourses();
    } catch {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>🛠 Manage Courses</h1>
          <p>Create, update, and organize language courses</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> New Course
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 'var(--space-4)' }}>Title</th>
              <th style={{ padding: 'var(--space-4)' }}>Description</th>
              <th style={{ padding: 'var(--space-4)' }}>Level</th>
              <th style={{ padding: 'var(--space-4)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.Id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-4)', fontWeight: 600 }}>{course.Title}</td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {course.Description}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    {course.LevelCode ? <span className="badge badge-primary">{course.LevelCode}</span> : '-'}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-secondary btn-sm tooltip" data-tip="Manage Lessons" onClick={() => navigate(`/admin/courses/${course.Id}/lessons`)}>
                        <FiBookOpen size={14} />
                      </button>
                      <button className="btn btn-secondary btn-sm tooltip" data-tip="Edit Course" onClick={() => openModal(course)}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn btn-icon btn-sm tooltip" style={{ color: 'var(--color-error)' }} data-tip="Delete Course" onClick={() => handleDelete(course.Id)}>
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

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ width: '100%', maxWidth: 500 }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              {editId ? 'Edit Course' : 'Create Course'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Master IELTS Reading" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the course..." />
              </div>
              <div className="form-group">
                <label className="form-label">Level ID (Optional, 1=A1, 2=A2, etc.)</label>
                <input className="form-input" type="number" value={formData.levelId} onChange={e => setFormData({...formData, levelId: e.target.value})} placeholder="Level ID" />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminCourses;
