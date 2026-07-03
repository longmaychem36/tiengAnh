import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiGift,
  FiHeadphones,
  FiMic,
  FiPlay,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';

const moduleMeta = {
  listening: { label: 'Listening', icon: FiHeadphones, color: '#2563eb' },
  speaking: { label: 'Speaking', icon: FiMic, color: '#7c3aed' },
  reading: { label: 'Reading', icon: FiBookOpen, color: '#0f766e' },
  writing: { label: 'Writing', icon: FiTrendingUp, color: '#d97706' },
  grammar: { label: 'Grammar', icon: FiCheckCircle, color: '#4f46e5' },
  game: { label: 'Mini game', icon: FiPlay, color: '#dc2626' },
  vocabulary: { label: 'Vocabulary', icon: FiTarget, color: '#16a34a' }
};

const targetTypeLabels = {
  listening_lesson: 'Listening',
  speaking_lesson: 'Speaking',
  reading_lesson: 'Reading',
  writing_lesson: 'Writing',
  grammar_topic: 'Grammar',
  game_level: 'Mini game',
  vocabulary_review: 'Vocabulary'
};

function formatDate(value, includeTime = true) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('vi-VN', includeTime
    ? { dateStyle: 'short', timeStyle: 'short' }
    : { dateStyle: 'short' }).format(date);
}

function formatDuration(seconds) {
  const total = Math.max(0, Number(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  return `${minutes} phút`;
}

function qualityLabel(quality) {
  return ['Quên', 'Rất khó', 'Khó', 'Đạt', 'Tốt', 'Dễ'][Number(quality)] || '-';
}

function OverviewMetric({ icon: Icon, label, value, detail }) {
  return (
    <article className="admin-learner-metric">
      <Icon />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </article>
  );
}

function AdminLearnerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plusDays, setPlusDays] = useState('30');
  const [giftingPlus, setGiftingPlus] = useState(false);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getLearnerDetail(id);
      setData(response.data);
    } catch (err) {
      const message = err?.message || 'Không tải được thông tin learner.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const giftPlus = async (event) => {
    event.preventDefault();
    const days = Math.floor(Number(plusDays));

    if (!Number.isFinite(days) || days < 1 || days > 3650) {
      toast.error('Số ngày Plus phải từ 1 đến 3650');
      return;
    }

    setGiftingPlus(true);
    try {
      const response = await adminApi.giftPlusDays(id, days);
      const updated = response.data || {};

      setData((current) => current ? {
        ...current,
        learner: {
          ...current.learner,
          plan: updated.Plan ?? updated.plan ?? current.learner.plan,
          plusexpiresat: updated.PlusExpiresAt ?? updated.plusexpiresat ?? current.learner.plusexpiresat,
          plusdaysremaining: updated.PlusDaysRemaining ?? updated.plusdaysremaining ?? current.learner.plusdaysremaining
        }
      } : current);
      toast.success(`Đã tặng ${days} ngày Plus cho ${data?.learner?.username || 'học viên'}`);
    } catch (err) {
      toast.error(err?.message || 'Không thể tặng Plus cho học viên');
    } finally {
      setGiftingPlus(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !data?.learner) {
    return (
      <main className="admin-learner-detail-page">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}><FiArrowLeft /> Quay lại</button>
        <section className="admin-content-card admin-learner-error">
          <FiAlertCircle />
          <h2>Không tải được learner</h2>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={loadDetail}><FiRefreshCw /> Thử lại</button>
        </section>
      </main>
    );
  }

  const { learner, overview, modules = [], spacedRepetition = {}, recentLessons = [], dailyActivity = [] } = data;
  const srSummary = spacedRepetition.summary || {};
  const initial = String(learner.username || 'L').charAt(0).toUpperCase();
  const isPlus = String(learner.plan || 'free').toLowerCase() === 'plus' && Number(learner.plusdaysremaining || 0) > 0;

  return (
    <main className="admin-learner-detail-page">
      <header className="admin-learner-toolbar">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}><FiArrowLeft /> Học viên</button>
        <button type="button" className="btn btn-secondary" onClick={loadDetail}><FiRefreshCw /> Làm mới</button>
      </header>

      <section className="admin-learner-profile-band">
        <div className="admin-learner-avatar">
          {learner.avatarurl ? <img src={learner.avatarurl} alt="" /> : initial}
        </div>
        <div className="admin-learner-heading">
          <div className="admin-learner-title-line">
            <h1>{learner.username}</h1>
            <span className={`admin-status-chip ${learner.isactive !== false ? 'is-active' : 'is-locked'}`}>
              {learner.isactive !== false ? 'Hoạt động' : 'Bị khóa'}
            </span>
            <span className={`admin-learner-plan ${isPlus ? 'is-plus' : ''}`}>{isPlus ? 'PLUS' : 'FREE'}</span>
          </div>
          <p>{learner.email}</p>
          <div className="admin-learner-facts">
            <span><FiTarget /> Xếp lớp: <strong>{learner.placementlevel === 'basic' ? 'Đã có nền tảng' : 'Mới học'}</strong></span>
            <span><FiCalendar /> Tham gia: <strong>{formatDate(learner.createdat, false)}</strong></span>
            <span><FiClock /> Đăng nhập gần nhất: <strong>{formatDate(learner.lastlogin)}</strong></span>
            {isPlus && <span><FiZap /> Plus còn <strong>{learner.plusdaysremaining} ngày</strong></span>}
          </div>
        </div>
      </section>

      <section className="admin-content-card admin-learner-plus-management">
        <form className="admin-plus-gift-box" onSubmit={giftPlus}>
          <div>
            <strong><FiGift /> Quản lý gói Plus</strong>
            <span>
              {isPlus
                ? `Đang còn ${learner.plusdaysremaining} ngày, hết hạn ${formatDate(learner.plusexpiresat, false)}. Số ngày tặng sẽ được cộng vào hạn hiện tại.`
                : 'Học viên đang dùng gói Free. Tặng ngày để kích hoạt Plus.'}
            </span>
          </div>
          <label className="admin-learner-plus-field">
            <span>Số ngày tặng</span>
            <input
              className="form-input"
              type="number"
              min="1"
              max="3650"
              step="1"
              value={plusDays}
              onChange={(event) => setPlusDays(event.target.value)}
              aria-label="Số ngày Plus muốn tặng"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={giftingPlus || !plusDays}>
            <FiGift /> {giftingPlus ? 'Đang tặng...' : 'Tặng Plus'}
          </button>
        </form>
      </section>

      <section className="admin-learner-metrics" aria-label="Tổng quan learner">
        <OverviewMetric icon={FiZap} label="EXP" value={Number(learner.exp || 0).toLocaleString('vi-VN')} detail={`Level ${learner.level || 1}`} />
        <OverviewMetric icon={FiAward} label="Streak" value={`${learner.streakdays || 0} ngày`} />
        <OverviewMetric icon={FiActivity} label="Ngày hoạt động" value={overview.activeDays || 0} />
        <OverviewMetric icon={FiClock} label="Tổng thời gian học" value={formatDuration(overview.totalStudySeconds)} detail={`${formatDuration(overview.studySeconds7d)} trong 7 ngày`} />
        <OverviewMetric icon={FiCheckCircle} label="Daily task đã xong" value={overview.completedDailyTasks || 0} />
        <OverviewMetric icon={FiBookOpen} label="Học phần đã tạo" value={overview.ownedCollections || 0} />
      </section>

      <section className="admin-learner-section">
        <div className="admin-learner-section-head">
          <div><span>TIẾN ĐỘ HỌC TẬP</span><h2>Khóa học và hoạt động</h2></div>
        </div>
        <div className="admin-learner-module-grid">
          {modules.map((module) => {
            const meta = moduleMeta[module.key] || moduleMeta.reading;
            const Icon = meta.icon;
            return (
              <article key={module.key} className="admin-learner-module-card" style={{ '--module-color': meta.color }}>
                <div className="admin-learner-module-title"><Icon /><strong>{meta.label}</strong><span>{module.completionPercent}%</span></div>
                <div className="admin-learner-progress"><i style={{ width: `${module.completionPercent}%` }} /></div>
                <div className="admin-learner-module-stats">
                  <span><b>{module.completed}</b>/{module.total} hoàn thành</span>
                  <span>Điểm TB <b>{module.averageScore}%</b></span>
                </div>
                <small>{module.lastActivityAt ? `Học gần nhất ${formatDate(module.lastActivityAt)}` : 'Chưa có hoạt động'}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="admin-learner-section">
        <div className="admin-learner-section-head">
          <div><span>SPACED REPETITION</span><h2>Trạng thái ghi nhớ SM-2</h2></div>
          <p>{srSummary.lastReviewedAt ? `Lần ôn gần nhất ${formatDate(srSummary.lastReviewedAt)}` : 'Chưa có lượt ôn nào'}</p>
        </div>
        <div className="admin-learner-sr-metrics">
          <OverviewMetric icon={FiBookOpen} label="Nội dung theo dõi" value={srSummary.totalItems || 0} />
          <OverviewMetric icon={FiCheckCircle} label="Đã ôn" value={srSummary.reviewedItems || 0} />
          <OverviewMetric icon={FiTarget} label="Thành thạo" value={srSummary.masteredItems || 0} detail="Đã từng đạt 100%" />
          <OverviewMetric icon={FiClock} label="Đến hạn" value={srSummary.dueItems || 0} detail={`${srSummary.overdueItems || 0} quá hạn`} />
          <OverviewMetric icon={FiTrendingUp} label="Ease factor TB" value={Number(srSummary.averageEaseFactor || 0).toFixed(2)} />
          <OverviewMetric icon={FiRefreshCw} label="Số lần quên" value={srSummary.totalLapses || 0} />
        </div>
      </section>

      <div className="admin-learner-two-column">
        <section className="admin-content-card admin-learner-table-panel">
          <div className="admin-subpanel-head"><div><h3>SM-2 theo nội dung</h3><p>Khối lượng ôn và độ ổn định theo module.</p></div><FiTarget /></div>
          <div className="admin-table-wrap">
            <table>
              <thead><tr><th>Kỹ năng</th><th>Đã ôn</th><th>Đến hạn</th><th>Quá hạn</th><th>Điểm TB</th></tr></thead>
              <tbody>
                {(spacedRepetition.byType || []).map((row) => (
                  <tr key={row.targettype}>
                    <td><strong>{targetTypeLabels[row.targettype] || row.targettype}</strong></td>
                    <td>{row.reviewed}/{row.total}</td><td>{row.due}</td><td>{row.overdue}</td><td>{row.averagescore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(spacedRepetition.byType || []).length === 0 && <div className="admin-empty-inline">Chưa có dữ liệu SM-2.</div>}
          </div>
        </section>

        <section className="admin-content-card admin-learner-table-panel">
          <div className="admin-subpanel-head"><div><h3>Review gần đây</h3><p>15 lần chấm gần nhất.</p></div><FiActivity /></div>
          <div className="admin-learner-review-list">
            {(spacedRepetition.recentReviews || []).map((review, index) => (
              <article key={`${review.reviewedat}-${index}`}>
                <div><strong>{review.targettitle}</strong><span>{targetTypeLabels[review.targettype] || review.targettype} · {formatDate(review.reviewedat)}</span></div>
                <div className="admin-learner-review-score"><strong>{review.score}%</strong><span>{qualityLabel(review.quality)} · {review.nextintervaldays} ngày</span></div>
              </article>
            ))}
            {(spacedRepetition.recentReviews || []).length === 0 && <div className="admin-empty-inline">Chưa có lượt review.</div>}
          </div>
        </section>
      </div>

      <div className="admin-learner-two-column">
        <section className="admin-content-card admin-learner-table-panel">
          <div className="admin-subpanel-head"><div><h3>Bài học đã bắt đầu</h3><p>Tiến độ gần nhất trong 4 kỹ năng.</p></div><FiBookOpen /></div>
          <div className="admin-table-wrap">
            <table>
              <thead><tr><th>Kỹ năng</th><th>Bài học</th><th>Điểm</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {recentLessons.map((lesson) => (
                  <tr key={`${lesson.skill}-${lesson.id}`}>
                    <td>{moduleMeta[lesson.skill]?.label || lesson.skill}</td><td><strong>{lesson.title}</strong></td><td>{Math.round(Number(lesson.score || 0))}%</td>
                    <td><span className={`admin-status-chip ${lesson.status === 'completed' ? 'is-active' : 'is-locked'}`}>{lesson.status === 'completed' ? 'Completed' : 'In progress'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentLessons.length === 0 && <div className="admin-empty-inline">Học viên chưa bắt đầu bài học.</div>}
          </div>
        </section>

        <section className="admin-content-card admin-learner-table-panel">
          <div className="admin-subpanel-head"><div><h3>Daily task 7 ngày</h3><p>Mức độ duy trì kế hoạch học.</p></div><FiCalendar /></div>
          <div className="admin-table-wrap">
            <table>
              <thead><tr><th>Ngày</th><th>Hoàn thành</th><th>Tỷ lệ</th><th>EXP</th></tr></thead>
              <tbody>
                {dailyActivity.map((day) => {
                  const percent = Number(day.assigned) > 0 ? Math.round((Number(day.completed) / Number(day.assigned)) * 100) : 0;
                  return <tr key={day.taskdate}><td>{formatDate(day.taskdate, false)}</td><td>{day.completed}/{day.assigned}</td><td>{percent}%</td><td>+{day.earnedexp}</td></tr>;
                })}
              </tbody>
            </table>
            {dailyActivity.length === 0 && <div className="admin-empty-inline">Chưa có daily task trong 7 ngày.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLearnerDetail;
