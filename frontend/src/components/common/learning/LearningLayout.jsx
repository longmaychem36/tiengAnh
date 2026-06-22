import {
  FiArrowLeft,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiHash,
  FiTarget
} from 'react-icons/fi';
import { confirmUnsavedProgressExit } from '../../../utils/confirmExit';

const clampPercent = (value) => {
  const numeric = Number(value || 0);
  if (Number.isNaN(numeric)) return 0;
  return Math.min(100, Math.max(0, Math.round(numeric)));
};

export const LearningLayout = ({
  accent = '#2563EB',
  header,
  leftPanel,
  centerPanel,
  navigator,
  className = ''
}) => (
  <div className={`learning-session ${className}`} style={{ '--learning-accent': accent }}>
    {header}
    <div className="learning-layout-grid">
      <div className="learning-layout-left">{leftPanel}</div>
      <div className="learning-layout-center">{centerPanel}</div>
      <div className="learning-layout-navigator">{navigator}</div>
    </div>
  </div>
);

export const LessonHeader = ({
  title,
  subtitle,
  level,
  topic,
  progress = 0,
  answered = 0,
  total = 0,
  score = '--',
  duration = '--',
  backLabel = 'Về khóa học',
  onBack,
  confirmOnBack = false,
  actions
}) => {
  const safeProgress = clampPercent(progress);
  const handleBack = async () => {
    if (confirmOnBack && !(await confirmUnsavedProgressExit())) return;
    onBack?.();
  };

  return (
    <header className="lesson-header">
      <div className="lesson-header-top">
        {onBack && (
          <button type="button" className="lesson-back-button" onClick={handleBack}>
            <FiArrowLeft />
            <span>{backLabel}</span>
          </button>
        )}
        {actions && <div className="lesson-header-actions">{actions}</div>}
      </div>

      <div className="lesson-header-main">
        <div className="lesson-title-block">
          <div className="lesson-tag-row">
            {level && <span className="lesson-level-tag">{level}</span>}
            {topic && <span className="lesson-topic-tag">{topic}</span>}
          </div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <div className="lesson-header-stats">
          <div className="lesson-stat">
            <FiTarget />
            <span>Tiến độ</span>
            <strong>{safeProgress}%</strong>
          </div>
          <div className="lesson-stat">
            <FiHash />
            <span>Câu</span>
            <strong>{answered}/{total}</strong>
          </div>
          <div className="lesson-stat">
            <FiBarChart2 />
            <span>Đạt</span>
            <strong>{score}</strong>
          </div>
          <div className="lesson-stat">
            <FiClock />
            <span>TG</span>
            <strong>{duration}</strong>
          </div>
        </div>
      </div>

      <div className="lesson-progress-track" aria-hidden="true">
        <span style={{ width: `${safeProgress}%` }} />
      </div>
    </header>
  );
};

export const LessonCard = ({
  title,
  eyebrow,
  action,
  children,
  className = '',
  as: Component = 'section'
}) => (
  <Component className={`lesson-card ${className}`}>
    {(title || eyebrow || action) && (
      <div className="lesson-card-header">
        <div>
          {eyebrow && <span>{eyebrow}</span>}
          {title && <h2>{title}</h2>}
        </div>
        {action && <div className="lesson-card-action">{action}</div>}
      </div>
    )}
    {children}
  </Component>
);

export const PrimaryButton = ({ children, className = '', type = 'button', ...props }) => (
  <button type={type} className={`learning-btn learning-btn-primary ${className}`} {...props}>
    {children}
  </button>
);

export const SecondaryButton = ({ children, className = '', type = 'button', ...props }) => (
  <button type={type} className={`learning-btn learning-btn-secondary ${className}`} {...props}>
    {children}
  </button>
);

export const GhostButton = ({ children, className = '', type = 'button', ...props }) => (
  <button type={type} className={`learning-btn learning-btn-ghost ${className}`} {...props}>
    {children}
  </button>
);

export const QuestionCard = ({
  badge,
  prompt,
  status,
  icon,
  children,
  footer,
  className = ''
}) => (
  <article className={`question-card ${status ? `is-${status}` : ''} ${className}`}>
    <div className="question-card-top">
      {badge && <span className="question-badge">{badge}</span>}
      {icon && <span className="question-state-icon">{icon}</span>}
    </div>
    {prompt && <h2>{prompt}</h2>}
    <div className="question-card-body">{children}</div>
    {footer && <div className="question-card-footer">{footer}</div>}
  </article>
);

export const ScorePill = ({ passed, children }) => (
  <span className={`learning-score-pill ${passed ? 'is-pass' : 'is-fail'}`}>
    <FiCheckCircle />
    {children}
  </span>
);
