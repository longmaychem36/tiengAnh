import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiCheckCircle,
  FiClock,
  FiImage,
  FiInbox,
  FiMessageSquare,
  FiRefreshCw,
  FiSend
} from 'react-icons/fi';
import { adminSupportApi } from '../../api/supportApi';
import Loading from '../../components/common/Loading';
import './AdminSupport.css';

const categories = {
  feedback: 'Đóng góp ý kiến hoặc đề xuất',
  learning: 'Vấn đề bài học hoặc khóa học',
  account: 'Tài khoản và đăng nhập',
  payment: 'Thanh toán và gói Plus',
  technical: 'Lỗi kỹ thuật',
  other: 'Khác'
};

const statuses = [
  { value: 'all', label: 'Tất cả' },
  { value: 'open', label: 'Đang chờ' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'answered', label: 'Đã phản hồi' },
  { value: 'resolved', label: 'Đã giải quyết' },
  { value: 'closed', label: 'Đã đóng' }
];

const statusLabels = Object.fromEntries(statuses.map((item) => [item.value, item.label]));

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

function getStatusIcon(status) {
  if (status === 'answered') return FiMessageSquare;
  if (status === 'resolved' || status === 'closed') return FiCheckCircle;
  return FiClock;
}

function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', category: 'all', search: '' });
  const [response, setResponse] = useState('');
  const [nextStatus, setNextStatus] = useState('answered');

  const selectedClosed = selected?.status === 'closed';

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === 'open').length,
    answered: tickets.filter((ticket) => ticket.status === 'answered').length,
    resolved: tickets.filter((ticket) => ticket.status === 'resolved').length
  }), [tickets]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await adminSupportApi.getTickets(filters);
      const nextTickets = res.data || [];
      setTickets(nextTickets);
      if (!selectedId && nextTickets[0]) setSelectedId(nextTickets[0].id);
      if (selectedId && !nextTickets.some((ticket) => ticket.id === selectedId)) {
        setSelectedId(nextTickets[0]?.id || null);
      }
    } catch (err) {
      toast.error(err.message || 'Không tải được phiếu hỗ trợ');
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedTicket = async (id) => {
    if (!id) {
      setSelected(null);
      return;
    }
    setLoadingDetail(true);
    try {
      const res = await adminSupportApi.getTicket(id);
      setSelected(res.data || null);
      setResponse('');
      setNextStatus(res.data?.status === 'resolved' || res.data?.status === 'closed' ? res.data.status : 'answered');
    } catch (err) {
      toast.error(err.message || 'Không tải được chi tiết phiếu');
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filters.status, filters.category]);

  useEffect(() => {
    loadSelectedTicket(selectedId);
  }, [selectedId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadTickets();
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (selectedClosed) {
      toast.error('Phiếu hỗ trợ đã đóng, không thể gửi thêm phản hồi');
      return;
    }
    setSaving(true);
    try {
      const res = await adminSupportApi.respond(selected.id, {
        response,
        status: nextStatus
      });
      setSelected(res.data);
      setResponse('');
      toast.success(nextStatus === 'closed' ? 'Đã gửi phản hồi và đóng phiếu' : 'Đã gửi phản hồi');
      await loadTickets();
    } catch (err) {
      toast.error(err.message || 'Không gửi được phản hồi');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusOnly = async (status) => {
    if (!selected || selectedClosed) return;
    setSaving(true);
    try {
      const res = await adminSupportApi.updateStatus(selected.id, status);
      setSelected(res.data);
      toast.success('Đã cập nhật trạng thái');
      await loadTickets();
    } catch (err) {
      toast.error(err.message || 'Không cập nhật được trạng thái');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-support-page" aria-labelledby="admin-support-title">
      <header className="admin-page-title admin-support-title">
        <div>
          <h1 id="admin-support-title">Support tickets</h1>
          <p>Quản lý phiếu trợ giúp và phản hồi người học.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={loadTickets}>
          <FiRefreshCw /> Làm mới
        </button>
      </header>

      <section className="admin-support-stats">
        <article><span>Tổng phiếu</span><strong>{stats.total}</strong></article>
        <article><span>Đang chờ</span><strong>{stats.open}</strong></article>
        <article><span>Đã phản hồi</span><strong>{stats.answered}</strong></article>
        <article><span>Đã giải quyết</span><strong>{stats.resolved}</strong></article>
      </section>

      <section className="admin-support-workspace">
        <div className="admin-support-list-panel">
          <form className="admin-support-filters" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Tìm tiêu đề, email, người gửi..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="all">Tất cả loại</option>
              {Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button type="submit">Tìm</button>
          </form>

          {loading ? (
            <Loading />
          ) : tickets.length === 0 ? (
            <div className="admin-support-empty">
              <FiInbox />
              <span>Không có phiếu phù hợp.</span>
            </div>
          ) : (
            <div className="admin-support-ticket-list">
              {tickets.map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status);
                return (
                  <button
                    key={ticket.id}
                    type="button"
                    className={`admin-support-ticket ${selectedId === ticket.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(ticket.id)}
                  >
                    <span className={`admin-support-status is-${ticket.status}`}>
                      <StatusIcon /> {statusLabels[ticket.status] || ticket.status}
                    </span>
                    <strong>{ticket.title}</strong>
                    <small>{ticket.username || ticket.email} · {formatDate(ticket.createdAt)}</small>
                    <em>{categories[ticket.category] || ticket.category}</em>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="admin-support-detail-panel">
          {loadingDetail ? (
            <Loading />
          ) : !selected ? (
            <div className="admin-support-empty">
              <FiInbox />
              <span>Chọn một phiếu để xem chi tiết.</span>
            </div>
          ) : (
            <>
              <div className="admin-support-detail-head">
                <span className={`admin-support-status is-${selected.status}`}>
                  {statusLabels[selected.status] || selected.status}
                </span>
                <h2>{selected.title}</h2>
                <p>{selected.username || 'Learner'} · {selected.email}</p>
                <small>{categories[selected.category] || selected.category} · {formatDate(selected.createdAt)}</small>
              </div>

              <div className="admin-support-message">
                <strong>Mô tả</strong>
                <p>{selected.description}</p>
              </div>

              {selected.attachmentUrl && (
                <a className="admin-support-attachment" href={selected.attachmentUrl} target="_blank" rel="noreferrer">
                  <FiImage />
                  <span>Xem ảnh đính kèm</span>
                  <small>{selected.attachmentOriginalName || 'Cloudinary image'}</small>
                </a>
              )}

              <div className="admin-support-thread">
                <strong>Hội thoại</strong>
                {(selected.messages || []).length === 0 ? (
                  <p className="admin-support-thread-empty">Chưa có tin nhắn nào.</p>
                ) : (
                  <div className="admin-support-message-list">
                    {selected.messages.map((message) => (
                      <article
                        key={message.id}
                        className={`admin-support-message ${message.senderRole === 'admin' ? 'is-admin' : 'is-user'}`}
                      >
                        <div>
                          <strong>{message.senderRole === 'admin' ? 'Admin' : (message.senderName || 'Người học')}</strong>
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
                )}
              </div>

              {selectedClosed ? (
                <div className="admin-support-closed-note">
                  <FiCheckCircle />
                  <span>Phiếu này đã đóng. Admin và người học không thể gửi thêm tin nhắn trong hội thoại này.</span>
                </div>
              ) : (
                <form className="admin-support-response-form" onSubmit={handleRespond}>
                  <label>
                    <span>Phản hồi cho người học</span>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={7}
                      required
                      placeholder="Nhập nội dung phản hồi..."
                    />
                  </label>
                  <label>
                    <span>Trạng thái sau khi gửi</span>
                    <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
                      {statuses.filter((status) => status.value !== 'all').map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </label>
                  <div className="admin-support-actions">
                    <button className="btn btn-secondary" type="button" disabled={saving} onClick={() => handleStatusOnly('in_progress')}>
                      Đánh dấu đang xử lý
                    </button>
                    <button className="btn btn-primary" type="submit" disabled={saving}>
                      {saving ? 'Đang gửi...' : 'Gửi phản hồi'} <FiSend />
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

export default AdminSupport;
