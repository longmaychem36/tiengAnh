// ============================================
// Admin Dashboard — Overview & Statistics
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers, FiPlay, FiMic, FiEdit3,
  FiBookOpen, FiArrowRight, FiTrendingUp,
  FiUserPlus, FiLayers, FiHeadphones
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const statCards = [
    { icon: <FiUsers size={22} />, label: 'Tổng người dùng', value: stats?.totalUsers || 0, sub: `${stats?.activeUsers || 0} đang hoạt động`, color: '#6366f1', bg: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    { icon: <FiUserPlus size={22} />, label: 'User mới (7 ngày)', value: stats?.newUsers7d || 0, sub: 'đăng ký gần đây', color: '#10b981', bg: 'linear-gradient(135deg, #10b981, #34d399)' },
    { icon: <FiLayers size={22} />, label: 'Bài kỹ năng', value: stats?.totalSkillLessons || 0, sub: 'nghe, nói, đọc, viết', color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
    { icon: <FiPlay size={22} />, label: 'Mini Games', value: stats?.totalGameSets || 0, sub: `${stats?.totalGameLevels || 0} levels · ${stats?.totalQuestions || 0} câu hỏi`, color: '#ec4899', bg: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  ];

  const contentCards = [
    { icon: <FiHeadphones size={20} />, label: 'Listening', count: stats?.totalListeningLessons || 0, sub: `${stats?.totalListeningQuestions || 0} câu hỏi`, to: '/admin/listening', color: '#0e7490' },
    { icon: <FiBookOpen size={20} />, label: 'Reading', count: stats?.totalReadingLessons || 0, sub: `${stats?.totalReadingQuestions || 0} câu hỏi`, to: '/admin/reading', color: '#7c3aed' },
    { icon: <FiMic size={20} />, label: 'Speaking', count: stats?.totalSpeakingLessons || 0, sub: `${stats?.totalSpeakingQuestions || 0} câu hỏi`, to: '/admin/speaking', color: '#f59e0b' },
    { icon: <FiEdit3 size={20} />, label: 'Writing', count: stats?.totalWritingLessons || 0, sub: `${stats?.totalWritingExercises || 0} bài tập`, to: '/admin/writing', color: '#10b981' },
    { icon: <FiBookOpen size={20} />, label: 'Grammar', count: stats?.totalGrammarCategories || 0, sub: `${stats?.totalGrammarTopics || 0} chủ đề`, to: '/admin/grammar', color: '#6366f1' },
    { icon: <FiPlay size={20} />, label: 'Mini Games', count: stats?.totalGameSets || 0, sub: `${stats?.totalGameLevels || 0} levels`, to: '/admin/games', color: '#ec4899' },
  ];

  const quickActions = [
    { icon: <FiHeadphones size={18} />, label: 'Quản lý Listening', desc: 'Bài nghe, transcript, từ vựng & câu hỏi', to: '/admin/listening', color: '#0e7490' },
    { icon: <FiBookOpen size={18} />, label: 'Quản lý Reading', desc: 'Bài đọc, đoạn văn, từ vựng & câu hỏi', to: '/admin/reading', color: '#7c3aed' },
    { icon: <FiMic size={18} />, label: 'Quản lý Speaking', desc: 'Quản lý bài & câu hỏi speaking', to: '/admin/speaking', color: '#f59e0b' },
    { icon: <FiEdit3 size={18} />, label: 'Quản lý Writing', desc: 'Quản lý bài & bài tập writing', to: '/admin/writing', color: '#10b981' },
    { icon: <FiBookOpen size={18} />, label: 'Quản lý Grammar', desc: 'Danh mục, chủ đề & quiz grammar', to: '/admin/grammar', color: '#6366f1' },
    { icon: <FiPlay size={18} />, label: 'Quản lý Mini Games', desc: 'Game sets, levels & câu hỏi', to: '/admin/games', color: '#ec4899' },
    ...(user?.role === 'superadmin' ? [{ icon: <FiUsers size={18} />, label: 'Quản lý người dùng', desc: 'Phân quyền & khóa tài khoản', to: '/admin/users', color: '#ef4444' }] : []),
  ];

  return (
    <div>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-welcome-card"
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem',
              background: 'rgba(255,255,255,0.2)', fontWeight: 600
            }}>
              {user?.role === 'superadmin' ? '👑 Super Admin' : '🛡️ Admin'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            Xin chào, {user?.username}!
          </h1>
          <p style={{ opacity: 0.85, fontSize: '0.95rem' }}>
            Đây là tổng quan hệ thống quản lý của bạn.
          </p>
        </div>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: -30, bottom: -30,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)'
        }} />
        <div style={{
          position: 'absolute', right: 80, top: -20,
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-4" style={{ gap: '16px', marginBottom: '28px' }}>
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="admin-stat-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: card.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', boxShadow: `0 4px 12px ${card.color}30`
              }}>
                {card.icon}
              </div>
              <FiTrendingUp size={16} style={{ color: card.color, opacity: 0.6 }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {card.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Overview */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--color-text)' }}>
          📊 Tổng quan nội dung
        </h2>
        <div className="grid grid-4" style={{ gap: '14px' }}>
          {contentCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <Link to={card.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="admin-content-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '10px',
                      background: `${card.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: card.color
                    }}>
                      {card.icon}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{card.label}</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: card.color }}>
                    {card.count}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {card.sub}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.75rem', color: card.color, marginTop: '8px', fontWeight: 600
                  }}>
                    Quản lý <FiArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--color-text)' }}>
          ⚡ Truy cập nhanh
        </h2>
        <div className="grid grid-3" style={{ gap: '14px' }}>
          {quickActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
            >
              <Link to={action.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="admin-action-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '10px',
                      background: `${action.color}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: action.color, flexShrink: 0
                    }}>
                      {action.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>
                        {action.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {action.desc}
                      </div>
                    </div>
                    <FiArrowRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
