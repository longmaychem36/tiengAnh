import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiCheckCircle,
  FiClock,
  FiImage,
  FiLifeBuoy,
  FiMessageSquare,
  FiPaperclip,
  FiSend,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { supportApi } from '../api/supportApi';
import Loading from '../components/common/Loading';
import './Support.css';

const categories = [
  { value: 'feedback', label: 'Đóng góp ý kiến hoặc đề xuất' },
  { value: 'learning', label: 'Vấn đề bài học hoặc khóa học' },
  { value: 'account', label: 'Tài khoản và đăng nhập' },
  { value: 'payment', label: 'Thanh toán và gói Plus' },
  { value: 'technical', label: 'Lỗi kỹ thuật' },
  { value: 'other', label: 'Khác' }
];

const statusMeta = {
  open: { label: 'Đang chờ', icon: FiClock },
  in_progress: { label: 'Đang xử lý', icon: FiClock },
  answered: { label: 'Đã phản hồi', icon: FiMessageSquare },
  resolved: { label: 'Đã giải quyết', icon: FiCheckCircle },
  closed: { label: 'Đã đóng', icon: FiCheckCircle }
};

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

function validateImage(file) {
  if (!file) return false;
  if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) {
    toast.error('Ảnh đính kèm phải là PNG, JPG, WEBP hoặc GIF');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Ảnh đính kèm tối đa 5MB');
    return false;
  }
  return true;
}

function Support() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || '',
    title: '',
    description: '',
    category: categories[0].value,
    attachment: null
  });
  const [reply, setReply] = useState({ message: '', attachment: null });

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((item) => [item.value, item.label])),
    []
  );

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await supportApi.getMyTickets();
      const nextTickets = res.data || [];
      setTickets(nextTickets);
      if (!selectedId && nextTickets[0]) setSelectedId(nextTickets[0].id);
    } catch (err) {
      toast.error(err.message || 'Không tải được phiếu hỗ trợ');
    } finally {
      setLoading(false);
    }
  };

  const loadTicket = async (ticketId) => {
    if (!ticketId) {
      setSelected(null);
      return;
    }
    setLoadingDetail(true);
    try {
      const res = await supportApi.getMyTicket(ticketId);
      setSelected(res.data || null);
    } catch (err) {
      toast.error(err.message || 'Không tải được hội thoại');
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    loadTicket(selectedId);
  }, [selectedId]);

  const handleFileChange = (e, target) => {
    const file = e.target.files?.[0] || null;
    e.target.value = '';
    if (!file || !validateImage(file)) return;

    if (target === 'reply') {
      setReply((current) => ({ ...current, attachment: file }));
    } else {
      setForm((current) => ({ ...current, attachment: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await supportApi.createTicket(form);
      toast.success('Đã gửi phiếu hỗ trợ');
      setForm({
        email: user?.email || '',
        title: '',
        description: '',
        category: categories[0].value,
        attachment: null
      });
      await loadTickets();
      setSelectedId(res.data?.id || null);
    } catch (err) {
      toast.error(err.message || 'Không gửi được phiếu hỗ trợ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSending(true);
    try {
      const res = await supportApi.addMessage(selected.id, reply);
      setSelected(res.data);
      setReply({ message: '', attachment: null });
      await loadTickets();
      toast.success('Đã gửi tin nhắn');
    } catch (err) {
      toast.error(err.message || 'Không gửi được tin nhắn');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="support-page" aria-labelledby="support-title">
      <header className="support-heading">
        <span>Trung tâm trợ giúp</span>
        <h1 id="support-title">Bạn cần LingoConnect hỗ trợ gì?</h1>
        <p>Gửi phiếu hỗ trợ cho admin và tiếp tục trao đổi trực tiếp trong từng hội thoại.</p>
      </header>

      <section className="support-form-shell">
        <div className="support-form-guide">
          <FiLifeBuoy />
          <h2>Tạo phiếu mới</h2>
          <p>Các thông tin vấn đề là bắt buộc. Ảnh minh họa có thể bỏ trống hoặc gửi kèm trong hội thoại sau.</p>
        </div>

        <motion.form
          className="support-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label>
            <span>Email của bạn *</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>

          <label>
            <span>Tiêu đề *</span>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={255} />
          </label>

          <label>
            <span>Mô tả *</span>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={5} maxLength={5000} />
          </label>

          <label>
            <span>Loại vấn đề *</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <div className="support-attachment-field">
            <span>Đính kèm</span>
            <label className="support-dropzone">
              <FiPaperclip />
              <strong>{form.attachment ? form.attachment.name : 'Thêm ảnh hoặc thả file tại đây'}</strong>
              <small>PNG, JPG, WEBP, GIF. Tối đa 5MB.</small>
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleFileChange(e, 'form')} />
            </label>
            {form.attachment && (
              <button className="support-remove-file" type="button" onClick={() => setForm({ ...form, attachment: null })}>
                <FiX /> Bỏ ảnh đính kèm
              </button>
            )}
          </div>

          <button className="support-submit" type="submit" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Gửi phiếu'}
            {!submitting && <FiSend />}
          </button>
        </motion.form>
      </section>

      <section className="support-conversation-shell" aria-label="Hội thoại hỗ trợ">
        <aside className="support-ticket-list">
          <div className="support-list-head">
            <h2>Phiếu đã gửi</h2>
            <button type="button" onClick={loadTickets}>Làm mới</button>
          </div>

          {loading ? (
            <Loading />
          ) : tickets.length === 0 ? (
            <div className="support-empty">Bạn chưa gửi phiếu hỗ trợ nào.</div>
          ) : (
            <div className="support-ticket-stack">
              {tickets.map((ticket) => {
                const StatusIcon = statusMeta[ticket.status]?.icon || FiClock;
                return (
                  <button
                    className={`support-ticket-row ${selectedId === ticket.id ? 'is-active' : ''}`}
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedId(ticket.id)}
                  >
                    <span className={`support-status is-${ticket.status}`}>
                      <StatusIcon /> {statusMeta[ticket.status]?.label || ticket.status}
                    </span>
                    <strong>{ticket.title}</strong>
                    <small>{categoryMap[ticket.category] || ticket.category} · {formatDate(ticket.createdAt)}</small>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="support-thread-panel">
          {loadingDetail ? (
            <Loading />
          ) : !selected ? (
            <div className="support-empty">Chọn một phiếu để xem hội thoại.</div>
          ) : (
            <>
              <div className="support-thread-head">
                <span className={`support-status is-${selected.status}`}>
                  {statusMeta[selected.status]?.label || selected.status}
                </span>
                <h2>{selected.title}</h2>
                <p>{categoryMap[selected.category] || selected.category} · {formatDate(selected.createdAt)}</p>
              </div>

              <div className="support-message-list">
                {(selected.messages || []).map((message) => (
                  <article
                    key={message.id}
                    className={`support-message-bubble ${message.senderRole === 'admin' ? 'is-admin' : 'is-user'}`}
                  >
                    <div>
                      <strong>{message.senderRole === 'admin' ? 'Admin' : (message.senderName || 'Bạn')}</strong>
                      <small>{formatDate(message.createdAt)}</small>
                    </div>
                    <p>{message.message}</p>
                    {message.attachmentUrl && (
                      <a href={message.attachmentUrl} target="_blank" rel="noreferrer">
                        <FiImage /> Xem ảnh đính kèm
                      </a>
                    )}
                  </article>
                ))}
              </div>

              <form className="support-reply-form" onSubmit={handleSendMessage}>
                <textarea
                  value={reply.message}
                  onChange={(e) => setReply({ ...reply, message: e.target.value })}
                  rows={3}
                  required
                  placeholder="Nhập tin nhắn phản hồi..."
                />
                <div className="support-reply-actions">
                  <label className="support-reply-file">
                    <FiPaperclip />
                    <span>{reply.attachment ? reply.attachment.name : 'Ảnh đính kèm'}</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleFileChange(e, 'reply')} />
                  </label>
                  {reply.attachment && (
                    <button type="button" onClick={() => setReply({ ...reply, attachment: null })}>
                      <FiX /> Bỏ ảnh
                    </button>
                  )}
                  <button className="support-submit" type="submit" disabled={sending}>
                    {sending ? 'Đang gửi...' : 'Gửi tin nhắn'} <FiSend />
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default Support;
