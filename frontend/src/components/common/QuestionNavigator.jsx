import { FiCheckCircle, FiCircle, FiXCircle } from 'react-icons/fi';

const QuestionNavigator = ({
  total,
  current,
  onSelect,
  getStatus = () => 'todo',
  title = 'Cau hoi',
  summary
}) => {
  const items = Array.from({ length: total }, (_, index) => {
    const status = getStatus(index);
    return { index, status };
  });

  const getIcon = (status) => {
    if (status === 'correct' || status === 'passed') return <FiCheckCircle />;
    if (status === 'wrong' || status === 'failed') return <FiXCircle />;
    if (status === 'answered') return <FiCheckCircle />;
    return <FiCircle />;
  };

  return (
    <aside className="question-navigator" aria-label="Chon cau hoi">
      <div className="question-navigator-head">
        <span>{title}</span>
        {summary && <strong>{summary}</strong>}
      </div>
      <div className="question-navigator-grid">
        {items.map(({ index, status }) => (
          <button
            key={index}
            type="button"
            className={`question-nav-item is-${status} ${current === index ? 'is-active' : ''}`}
            onClick={() => onSelect(index)}
            aria-current={current === index ? 'true' : undefined}
            aria-label={`Cau ${index + 1}`}
          >
            <span>{index + 1}</span>
            {getIcon(status)}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default QuestionNavigator;
