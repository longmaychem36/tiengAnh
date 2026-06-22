// ============================================
// Profile Page
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiSave } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/userApi';
import { billingApi } from '../api/billingApi';
import toast from 'react-hot-toast';

const VND_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

function Profile() {
  const { user, updateUser } = useAuth();
  const cropPreviewSize = 320;
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [billingInfo, setBillingInfo] = useState(null);
  const [plusOrder, setPlusOrder] = useState(null);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarCrop, setAvatarCrop] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropDragging, setCropDragging] = useState(null);

  const formatVnd = (amount) => VND_FORMATTER.format(amount || 0);

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user?.id) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh đại diện tối đa 2MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarCrop({ file, previewUrl });
    setCropZoom(1);
    setCropOffset({ x: 0, y: 0 });
  };

  const closeAvatarCrop = () => {
    if (avatarCrop?.previewUrl) URL.revokeObjectURL(avatarCrop.previewUrl);
    setAvatarCrop(null);
    setCropDragging(null);
  };

  const startCropDrag = (e) => {
    e.preventDefault();
    setCropDragging({
      startX: e.clientX,
      startY: e.clientY,
      originX: cropOffset.x,
      originY: cropOffset.y
    });
  };

  const moveCropDrag = (e) => {
    if (!cropDragging) return;
    setCropOffset(clampCropOffset({
      x: cropDragging.originX + e.clientX - cropDragging.startX,
      y: cropDragging.originY + e.clientY - cropDragging.startY
    }));
  };

  const getCropImageBox = (zoomValue = cropZoom) => {
    const imageWidth = avatarCrop?.imageWidth || cropPreviewSize;
    const imageHeight = avatarCrop?.imageHeight || cropPreviewSize;
    const baseScale = Math.max(cropPreviewSize / imageWidth, cropPreviewSize / imageHeight);
    return {
      width: imageWidth * baseScale * zoomValue,
      height: imageHeight * baseScale * zoomValue
    };
  };

  const clampCropOffset = (nextOffset, zoomValue = cropZoom) => {
    const box = getCropImageBox(zoomValue);
    const maxX = Math.max(0, (box.width - cropPreviewSize) / 2);
    const maxY = Math.max(0, (box.height - cropPreviewSize) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextOffset.x)),
      y: Math.min(maxY, Math.max(-maxY, nextOffset.y))
    };
  };

  const handleCropZoomChange = (value) => {
    const nextZoom = Number(value);
    setCropZoom(nextZoom);
    setCropOffset((offset) => clampCropOffset(offset, nextZoom));
  };

  const createCroppedAvatarFile = () => new Promise((resolve, reject) => {
    if (!avatarCrop) {
      reject(new Error('No avatar selected'));
      return;
    }

    const image = new Image();
    image.onload = () => {
      const outputSize = 512;
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputSize, outputSize);

      const baseScale = Math.max(outputSize / image.width, outputSize / image.height);
      const scale = baseScale * cropZoom;
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const outputOffsetScale = outputSize / cropPreviewSize;
      const safeOffset = clampCropOffset(cropOffset, cropZoom);
      const drawX = (outputSize - drawWidth) / 2 + (safeOffset.x * outputOffsetScale);
      const drawY = (outputSize - drawHeight) / 2 + (safeOffset.y * outputOffsetScale);
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Cannot crop avatar'));
          return;
        }
        resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.9);
    };
    image.onerror = () => reject(new Error('Cannot read avatar image'));
    image.src = avatarCrop.previewUrl;
  });

  const uploadCroppedAvatar = async () => {
    setUploadingAvatar(true);
    try {
      const croppedFile = await createCroppedAvatarFile();
      const res = await userApi.updateAvatar(user.id, croppedFile);
      const avatarUrl = res.data?.AvatarUrl || res.data?.avatarUrl;
      updateUser({ ...user, avatarUrl });
      toast.success('Đã cập nhật ảnh đại diện');
      closeAvatarCrop();
    } catch (err) {
      toast.error(err.message || 'Không thể cập nhật ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const cropImageBox = avatarCrop ? getCropImageBox() : { width: cropPreviewSize, height: cropPreviewSize };
  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Hồ sơ</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 'var(--space-6)', border: user?.isPlus ? '1px solid #34d399' : '1px solid #fde68a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 4 }}>Gói tài khoản</h2>
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
              <button type="button" className="btn btn-secondary" onClick={loadBillingInfo} disabled={loadingBilling}>
                {loadingBilling ? 'Đang tải...' : 'Xem thông tin gói'}
              </button>
            )}

            {billingInfo && !plusOrder && (
              <button type="button" className="btn btn-primary" onClick={createPlusOrder} disabled={loadingBilling}>
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
                  <div style={{ gridColumn: '1 / -1' }}><strong>Ná»™i dung:</strong><br />{plusOrder.transferContent}</div>
                  <div><strong>Trạng thái:</strong><br />{plusOrder.status}</div>
                </div>
                <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: '#fff7ed', color: '#9a3412', borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  Giữ nguyên nội dung chuyển khoản.
                </div>

                <button type="button" className="btn btn-primary" onClick={checkPaymentStatus} disabled={checkingPayment}>
                  {checkingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
            <div style={{
              width: 88, height: 88,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '32px',
              overflow: 'hidden',
              border: '3px solid var(--color-primary-light)'
            }}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <label
              title="Đổi ảnh đại diện"
              style={{
                position: 'absolute',
                right: -2,
                bottom: -2,
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--shadow-md)',
                cursor: uploadingAvatar ? 'wait' : 'pointer'
              }}
            >
              <FiCamera size={16} />
              <input aria-label="Trường nhập" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleAvatarChange} disabled={uploadingAvatar} style={{ display: 'none' }} />
            </label>
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

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-username">Tên người dùng</label>
            <input aria-label="Trường nhập" id="profile-username" className="form-input" type="text" value={username}
              onChange={e => setUsername(e.target.value)} required minLength={3} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Email</label>
            <input aria-label="Trường nhập" id="profile-email" className="form-input" type="email" value={user?.email || ''} readOnly disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            <FiSave size={16} />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </motion.div>


      {avatarCrop && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            display: 'grid',
            placeItems: 'center',
            padding: 'var(--space-4)',
            background: 'rgba(15, 23, 42, 0.5)'
          }}
          onMouseMove={moveCropDrag}
          onMouseUp={() => setCropDragging(null)}
          onMouseLeave={() => setCropDragging(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ width: 'min(440px, 100%)', padding: 'var(--space-6)' }}
          >
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>Cắt ảnh đại diện</h3>
            <div
              onMouseDown={startCropDrag}
              style={{
                width: cropPreviewSize,
                maxWidth: '100%',
                aspectRatio: '1 / 1',
                margin: '0 auto var(--space-4)',
                overflow: 'hidden',
                borderRadius: 18,
                border: '2px solid var(--color-primary)',
                background: '#fff',
                cursor: cropDragging ? 'grabbing' : 'grab',
                position: 'relative'
              }}
            >
              <img
                src={avatarCrop.previewUrl}
                alt="Avatar preview"
                draggable={false}
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  setAvatarCrop((current) => current ? { ...current, imageWidth: naturalWidth, imageHeight: naturalHeight } : current);
                  setCropOffset((offset) => clampCropOffset(offset));
                }}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${cropOffset.x}px)`,
                  top: `calc(50% + ${cropOffset.y}px)`,
                  width: avatarCrop.imageWidth || 'auto',
                  height: avatarCrop.imageHeight || 'auto',
                  maxWidth: 'none',
                  transform: `translate(-50%, -50%) scale(${cropImageBox.width / (avatarCrop.imageWidth || cropPreviewSize)})`,
                  transformOrigin: 'center',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            </div>

            <label className="form-label" htmlFor="avatar-zoom">Phóng to</label>
            <input aria-label="Trường nhập"
              id="avatar-zoom"
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={cropZoom}
              onChange={(e) => handleCropZoomChange(e.target.value)}
              style={{ width: '100%', marginBottom: 'var(--space-5)' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" type="button" onClick={closeAvatarCrop} disabled={uploadingAvatar}>Há»§y</button>
              <button className="btn btn-primary" type="button" onClick={uploadCroppedAvatar} disabled={uploadingAvatar}>
                {uploadingAvatar ? 'Đang tải...' : 'Lưu ảnh'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


export default Profile;
