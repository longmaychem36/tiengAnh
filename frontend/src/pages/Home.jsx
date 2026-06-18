import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiHeadphones,
  FiMic,
  FiPenTool,
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import '../styles/homeLanding.css';

const featureCards = [
  {
    icon: <FiBookOpen />,
    title: 'Học theo kỹ năng',
    desc: 'Nghe, nói, đọc, viết được chia thành các phiên ngắn để người mới không bị quá tải.',
    image: '/landing/features/skill-lessons.png',
    tone: 'green'
  },
  {
    icon: <FiMic />,
    title: 'Luyện nói có ngữ cảnh',
    desc: 'Chọn tình huống quen thuộc, nghe câu mẫu, ghi âm và luyện phản xạ từng câu.',
    image: '/landing/features/speaking.png',
    tone: 'sky'
  },
  {
    icon: <FiSearch />,
    title: 'Từ điển đi cùng bài học',
    desc: 'Tra nghĩa, nghe phát âm và lưu từ mới vào bộ sưu tập cá nhân ngay khi đang học.',
    image: '/landing/features/dictionary.png',
    tone: 'mint'
  },
  {
    icon: <FiZap />,
    title: 'Ôn lại bằng mini game',
    desc: 'Biến phần ôn từ vựng và mẫu câu thành các lượt chơi ngắn, dễ quay lại mỗi ngày.',
    image: '/landing/features/mini-game.png',
    tone: 'lime'
  }
];

const rhythmSteps = [
  {
    icon: <FiTarget />,
    title: 'Chọn mục tiêu hôm nay',
    desc: 'Bắt đầu từ kỹ năng cần cải thiện nhất, không phải từ một danh sách bài học dài.'
  },
  {
    icon: <FiHeadphones />,
    title: 'Học trong một phiên ngắn',
    desc: 'Mỗi phiên gom nghe mẫu, trả lời nhanh và luyện lại điểm còn yếu.'
  },
  {
    icon: <FiTrendingUp />,
    title: 'Theo dõi tiến bộ',
    desc: 'Điểm kinh nghiệm, streak và lịch sử học giúp bạn biết nên tiếp tục ở đâu.'
  }
];

const proofItems = [
  'Lộ trình rõ cho người mới bắt đầu',
  'Nội dung học, tra từ và luyện tập nằm cùng một nơi',
  'Thiết kế cho lịch học ngắn mỗi ngày'
];

function Home() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const primaryPath = user ? (isAdmin ? '/admin' : '/dashboard') : '/register';
  const primaryText = user ? (isAdmin ? 'Vào trang quản trị' : 'Vào bảng học tập') : 'Bắt đầu miễn phí';
  const heroCopyMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: 'easeOut' }
      };
  const heroMediaMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.7, delay: 0.12, ease: 'easeOut' }
      };

  return (
    <main className="landing-page" id="main-content">
      <a className="landing-skip-link" href="#landing-content">Bỏ qua phần điều hướng</a>

      <nav className="landing-nav" aria-label="Điều hướng trang chủ">
        <Link className="landing-brand" to="/" aria-label="LingoConnect trang chủ">
          <span className="landing-brand-mark">LC</span>
          <span>LingoConnect</span>
        </Link>
        <div className="landing-nav-actions">
          {!user && <Link to="/login" className="landing-link-button">Đăng nhập</Link>}
          <Link to={primaryPath} className="landing-button landing-button-primary landing-button-small">
            {primaryText}
          </Link>
        </div>
      </nav>

      <div id="landing-content">
        <section className="landing-hero" aria-labelledby="landing-hero-title">
          <div className="landing-hero-copy">
            <motion.div {...heroCopyMotion}>
              <p className="landing-kicker">Tiếng Anh cho người Việt mới bắt đầu</p>
              <h1 id="landing-hero-title">Học tiếng Anh từng bước, không bị lạc hướng.</h1>
              <p className="landing-hero-text">
                LingoConnect gom bài học, từ điển, luyện nói và mini game vào một lộ trình dễ theo.
              </p>
              <div className="landing-hero-actions">
                <Link to={primaryPath} className="landing-button landing-button-primary">
                  {primaryText}
                  <FiArrowRight aria-hidden="true" />
                </Link>
                {!user && (
                  <Link to="/login" className="landing-button landing-button-secondary">
                    Đăng nhập
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="landing-hero-media"
            {...heroMediaMotion}
          >
            <img
              src="/landing/hero-study.png"
              alt="Người học tiếng Anh tại bàn học với laptop, sổ tay và tai nghe"
            />
            <div className="landing-lesson-panel" aria-label="Tóm tắt phiên học mẫu">
              <div>
                <span>Phiên học hôm nay</span>
                <strong>Nghe mẫu rồi nói lại</strong>
              </div>
              <div className="landing-lesson-progress" aria-hidden="true">
                <span />
              </div>
              <p>Hoàn thành trong khoảng 10 phút</p>
            </div>
          </motion.div>
        </section>

        <section className="landing-proof" aria-label="Điểm nổi bật của LingoConnect">
          {proofItems.map((item) => (
            <div key={item} className="landing-proof-item">
              <FiCheckCircle aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </section>

        <section className="landing-path" id="learning-path" aria-labelledby="learning-path-title">
          <div className="landing-section-copy">
            <p className="landing-kicker">Cách học</p>
            <h2 id="learning-path-title">Một nơi cho toàn bộ buổi học.</h2>
            <p>
              Bạn không cần chuyển qua nhiều công cụ. Bài học, tra từ, luyện phát âm và ôn tập nằm trong cùng một dòng học.
            </p>
          </div>

          <div className="landing-path-grid">
            <article className="landing-path-card landing-path-card-large">
              <FiClock aria-hidden="true" />
              <h3>10 phút vẫn đủ để tiến lên</h3>
              <p>
                Mỗi phiên học tập trung vào một mục tiêu nhỏ để bạn có thể học đều ngay cả khi bận.
              </p>
            </article>
            <article className="landing-path-card">
              <FiPenTool aria-hidden="true" />
              <h3>Viết lại điều vừa học</h3>
              <p>Chuyển mẫu câu thành câu của bạn để nhớ lâu hơn.</p>
            </article>
            <article className="landing-path-card">
              <FiHeadphones aria-hidden="true" />
              <h3>Nghe trước khi nói</h3>
              <p>Làm quen nhịp câu, sau đó ghi âm và luyện phản xạ.</p>
            </article>
          </div>
        </section>

        <section className="landing-features" id="features" aria-labelledby="features-title">
          <div className="landing-section-copy landing-section-copy-wide">
            <h2 id="features-title">Tính năng phục vụ việc học thật.</h2>
            <p>
              Mỗi khối trong hệ thống có một nhiệm vụ rõ ràng: bắt đầu dễ hơn, luyện tập đều hơn và biết mình đang tiến bộ ra sao.
            </p>
          </div>

          <div className="landing-feature-grid">
            {featureCards.map((feature, index) => (
              <motion.article
                key={feature.title}
                className={`landing-feature-card is-${feature.tone}`}
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 22 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: '-80px' },
                      transition: { duration: 0.45, delay: index * 0.06, ease: 'easeOut' }
                    })}
              >
                <div className="landing-feature-image">
                  <img src={feature.image} alt="" aria-hidden="true" />
                </div>
                <div className="landing-feature-body">
                  <span className="landing-feature-icon">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="landing-rhythm" id="daily-rhythm" aria-labelledby="daily-rhythm-title">
          <div className="landing-rhythm-media">
            <img src="/landing/features/study-rhythm.png" alt="Bộ thẻ học, tai nghe và bảng tiến độ trong giao diện học tiếng Anh" />
          </div>
          <div className="landing-rhythm-copy">
            <h2 id="daily-rhythm-title">Giữ nhịp học mỗi ngày.</h2>
            <p>
              LingoConnect chia việc học thành các hành động nhỏ để bạn quay lại dễ hơn sau mỗi ngày.
            </p>
            <div className="landing-rhythm-list">
              {rhythmSteps.map((step) => (
                <article key={step.title} className="landing-rhythm-item">
                  <span>{step.icon}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta" aria-labelledby="landing-cta-title">
          <div>
            <h2 id="landing-cta-title">Bắt đầu với một phiên học ngắn.</h2>
            <p>
              Tạo tài khoản và đi qua bài học đầu tiên. Khi quay lại, hệ thống giữ lại tiến độ để bạn tiếp tục đúng chỗ.
            </p>
          </div>
          <Link to={primaryPath} className="landing-button landing-button-primary landing-button-on-dark">
            {primaryText}
            <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </div>

      <footer className="landing-footer">
        <span>LingoConnect</span>
        <span>Nền tảng học tiếng Anh cho người Việt.</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

export default Home;
