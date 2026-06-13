import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiLoader, FiPlay } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { onboardingApi } from '../api/onboardingApi';
import { useAuth } from '../hooks/useAuth';

const surveyOptions = [
  {
    value: 'new',
    icon: '/nav-icons/learn.svg',
    title: 'Tôi mới học tiếng Anh',
    text: 'Bắt đầu từ các bài nền tảng về chào hỏi, câu đơn và từ quen thuộc.'
  },
  {
    value: 'basic',
    icon: '/nav-icons/admin-speaking.svg',
    title: 'Tôi có thể hiểu và giao tiếp cơ bản',
    text: 'Bỏ qua bài nền tảng và vào lộ trình chính.'
  },
  {
    value: 'unsure',
    icon: '/nav-icons/admin-placement.svg',
    title: 'Tôi không chắc',
    text: 'Làm một bài kiểm tra ngắn để hệ thống xếp lộ trình phù hợp.'
  }
];

function mergePlacement(user, placement = {}) {
  return {
    ...user,
    onboardingCompleted: placement.onboardingCompleted ?? placement.placement?.onboardingCompleted ?? true,
    placementLevel: placement.placementLevel ?? placement.resultLevel ?? placement.placement?.placementLevel ?? user?.placementLevel,
    placementSource: placement.placementSource ?? placement.placement?.placementSource ?? user?.placementSource,
    placementCompletedAt: placement.placementCompletedAt ?? placement.placement?.placementCompletedAt ?? user?.placementCompletedAt
  };
}

function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const answeredCount = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);
  const totalQuestions = attempt?.questions?.length || 0;

  const finishWithPlacement = (payload) => {
    updateUser(mergePlacement(user, payload));
  };

  const handleSurvey = async (answer) => {
    setLoading(true);
    try {
      const res = await onboardingApi.submitSurvey(answer);
      if (res.data?.requiresTest) {
        const testRes = await onboardingApi.startTest();
        setAttempt(testRes.data);
        setAnswers({});
        setResult(null);
        return;
      }

      finishWithPlacement(res.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Không thể lưu khảo sát.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    if (!attempt || answeredCount < totalQuestions) {
      toast.error('Hãy trả lời đủ các câu trước khi nộp bài.');
      return;
    }

    setLoading(true);
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const res = await onboardingApi.submitTest(attempt.attemptId, payload);
      setResult(res.data);
      finishWithPlacement(res.data);
    } catch (err) {
      toast.error(err.message || 'Không thể nộp bài kiểm tra.');
    } finally {
      setLoading(false);
    }
  };

  const goDashboard = () => navigate('/dashboard', { replace: true });

  return (
    <div className="onboarding-page">
      <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="onboarding-shell">
        <div className="onboarding-brand">
          <span>L</span>
          <strong>LingoWeb</strong>
        </div>

        {!attempt && !result && (
          <>
            <section className="onboarding-head">
              <span>Thiết lập lộ trình</span>
              <h1>Bạn đang ở mức nào?</h1>
            </section>

            <div className="onboarding-choice-grid">
              {surveyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="onboarding-choice"
                  onClick={() => handleSurvey(option.value)}
                  disabled={loading}
                >
                  <span><img src={option.icon} alt="" aria-hidden="true" /></span>
                  <strong>{option.title}</strong>
                  <small>{option.text}</small>
                </button>
              ))}
            </div>
          </>
        )}

        {attempt && !result && (
          <>
            <section className="onboarding-head">
              <span>{attempt.test?.title || 'Kiểm tra đầu vào'}</span>
              <h1>Trả lời {totalQuestions} câu ngắn</h1>
            </section>

            <div className="placement-progress">
              <span style={{ width: `${totalQuestions ? (answeredCount / totalQuestions) * 100 : 0}%` }} />
            </div>

            <div className="placement-question-list">
              {attempt.questions.map((question, index) => (
                <article key={question.id} className="placement-question-card">
                  <div className="placement-question-top">
                    <span>Câu {index + 1}</span>
                    <small>{skillLabel(question.skill)}</small>
                  </div>
                  <h2>{question.prompt}</h2>

                  {question.questionType === 'fill_blank' ? (
                    <input
                      className="form-input"
                      value={answers[question.id] || ''}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                      placeholder="Nhập đáp án"
                    />
                  ) : (
                    <div className="placement-option-grid">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={answers[question.id] === option ? 'is-selected' : ''}
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <button type="button" className="btn btn-primary btn-lg onboarding-submit" onClick={handleSubmitTest} disabled={loading}>
              {loading ? <FiLoader className="spin" /> : <FiPlay />}
              Nộp bài
            </button>
          </>
        )}

        {result && (
          <section className="onboarding-result">
            <FiCheckCircle />
            <span>Kết quả: {result.score}%</span>
            <h1>{result.resultLevel === 'basic' ? 'Bạn có thể bắt đầu từ lộ trình chính' : 'Bạn sẽ bắt đầu từ bài nền tảng'}</h1>
            <p>{result.correctCount}/{result.totalQuestions} câu đúng</p>
            <button type="button" className="btn btn-primary btn-lg" onClick={goDashboard}>
              Vào tổng quan <FiArrowRight />
            </button>
          </section>
        )}
      </motion.main>
    </div>
  );
}

function skillLabel(skill) {
  const labels = {
    listening: 'Nghe',
    speaking: 'Nói',
    reading: 'Đọc',
    writing: 'Viết',
    general: 'Tổng hợp'
  };
  return labels[skill] || 'Tổng hợp';
}

export default Onboarding;
