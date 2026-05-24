import { useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const CourseGuide = ({ storageKey, title, description, steps }) => {
  const [visible, setVisible] = useState(() => {
    return localStorage.getItem(storageKey) !== 'seen';
  });

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'seen');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="course-guide">
      <div className="course-guide-head">
        <div>
          <span>Hướng dẫn làm bài</span>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <button type="button" className="btn btn-ghost btn-icon" onClick={handleDismiss} aria-label="Đóng hướng dẫn">
          <FiX />
        </button>
      </div>

      <div className="course-guide-steps">
        {steps.map((step, index) => (
          <div key={step} className="course-guide-step">
            <FiCheckCircle />
            <div>
              <strong>Bước {index + 1}</strong>
              <p>{step}</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-primary btn-sm" onClick={handleDismiss}>
        Đã hiểu
      </button>
    </section>
  );
};

export default CourseGuide;
