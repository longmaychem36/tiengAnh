// ============================================
// Profile Page
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import { HiOutlineFire } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/userApi';
import { billingApi } from '../api/billingApi';
import toast from 'react-hot-toast';

function Profile() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [billingInfo, setBillingInfo] = useState(null);
  const [plusOrder, setPlusOrder] = useState(null);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const formatVnd = (amount) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.update(user.id, { username });
      updateUser({ ...user, username: res.data?.Username || username });
      toast.success('Đã cập nhật hồ sơ');
    } catch (err) {
      toast.error(err.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const loadBillingInfo = async () => {
    setLoadingBilling(true);
    try {
      const res = await billingApi.getSubscription();
      setBillingInfo(res.data);
    } catch (err) {
      toast.error(err.message || 'Không tải được thông tin gói');
    } finally {
      setLoadingBilling(false);
    }
  };

  const createPlusOrder = async () => {
    setLoadingBilling(true);
    try {
      const res = await billingApi.createPlusOrder();
      setBillingInfo({
        subscription: res.data.subscription,
        upgrade: res.data.upgrade
      });
      setPlusOrder({
        ...res.data.payment,
        qrUrl: res.data.qrUrl
      });
      toast.success('Đã tạo mã QR thanh toán SePay');
    } catch (err) {
      toast.error(err.message || 'Không thể tạo đơn thanh toán');
    } finally {
      setLoadingBilling(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!plusOrder?.id) return;
    setCheckingPayment(true);
    try {
      const res = await billingApi.getPlusOrderStatus(plusOrder.id);
      setPlusOrder(prev => ({ ...prev, ...res.data.payment }));
      if (res.data.subscription?.isPlus) {
        updateUser({
          ...user,
          plan: 'plus',
          isPlus: true,
          plusExpiresAt: res.data.subscription.plusExpiresAt
        });
        toast.success('Thanh toán thành công, Plus đã được kích hoạt');
      } else {
        toast('Chưa nhận được giao dịch. Vui lòng thử lại sau vài giây.');
      }
    } catch (err) {
      toast.error(err.message || 'Không kiểm tra được thanh toán');
    } finally {
      setCheckingPayment(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <h1>Hồ sơ</h1>
        <p>Quản lý thông tin tài khoản của bạn</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 'var(--space-6)', border: user?.isPlus ? '1px solid #34d399' : '1px solid #fde68a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 4 }}>Gói tài khoản</h2>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Plus mở khóa các tính năng nâng cao của hệ thống.
            </div>
          </div>
          <span style={{ padding: '6px 12px', borderRadius: 'var(--radius-full)', background: user?.isPlus ? '#d1fae5' : '#fef3c7', color: user?.isPlus ? '#047857' : '#92400e', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>
            {user?.isPlus ? 'PLUS' : 'FREE'}
          </span>
        </div>

        {user?.isPlus ? (
          <div style={{ padding: 'var(--space-4)', background: '#ecfdf5', color: '#047857', borderRadius: 'var(--radius-lg)', fontWeight: 600 }}>
            Tài khoản đang dùng Plus
            {user?.plusExpiresAt ? ` đến ${new Date(user.plusExpiresAt).toLocaleDateString('vi-VN')}` : ''}.
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 4 }}>Giá demo</div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{formatVnd(billingInfo?.upgrade?.price || 2000)}</div>
              </div>
              <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 4 }}>Thời hạn</div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>{billingInfo?.upgrade?.durationDays || 30} ngày</div>
              </div>
            </div>

            {!billingInfo && (
              <button className="btn btn-secondary" onClick={loadBillingInfo} disabled={loadingBilling}>
                {loadingBilling ? 'Đang tải...' : 'Xem thông tin gói'}
              </button>
            )}

            {billingInfo && !plusOrder && (
              <button className="btn btn-primary" onClick={createPlusOrder} disabled={loadingBilling}>
                {loadingBilling ? 'Đang tạo...' : 'Tạo QR thanh toán SePay'}
              </button>
            )}

            {plusOrder && (
              <div style={{ padding: 'var(--space-4)', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontWeight: 800, marginBottom: 'var(--space-3)', color: '#92400e' }}>Chuyển khoản qua SePay</div>

                {plusOrder.qrUrl ? (
                  <img
                    src={plusOrder.qrUrl}
                    alt="SePay QR"
                    style={{ width: 220, maxWidth: '100%', display: 'block', marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid #fde68a' }}
                  />
                ) : (
                  <div style={{ padding: 'var(--space-3)', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
                    Chưa cấu hình SEPAY_BANK_CODE hoặc SEPAY_ACCOUNT_NUMBER trong backend/.env.
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                  <div><strong>Ngân hàng:</strong><br />{billingInfo.upgrade.transfer.bankCode || 'Chưa cấu hình'}</div>
                  <div><strong>Số tài khoản:</strong><br />{billingInfo.upgrade.transfer.accountNumber || 'Chưa cấu hình'}</div>
                  <div><strong>Chủ tài khoản:</strong><br />{billingInfo.upgrade.transfer.accountName || 'Chưa cấu hình'}</div>
                  <div><strong>Số tiền:</strong><br />{formatVnd(plusOrder.amount)}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Nội dung:</strong><br />{plusOrder.transferContent}</div>
                  <div><strong>Trạng thái:</strong><br />{plusOrder.status}</div>
                </div>
                <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: '#fff7ed', color: '#9a3412', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  Không sửa nội dung chuyển khoản. Mã giao dịch phải bắt đầu bằng SEVQR để SePay nhận diện.
                </div>

                <button className="btn btn-primary" onClick={checkPaymentStatus} disabled={checkingPayment}>
                  {checkingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '32px',
            flexShrink: 0
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{user?.username}</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <span className="badge badge-primary">{user?.role}</span>
              {user?.level && <span className="badge badge-success">{user.level.name}</span>}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)',
          padding: 'var(--space-4)',
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
              {user?.stats?.exp || 0}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Tổng EXP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-secondary)' }}>
              Lv.{user?.stats?.gameLevel || 1}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Cấp độ</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <HiOutlineFire size={24} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-accent)' }}>
                {user?.stats?.streakDays || 0}
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Chuỗi ngày</div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Tên người dùng</label>
            <input className="form-input" type="text" value={username}
              onChange={e => setUsername(e.target.value)} required minLength={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={user?.email || ''} disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <p className="form-error" style={{ color: 'var(--color-text-muted)' }}>Email không thể thay đổi</p>
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            <FiSave size={16} />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Profile;
