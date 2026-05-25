// ============================================
// Home Page - Vietnamese Landing Page
// ============================================
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiHeadphones,
  FiMic,
  FiSearch,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const skillCards = [
  {
    icon: <FiBookOpen />,
    title: 'Học theo bài',
    desc: 'Bài học ngắn, có mục tiêu rõ để người mới không bị ngợp.',
    accent: '#0f766e'
  },
  {
    icon: <FiMic />,
    title: 'Luyện nói',
    desc: 'Chọn tình huống, nghe mẫu, ghi âm và luyện phản xạ từng câu.',
    accent: '#b45309'
  },
  {
    icon: <FiSearch />,
    title: 'Từ điển Anh - Việt',
    desc: 'Tra nghĩa, phát âm và lưu từ mới vào bộ sưu tập cá nhân.',
    accent: '#0e7490'
  },
  {
    icon: <FiZap />,
    title: 'Mini game',
    desc: 'Ôn từ vựng bằng trò chơi nghe, ghép nghĩa và sắp xếp câu.',
    accent: '#be123c'
  }
];

const steps = [
  'Chọn kỹ năng muốn cải thiện',
  'Học 10-15 phút mỗi ngày',
  'Làm bài luyện tập và nhận điểm kinh nghiệm',
  'Theo dõi tiến bộ để biết nên học gì tiếp'
];

const stats = [
  { value: '4 kỹ năng', label: 'Từ vựng, nghe, nói, viết' },
  { value: '10 phút', label: 'Phù hợp lịch học mỗi ngày' },
  { value: 'Có lộ trình', label: 'Dễ bắt đầu cho người mới' }
];

function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const primaryPath = user ? (isAdmin ? '/admin' : '/dashboard') : '/register';
  const primaryText = user ? (isAdmin ? 'Vào trang quản trị' : 'Vào bảng học tập') : 'Bắt đầu miễn phí';

  return (
    <main style={{ minHeight: '100vh', background: '#f7fffb', color: '#20312f' }}>
      <section style={{
        minHeight: '92vh',
        display: 'grid',
        alignItems: 'center',
        padding: 'clamp(1.25rem, 4vw, 3rem)',
        background:
          'linear-gradient(180deg, rgba(247,255,251,0.96), rgba(236,253,245,0.82)), url("/skills/reading.jpg") center/cover',
        position: 'relative'
      }}>
        <div style={{
          width: 'min(1180px, 100%)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.03fr) minmax(320px, 0.72fr)',
          gap: 'clamp(1.5rem, 5vw, 4rem)',
          alignItems: 'center'
        }} className="home-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 13px',
              borderRadius: 999,
              background: '#e6fffb',
              color: '#0f5f55',
              fontWeight: 900,
              fontSize: 'var(--font-size-sm)',
              border: '1px solid #b7eadf'
            }}>
              <FiStar /> Dành cho người Việt mới học tiếng Anh
            </span>

            <h1 style={{
              maxWidth: 760,
              margin: '18px 0 16px',
              color: '#134e4a',
              fontSize: 'clamp(2.45rem, 6vw, 5.4rem)',
              lineHeight: 0.98,
              fontWeight: 900
            }}>
              Học tiếng Anh dễ bắt đầu, vui hơn mỗi ngày.
            </h1>

            <p style={{
              maxWidth: 640,
              color: '#405f5a',
              fontSize: 'clamp(1.05rem, 2vw, 1.28rem)',
              lineHeight: 1.7,
              fontWeight: 700
            }}>
              LingoConnect gom bài học, từ điển, luyện nói, luyện viết và mini game vào một nơi để bạn học từng bước mà không cần biết bắt đầu từ đâu.
            </p>

            <div style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 28
            }}>
              <Link to={primaryPath}>
                <button type="button" className="btn btn-primary btn-lg" style={{ minWidth: 188 }}>
                  {primaryText} <FiArrowRight />
                </button>
              </Link>
              {!user && (
                <Link to="/login">
                  <button type="button" className="btn btn-lg" style={{
                    minWidth: 136,
                    background: '#ffffff',
                    color: '#134e4a',
                    border: '1px solid #b7eadf',
                    boxShadow: '0 10px 24px rgba(15, 95, 85, 0.08)'
                  }}>
                    Đăng nhập
                  </button>
                </Link>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 12,
              marginTop: 34,
              maxWidth: 700
            }} className="home-stat-grid">
              {stats.map((item) => (
                <div key={item.value} style={{
                  padding: 16,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.84)',
                  border: '1px solid #ccefe5',
                  boxShadow: '0 12px 28px rgba(15, 95, 85, 0.07)'
                }}>
                  <strong style={{ display: 'block', color: '#134e4a', fontSize: '1.25rem' }}>{item.value}</strong>
                  <span style={{ color: '#647a75', fontSize: 'var(--font-size-sm)', fontWeight: 800 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            style={{
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid #ccefe5',
              borderRadius: 8,
              padding: 22,
              boxShadow: '0 24px 60px rgba(15, 95, 85, 0.14)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <span style={{ color: '#0f766e', fontWeight: 900, fontSize: 'var(--font-size-sm)' }}>Lộ trình hôm nay</span>
                <h2 style={{ marginTop: 4, fontSize: '1.65rem' }}>Bắt đầu từ nền tảng</h2>
              </div>
              <FiTarget style={{ width: 34, height: 34, color: '#0f766e' }} />
            </div>

            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              {[
                { icon: <FiHeadphones />, title: 'Nghe câu mẫu', desc: 'Làm quen âm và nhịp câu' },
                { icon: <FiMic />, title: 'Nói theo tình huống', desc: 'Tập trả lời ngắn, dễ dùng' },
                { icon: <FiTrendingUp />, title: 'Nhận EXP', desc: 'Theo dõi streak và tiến bộ' }
              ].map((item) => (
                <div key={item.title} style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr',
                  gap: 12,
                  alignItems: 'center',
                  padding: 14,
                  borderRadius: 8,
                  background: '#f7fffb',
                  border: '1px solid #d8f4ec'
                }}>
                  <span style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: '#e6fffb',
                    color: '#0f766e'
                  }}>
                    {item.icon}
                  </span>
                  <span>
                    <strong style={{ display: 'block', color: '#134e4a' }}>{item.title}</strong>
                    <small style={{ color: '#647a75', fontWeight: 800 }}>{item.desc}</small>
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 8,
              background: '#fff7ed',
              color: '#6d421c',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <FiClock /> Hoàn thành trong khoảng 10 phút
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 3rem)' }}>
        <div style={{ width: 'min(1180px, 100%)', margin: '0 auto' }}>
          <div style={{ maxWidth: 680, marginBottom: 28 }}>
            <span style={{ color: '#0f766e', fontWeight: 900 }}>Học theo cách dễ tiếp cận</span>
            <h2 style={{ margin: '8px 0', fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>Mọi tính năng đều phục vụ việc học thật</h2>
            <p style={{ color: '#405f5a', lineHeight: 1.7, fontWeight: 700 }}>
              Không cần tải nhiều công cụ. Bạn có thể học bài mới, tra từ, luyện phát âm và ôn lại bằng game ngay trong cùng một hệ thống.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 16
          }} className="home-feature-grid">
            {skillCards.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                style={{
                  minHeight: 250,
                  padding: 20,
                  borderRadius: 8,
                  background: '#ffffff',
                  border: '1px solid #ccefe5',
                  boxShadow: '0 14px 34px rgba(15, 95, 85, 0.07)'
                }}
              >
                <span style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  background: `${feature.accent}16`,
                  color: feature.accent,
                  marginBottom: 18
                }}>
                  {feature.icon}
                </span>
                <h3 style={{ fontSize: '1.35rem', marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: '#647a75', lineHeight: 1.6, fontWeight: 700 }}>{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: 'clamp(3rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 3rem)',
        background: '#ffffff',
        borderTop: '1px solid #ccefe5',
        borderBottom: '1px solid #ccefe5'
      }}>
        <div style={{
          width: 'min(1180px, 100%)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '0.8fr 1fr',
          gap: 'clamp(1.5rem, 5vw, 4rem)',
          alignItems: 'center'
        }} className="home-steps-grid">
          <div>
            <span style={{ color: '#0f766e', fontWeight: 900 }}>Cho người mới</span>
            <h2 style={{ margin: '8px 0 14px', fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>Đi từng bước, không học lan man</h2>
            <p style={{ color: '#405f5a', lineHeight: 1.7, fontWeight: 700 }}>
              Mỗi ngày chỉ cần một phiên học ngắn. Hệ thống giúp bạn biết mình đang học gì, đã tiến bộ tới đâu và nên tiếp tục từ đâu.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {steps.map((step, index) => (
              <div key={step} style={{
                display: 'grid',
                gridTemplateColumns: '42px 1fr',
                gap: 14,
                alignItems: 'center',
                padding: 16,
                borderRadius: 8,
                background: '#f7fffb',
                border: '1px solid #ccefe5'
              }}>
                <span style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  background: '#0f766e',
                  color: '#ffffff',
                  fontWeight: 900
                }}>
                  {index + 1}
                </span>
                <strong style={{ color: '#134e4a', fontSize: '1.08rem' }}>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem, 7vw, 5.5rem) clamp(1.25rem, 4vw, 3rem)' }}>
        <div style={{
          width: 'min(960px, 100%)',
          margin: '0 auto',
          textAlign: 'center',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          borderRadius: 8,
          background: '#134e4a',
          color: '#ffffff',
          boxShadow: '0 24px 60px rgba(15, 95, 85, 0.18)'
        }}>
          <FiCheckCircle style={{ width: 42, height: 42, color: '#99f6e4', margin: '0 auto 14px' }} />
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 4vw, 3.1rem)', marginBottom: 12 }}>
            Sẵn sàng học tiếng Anh theo cách nhẹ hơn?
          </h2>
          <p style={{ maxWidth: 620, margin: '0 auto 24px', color: '#d8f4ec', lineHeight: 1.7, fontWeight: 700 }}>
            Tạo tài khoản và bắt đầu với bài học đầu tiên. Bạn có thể học thử ngay, sau đó quay lại luyện tiếp bất cứ lúc nào.
          </p>
          <Link to={primaryPath}>
            <button type="button" className="btn btn-lg" style={{
              background: '#ffffff',
              color: '#134e4a',
              minWidth: 200,
              boxShadow: '0 14px 30px rgba(0,0,0,0.16)'
            }}>
              {primaryText} <FiArrowRight />
            </button>
          </Link>
        </div>
      </section>

      <footer style={{
        padding: '24px clamp(1.25rem, 4vw, 3rem)',
        borderTop: '1px solid #ccefe5',
        color: '#647a75',
        textAlign: 'center',
        fontWeight: 800
      }}>
        © {new Date().getFullYear()} LingoConnect. Nền tảng học tiếng Anh cho người Việt.
      </footer>

      <style>{`
        .home-hero-grid,
        .home-steps-grid,
        .home-feature-grid,
        .home-stat-grid {
          min-width: 0;
        }

        @media (max-width: 960px) {
          .home-hero-grid,
          .home-steps-grid {
            grid-template-columns: 1fr !important;
          }

          .home-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .home-feature-grid,
          .home-stat-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

export default Home;
