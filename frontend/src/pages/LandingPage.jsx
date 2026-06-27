import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiMic,
  FiPlayCircle,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './LandingPage.css';

const courseCards = [
  {
    icon: <FiBookOpen />,
    title: 'Khóa học kỹ năng',
    text: 'Luyện Reading, Writing, Listening và Speaking theo từng nhóm bài học rõ ràng.',
    image: '/landing/features/skill-lessons.png'
  },
  {
    icon: <FiMic />,
    title: 'Speaking Plus',
    text: 'Ghi âm câu trả lời, luyện phản xạ nói và nhận gợi ý cải thiện phát âm.',
    image: '/landing/features/speaking.png'
  },
  {
    icon: <FiCheckCircle />,
    title: 'Từ vựng và ngữ pháp',
    text: 'Tra từ, lưu bộ sưu tập từ vựng và học các chủ điểm ngữ pháp thường gặp.',
    image: '/landing/features/dictionary.png'
  },
  {
    icon: <FiZap />,
    title: 'Mini game ôn tập',
    text: 'Ôn lại từ vựng và mẫu câu bằng các lượt chơi ngắn, dễ duy trì mỗi ngày.',
    image: '/landing/features/mini-game.png'
  }
];

const learningTracks = [
  {
    icon: <FiBookOpen />,
    title: 'Học theo lộ trình',
    text: 'Bắt đầu từ onboarding, chọn mục tiêu học và đi tiếp bằng dashboard cá nhân.'
  },
  {
    icon: <FiPlayCircle />,
    title: 'Thực hành mỗi ngày',
    text: 'Bài học ngắn, nhiệm vụ hằng ngày và mini game giúp duy trì nhịp học đều.'
  },
  {
    icon: <FiCheckCircle />,
    title: 'Theo dõi tiến độ',
    text: 'LingoConnect ghi nhận thời gian học, tiến độ kỹ năng và kết quả luyện tập.'
  }
];

const contentHighlights = [
  {
    icon: <FiBookOpen />,
    title: 'Bài đọc và bài nghe',
    text: 'Nội dung được chia theo kỹ năng, có câu hỏi kiểm tra mức hiểu sau mỗi bài.'
  },
  {
    icon: <FiMic />,
    title: 'Nói và viết',
    text: 'Luyện trả lời, ghi âm, viết đoạn ngắn và nhận phản hồi để cải thiện đầu ra.'
  },
  {
    icon: <FiZap />,
    title: 'Ôn tập chủ động',
    text: 'Từ điển, bộ sưu tập từ vựng, grammar và game được gom trong cùng hệ thống.'
  }
];

const stats = [
  ['4+', 'kỹ năng chính'],
  ['Daily', 'nhiệm vụ học'],
  ['Plus', 'luyện nói AI']
];

function LandingPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const appPath = user
    ? (isAdmin ? '/admin' : (user.onboardingCompleted === false ? '/onboarding' : '/dashboard'))
    : '/register';
  const secondaryPath = user ? appPath : '/login';
  const coursesPath = user ? '/courses' : '/register';

  return (
    <div className="landing-page">
      <header className="landing-nav" aria-label="Điều hướng chính">
        <Link className="landing-brand" to="/">
          <span className="landing-brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <strong>LingoConnect</strong>
        </Link>

        <nav className="landing-links" aria-label="Các phần trên landing page">
          <a href="#home">Home</a>
          <a href="#courses">Khóa học</a>
          <a href="#content">Nội dung</a>
          <a href="#start">Bắt đầu</a>
        </nav>

        <div className="landing-nav-actions">
          <Link className="landing-login" to={secondaryPath}>
            {user ? 'Vào học' : 'Đăng nhập'}
          </Link>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-hero-media" aria-hidden="true">
            <img src="/landing/hero-study.png" alt="" />
          </div>
          <div className="landing-wash" aria-hidden="true" />

          <figure className="landing-study-showcase">
            <img src="/landing/features/skill-lessons.png" alt="Các khóa học tiếng Anh trên LingoConnect" />
            <figcaption>
              <strong>Lộ trình học</strong>
              <span>Reading, Writing, Listening, Speaking</span>
            </figcaption>
          </figure>

          <motion.div
            className="landing-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <span className="landing-kicker">LingoConnect English Learning</span>
            <h1>
              Học tiếng Anh
              <span>có lộ trình</span>
            </h1>
            <p className="landing-subtitle">
              LingoConnect giúp người học luyện tiếng Anh theo kỹ năng, theo dõi tiến độ,
              ôn tập từ vựng và duy trì thói quen học mỗi ngày trên một nền tảng duy nhất.
            </p>

            <div className="landing-cta-row">
              <Link className="landing-primary" to={appPath}>
                {user ? 'Tiếp tục học' : 'Bắt đầu học'}
                <FiArrowRight />
              </Link>
              <Link className="landing-secondary" to={coursesPath}>
                <FiPlayCircle />
                Xem khóa học
              </Link>
            </div>

            <div className="landing-stat-row" aria-label="Tổng quan LingoConnect">
              {stats.map(([value, label]) => (
                <span key={label}>
                  <strong>{value}</strong>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="landing-courses" id="courses">
          <div className="landing-section-head">
            <span>Khóa học</span>
            <h2>Lộ trình học tập trung vào kỹ năng và khả năng sử dụng tiếng Anh thật.</h2>
          </div>
          <div className="landing-track-grid">
            {learningTracks.map((track) => (
              <article key={track.title}>
                {track.icon}
                <strong>{track.title}</strong>
                <p>{track.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-skills" id="content">
          <div className="landing-section-head">
            <span>Nội dung học</span>
            <h2>Các module chính của LingoConnect được thiết kế để học và ôn tập liên tục.</h2>
          </div>

          <div className="landing-feature-grid">
            {courseCards.map((course, index) => (
              <motion.article
                className="landing-feature-card"
                key={course.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <img src={course.image} alt="" />
                <span>{course.icon}</span>
                <h3>{course.title}</h3>
                <p>{course.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="landing-content">
          <div className="landing-section-head">
            <span>Trong một nền tảng</span>
            <h2>Từ bài học, từ điển, nhiệm vụ ngày đến game ôn tập đều kết nối với tiến độ học.</h2>
          </div>
          <div className="landing-content-grid">
            {contentHighlights.map((item) => (
              <article key={item.title}>
                {item.icon}
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-final" id="start">
          <div>
            <span>Bắt đầu</span>
            <h2>Sẵn sàng học tiếng Anh với LingoConnect?</h2>
          </div>
          <Link className="landing-primary" to={appPath}>
            Mở LingoConnect
            <FiArrowRight />
          </Link>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
