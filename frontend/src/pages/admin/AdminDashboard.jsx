// ============================================
// Admin Dashboard — Minimal Overview
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiPlay, FiMic, FiEdit3,
  FiBookOpen, FiArrowRight, FiHeadphones,
  FiGrid
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
    { icon: <FiUsers size={18} />, label: 'Người dùng', value: stats?.totalUsers || 0, sub: `${stats?.activeUsers || 0} hoạt động` },
    { icon: <FiGrid size={18} />, label: 'Bài kỹ năng', value: stats?.totalSkillLessons || 0, sub: 'nghe · nói · đọc · viết' },
    { icon: <FiPlay size={18} />, label: 'Mini Game', value: stats?.totalGameLevels || 0, sub: `${stats?.totalQuestions || 0} câu hỏi` },
    { icon: <FiBookOpen size={18} />, label: 'Grammar', value: stats?.totalGrammarCategories || 0, sub: `${stats?.totalGrammarTopics || 0} chủ đề` },
  ];

  const contentLinks = [
    { icon: <FiHeadphones size={16} />, label: 'Listening', count: stats?.totalListeningLessons || 0, sub: `${stats?.totalListeningQuestions || 0} câu hỏi`, to: '/admin/listening' },
    { icon: <FiBookOpen size={16} />, label: 'Reading', count: stats?.totalReadingLessons || 0, sub: `${stats?.totalReadingQuestions || 0} câu hỏi`, to: '/admin/reading' },
    { icon: <FiMic size={16} />, label: 'Speaking', count: stats?.totalSpeakingLessons || 0, sub: `${stats?.totalSpeakingQuestions || 0} câu hỏi`, to: '/admin/speaking' },
    { icon: <FiEdit3 size={16} />, label: 'Writing', count: stats?.totalWritingLessons || 0, sub: `${stats?.totalWritingExercises || 0} bài tập`, to: '/admin/writing' },
    { icon: <FiBookOpen size={16} />, label: 'Grammar', count: stats?.totalGrammarCategories || 0, sub: `${stats?.totalGrammarTopics || 0} chủ đề`, to: '/admin/grammar' },
    { icon: <FiPlay size={16} />, label: 'Mini Games', count: stats?.totalGameLevels || 0, sub: `${stats?.totalQuestions || 0} câu hỏi`, to: '/admin/games' },
  ];

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#18181b', marginBottom: '4px' }}>
          Xin chào, {user?.username}
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#a1a1aa', margin: 0 }}>
          {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'} · Tổng quan hệ thống
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-4" style={{ gap: '12px', marginBottom: '24px' }}>
        {statCards.map((card, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#71717a' }}>
              {card.icon}
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#18181b', lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#a1a1aa', marginTop: '4px' }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Content Links */}
      <div>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Nội dung
        </h2>
        <div style={{ display: 'grid', gap: '1px', background: '#e5e7eb', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          {contentLinks.map((item, i) => (
            <Link key={i} to={item.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', background: '#fff',
                transition: 'background 100ms ease'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ color: '#a1a1aa', flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#18181b' }}>{item.label}</span>
                </div>
                <div style={{ textAlign: 'right', marginRight: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#18181b' }}>{item.count}</span>
                  <span style={{ fontSize: '0.6875rem', color: '#a1a1aa', marginLeft: '6px' }}>{item.sub}</span>
                </div>
                <FiArrowRight size={14} style={{ color: '#d4d4d8', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
