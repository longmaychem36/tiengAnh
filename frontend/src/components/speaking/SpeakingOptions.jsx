import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCpu, FiLock, FiMic, FiStar } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const bulletStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  color: 'var(--color-text)',
  fontSize: 'var(--font-size-base)',
  fontWeight: 600
};

const cardStyle = {
  padding: 'var(--space-8)',
  minHeight: 260,
  background: '#f8fafc',
  display: 'grid',
  gridTemplateColumns: '120px 1fr',
  alignItems: 'center',
  gap: 'var(--space-6)'
};

function SpeakingOptions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canUseAi = Boolean(user?.isPlus || user?.plan === 'plus');

  return (
    <div className="fade-in" style={{ maxWidth: 1060, margin: '0 auto', paddingBottom: 'var(--space-12)' }}>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')} style={{ marginBottom: 'var(--space-6)', padding: 0 }}>
        <FiArrowLeft /> Về khóa học
      </button>

      <div className="page-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1>Luyện nói</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card hover-scale"
          style={cardStyle}
          onClick={() => navigate('/speaking/lessons')}
        >
          <div>
            <div style={{ width: 112, height: 112, borderRadius: 28, background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <FiMic size={56} />
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={(event) => { event.stopPropagation(); navigate('/speaking/lessons'); }}>
              Khóa học
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={bulletStyle}><FiStar color="#f59e0b" fill="#f59e0b" /> Bài học theo lộ trình có sẵn</div>
            <div style={bulletStyle}><FiStar color="#f59e0b" fill="#f59e0b" /> Có câu hỏi, câu trả lời mẫu và nút nghe</div>
            <div style={bulletStyle}><FiStar color="#f59e0b" fill="#f59e0b" /> Ghi âm, nhận dạng giọng nói và chấm điểm</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="card hover-scale"
          style={cardStyle}
          onClick={() => navigate(canUseAi ? '/speaking/ai' : '/profile')}
        >
          <div>
            <div style={{ width: 112, height: 112, borderRadius: 28, background: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              {canUseAi ? <FiCpu size={56} /> : <FiLock size={56} />}
            </div>
            <button type="button" className={canUseAi ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'} onClick={(event) => { event.stopPropagation(); navigate(canUseAi ? '/speaking/ai' : '/profile'); }}>
              Truy cập
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={bulletStyle}><FiStar color="#f59e0b" fill="#f59e0b" /> Tự tạo hội thoại theo chủ đề</div>
            <div style={bulletStyle}><FiStar color="#f59e0b" fill="#f59e0b" /> Chọn độ khó và độ dài 5 hoặc 10 câu</div>
            <div style={bulletStyle}><FiStar color="#f59e0b" fill="#f59e0b" /> Lingo Coach phản hồi theo lịch sử hội thoại</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SpeakingOptions;
