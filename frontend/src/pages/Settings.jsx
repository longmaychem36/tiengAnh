import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiBookOpen,
  FiCamera,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiHelpCircle,
  FiLock,
  FiRefreshCcw,
  FiUser,
  FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { userApi } from '../api/userApi';
import { billingApi } from '../api/billingApi';
import './Settings.css';

const VND_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('account');
  const [profileName, setProfileName] = useState(user?.username || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [confirmReset, setConfirmReset] = useState('');
  const [billingInfo, setBillingInfo] = useState(null);
  const [plusOrder, setPlusOrder] = useState(null);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [showOnboardingChoice, setShowOnboardingChoice] = useState(false);

  useEffect(() => {
    setProfileName(user?.username || '');
  }, [user?.username]);

  const accountItems = useMemo(() => ([
    { id: 'account', label: 'Tài khoản' },
    { id: 'courses', label: 'Khóa học' }
  ]), []);

  const formatVnd = (amount) => VND_FORMATTER.format(amount || 0);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!profileName.trim()) {
      toast.error('Tên hiển thị không được để trống');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await userApi.update(user.id, { username: profileName.trim() });
      updateUser({
        ...user,
        username: res.data?.Username || res.data?.username || profileName.trim()
      });
      toast.success('Đã cập nhật hồ sơ');
    } catch (err) {
      toast.error(err.message || 'Không thể cập nhật hồ sơ');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ảnh đại diện tối đa 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const res = await userApi.updateAvatar(user.id, file);
      const avatarUrl = res.data?.AvatarUrl || res.data?.avatarUrl;
      updateUser({ ...user, avatarUrl });
      toast.success('Đã cập nhật ảnh đại diện');
    } catch (err) {
      toast.error(err.message || 'Không thể cập nhật ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới cần ít nhất 6 ký tự');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận chưa khớp');
      return;
    }

    setSavingPassword(true);
    try {
      await userApi.changePassword(user.id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Đã đổi mật khẩu');
    } catch (err) {
      toast.error(err.message || 'Không thể đổi mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleResetLearning = async () => {
    if (confirmReset !== 'RESET') {
      toast.error('Nhập RESET để xác nhận reset khóa học');
      return;
    }

    setResetting(true);
    try {
      await userApi.resetLearningProgress(user.id);
      setConfirmReset('');
      setShowOnboardingChoice(true);
      toast.success('Đã reset tiến độ khóa học');
    } catch (err) {
      toast.error(err.message || 'Không thể reset khóa học');
    } finally {
      setResetting(false);
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
      toast.success('Đã tạo QR thanh toán Plus');
    } catch (err) {
      toast.error(err.message || 'Không thể tạo đơn nâng cấp Plus');
    } finally {
      setLoadingBilling(false);
    }
  };

  useEffect(() => {
    if (active !== 'plus' || user?.isPlus || billingInfo) return undefined;

    let cancelled = false;
    setLoadingBilling(true);
    billingApi.getSubscription()
      .then((res) => {
        if (!cancelled) setBillingInfo(res.data);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.message || 'Không tải được thông tin gói Plus');
      })
      .finally(() => {
        if (!cancelled) setLoadingBilling(false);
      });

    return () => {
      cancelled = true;
    };
  }, [active, billingInfo, user?.isPlus]);

  useEffect(() => {
    if (!plusOrder?.id || user?.isPlus) return undefined;

    let stopped = false;
    let running = false;
    let timerId = null;

    const pollPayment = async () => {
      if (stopped || running) return;
      running = true;
      try {
        const res = await billingApi.getPlusOrderStatus(plusOrder.id);
        if (stopped) return;

        setPlusOrder((prev) => ({ ...prev, ...res.data.payment }));
        if (res.data.subscription?.isPlus) {
          updateUser({
            ...user,
            plan: 'plus',
            isPlus: true,
            plusExpiresAt: res.data.subscription.plusExpiresAt
          });
          toast.success('Plus đã được kích hoạt');
          stopped = true;
          if (timerId) window.clearInterval(timerId);
        }
      } catch (err) {
        // Poll silently; the visible order status remains pending until backend confirms payment.
      } finally {
        running = false;
      }
    };

    pollPayment();
    timerId = window.setInterval(pollPayment, 5000);

    return () => {
      stopped = true;
      if (timerId) window.clearInterval(timerId);
    };
  }, [plusOrder?.id, user?.isPlus]);

  const renderAccount = () => (
    <section className="settings-main-panel">
      <div className="settings-section-title">
        <FiUser />
        <div>
          <h1>Tài khoản</h1>
          <p>Quản lý hồ sơ, ảnh đại diện và mật khẩu đăng nhập trong cùng một nơi.</p>
        </div>
      </div>

      <div className="settings-account-stack">
        <div className="settings-avatar-panel">
          <div className="settings-avatar-preview">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" />
            ) : (
              <span>{(user?.username || user?.email || 'L').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <strong>Ảnh đại diện</strong>
            <p>Dùng ảnh JPG, PNG, WEBP hoặc GIF. Kích thước tối đa 2MB.</p>
            <label className="settings-secondary-button">
              <FiCamera />
              {uploadingAvatar ? 'Đang tải...' : 'Đổi ảnh'}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleAvatarChange} disabled={uploadingAvatar} />
            </label>
          </div>
        </div>

        <form className="settings-form" onSubmit={handleProfileSave}>
          <div className="settings-subtitle">
            <FiUser />
            <h2>Hồ sơ</h2>
          </div>
          <label>
            <span>Tên hiển thị</span>
            <input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
          </label>
          <label>
            <span>Email</span>
            <input value={user?.email || ''} readOnly disabled />
          </label>
          <button type="submit" className="settings-primary-button" disabled={savingProfile}>
            {savingProfile ? 'Đang lưu...' : 'Lưu hồ sơ'}
          </button>
        </form>

        <form className="settings-form" onSubmit={handlePasswordSave}>
          <div className="settings-subtitle">
            <FiLock />
            <h2>Đổi mật khẩu</h2>
          </div>
          <label>
            <span>Mật khẩu hiện tại</span>
            <div className="settings-password-field">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((form) => ({ ...form, currentPassword: event.target.value }))}
              />
            </div>
          </label>
          <label>
            <span>Mật khẩu mới</span>
            <div className="settings-password-field">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(event) => setPasswordForm((form) => ({ ...form, newPassword: event.target.value }))}
              />
            </div>
          </label>
          <label>
            <span>Nhập lại mật khẩu mới</span>
            <div className="settings-password-field">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(event) => setPasswordForm((form) => ({ ...form, confirmPassword: event.target.value }))}
              />
              <button type="button" onClick={() => setShowPasswords((value) => !value)} aria-label={showPasswords ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                {showPasswords ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
          <button type="submit" className="settings-primary-button" disabled={savingPassword}>
            {savingPassword ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </section>
  );

  const renderCourses = () => (
    <section className="settings-main-panel">
      <div className="settings-section-title">
        <FiBookOpen />
        <div>
          <h1>Khóa học</h1>
          <p>Quản lý tiến độ học tiếng Anh của tài khoản này.</p>
        </div>
      </div>

      <div className="settings-course-row">
        <div className="settings-course-flag">EN</div>
        <div>
          <strong>Tiếng Anh</strong>
          <span>Reading, Writing, Listening, Speaking, Grammar và Mini game</span>
        </div>
      </div>

      <div className="settings-danger-box">
        <div>
          <h2>Reset khóa học</h2>
          <p>Thao tác này xóa tiến độ kỹ năng, nhiệm vụ hằng ngày, thời gian học, mini game và đưa EXP về 0. Hồ sơ, gói Plus và bộ sưu tập từ vựng vẫn được giữ lại.</p>
        </div>
        <input
          value={confirmReset}
          onChange={(event) => setConfirmReset(event.target.value)}
          placeholder="Nhập RESET"
        />
        <button type="button" onClick={handleResetLearning} disabled={resetting || confirmReset !== 'RESET'}>
          <FiRefreshCcw />
          {resetting ? 'Đang reset...' : 'Reset'}
        </button>
      </div>
    </section>
  );

  const renderPlus = () => (
    <section className="settings-main-panel">
      <div className="settings-section-title">
        <FiZap />
        <div>
          <h1>Nâng cấp Plus</h1>
          <p>Mở khóa Listening, Speaking và AI Speaking Builder cho tài khoản học tập.</p>
        </div>
      </div>

      {user?.isPlus ? (
        <div className="settings-plus-status">
          <FiCheckCircle />
          <div>
            <strong>Plus đang hoạt động</strong>
            <span>{user?.plusExpiresAt ? `Có hiệu lực đến ${new Date(user.plusExpiresAt).toLocaleDateString('vi-VN')}` : 'Tài khoản đã được mở khóa Plus.'}</span>
          </div>
        </div>
      ) : (
        <div className="settings-plus-panel">
          <div className="settings-plus-head">
            <div>
              <span>LINGOCONNECT PLUS</span>
              <h2>Luyện nghe, nói và tạo bài Speaking bằng AI</h2>
            </div>
            <strong>{billingInfo?.upgrade ? formatVnd(billingInfo.upgrade.price) : (loadingBilling ? 'Đang tải...' : '—')}</strong>
          </div>

          <ul>
            <li>Listening và Speaking không giới hạn trong thời hạn gói.</li>
            <li>AI Speaking Builder tạo bài luyện theo chủ đề cá nhân.</li>
            <li>Thanh toán bằng QR SePay, hệ thống tự kích hoạt khi xác nhận giao dịch.</li>
          </ul>

          {!plusOrder && (
            <button type="button" className="settings-primary-button" onClick={createPlusOrder} disabled={loadingBilling}>
              {loadingBilling ? 'Đang tạo...' : 'Tạo QR thanh toán'}
            </button>
          )}

          {plusOrder && (
            <div className="settings-plus-payment">
              {plusOrder.qrUrl ? (
                <img src={plusOrder.qrUrl} alt="QR thanh toán Plus" />
              ) : (
                <div className="settings-plus-qr-empty">QR chưa sẵn sàng</div>
              )}
              <div className="settings-plus-transfer">
                <span>Ngân hàng: <strong>{billingInfo?.upgrade?.transfer?.bankCode || 'Chưa cấu hình'}</strong></span>
                <span>Số tài khoản: <strong>{billingInfo?.upgrade?.transfer?.accountNumber || 'Chưa cấu hình'}</strong></span>
                <span>Số tiền: <strong>{formatVnd(plusOrder.amount)}</strong></span>
                <span>Nội dung: <strong>{plusOrder.transferContent}</strong></span>
                <span>Trạng thái: <strong>{plusOrder.status}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );

  const renderMain = () => {
    if (active === 'courses') return renderCourses();
    if (active === 'plus') return renderPlus();
    return renderAccount();
  };

  return (
    <div className="settings-page">
      <div className="settings-content">
        {renderMain()}

        <aside className="settings-rail" aria-label="Cài đặt tài khoản">
          <div className="settings-card">
            <h2>Tài khoản</h2>
            {accountItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={active === item.id ? 'is-active' : ''}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="settings-card">
            <h2>Plus</h2>
            <button
              type="button"
              className={active === 'plus' ? 'is-active' : ''}
              onClick={() => setActive('plus')}
            >
              <FiZap /> Nâng cấp Plus
            </button>
          </div>

          <div className="settings-card">
            <h2>Hỗ trợ</h2>
            <Link to="/support"><FiHelpCircle /> Trung tâm trợ giúp</Link>
          </div>

          <button type="button" className="settings-logout" onClick={logout}>Đăng xuất</button>
        </aside>
      </div>

      {showOnboardingChoice && (
        <div className="settings-modal-backdrop" role="presentation" onClick={() => setShowOnboardingChoice(false)}>
          <section
            className="settings-choice-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-onboarding-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="reset-onboarding-title">Quay về onboarding?</h2>
            <p>Tiến độ khóa học đã được reset. Bạn có muốn làm lại phần kiểm tra đầu vào để hệ thống gợi ý lộ trình mới không?</p>
            <div>
              <button type="button" className="settings-secondary-action" onClick={() => setShowOnboardingChoice(false)}>
                Ở lại cài đặt
              </button>
              <button
                type="button"
                className="settings-primary-button"
                onClick={() => {
                  updateUser({ ...user, onboardingCompleted: false });
                  setShowOnboardingChoice(false);
                  navigate('/onboarding');
                }}
              >
                Quay về onboarding
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Settings;
