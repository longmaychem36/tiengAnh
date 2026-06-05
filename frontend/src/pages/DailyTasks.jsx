import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiGift,
  FiHeadphones,
  FiLogIn,
  FiMic,
  FiPlay,
  FiRefreshCw,
  FiStar
} from 'react-icons/fi';

import { dailyTaskApi } from '../api/dailyTaskApi';
import Loading from '../components/common/Loading';
import ExpReward from '../components/common/ExpReward';

const taskMeta = {
  daily_login: { icon: FiLogIn, label: 'Khởi động', color: '#1cb0f6' },
  listening_lesson: { icon: FiHeadphones, label: 'Listening', color: '#1cb0f6' },
  speaking_lesson: { icon: FiMic, label: 'Speaking', color: '#8b5cf6' },
  reading_lesson: { icon: FiBookOpen, label: 'Reading', color: '#14b8a6' },
  writing_lesson: { icon: FiEdit3, label: 'Writing', color: '#f59e0b' },
  game_level: { icon: FiPlay, label: 'Mini game', color: '#ef4444' },
  vocabulary_review: { icon: FiStar, label: 'Từ vựng', color: '#22c55e' },
  grammar_topic: { icon: FiBookOpen, label: 'Ngữ pháp', color: '#6366f1' }
};

function getMeta(task) {
  return taskMeta[task.targetType] || taskMeta[task.skill] || taskMeta.listening_lesson;
}

function DailyTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [taskDate, setTaskDate] = useState('');
  const [expReward, setExpReward] = useState(null);

  useEffect(() => {
    dailyTaskApi.getToday()
      .then((res) => {
        setTasks(res.data?.tasks || []);
        setTaskDate(res.data?.taskDate || '');
        setExpReward(res.data?.expReward || null);
      })
      .catch(() => toast.error('Không thể tải nhiệm vụ hôm nay.'))
      .finally(() => setLoading(false));
  }, []);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.status === 'completed').length,
    [tasks]
  );
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) return <Loading />;

  return (
    <div className="daily-page">
      <section className="daily-hero">
        <div>
          <span className="daily-eyebrow"><FiGift /> Nhiệm vụ hằng ngày</span>
          <h1>Hoàn thành vài việc nhỏ, giữ nhịp học lớn.</h1>
          <p>Mỗi ngày có một danh sách ngắn: đăng nhập tự cộng EXP, học một bài chính, rồi ôn nhanh bằng hoạt động nhẹ.</p>
        </div>
        <div className="daily-hero-progress">
          <FiStar />
          <strong>{progress}%</strong>
          <span>{completedCount}/{tasks.length || 3} xong</span>
        </div>
      </section>

      <ExpReward reward={expReward} />

      <section className="daily-workspace">
        <main className="daily-task-list">
          <div className="daily-section-head">
            <div>
              <span>Hôm nay {taskDate}</span>
              <h2>Nhiệm vụ của bạn</h2>
            </div>
            <div className="daily-progress-pill">
              <FiClock />
              <strong>{completedCount}/{tasks.length || 3}</strong>
            </div>
          </div>

          <div className="daily-progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          {tasks.length > 0 ? (
            <div className="daily-card-stack">
              {tasks.map((task, index) => {
                const meta = getMeta(task);
                const Icon = meta.icon;
                const completed = task.status === 'completed';
                return (
                  <motion.article
                    key={task.id}
                    className={`daily-quest-card ${completed ? 'is-completed' : ''}`}
                    style={{ '--quest-color': meta.color }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="daily-quest-icon">
                      {completed ? <FiCheckCircle /> : <Icon />}
                    </div>
                    <div className="daily-quest-body">
                      <div className="daily-quest-top">
                        <span>{meta.label}</span>
                        <strong>+{task.rewardExp || 10} EXP</strong>
                      </div>
                      <h3>{task.title}</h3>
                      <p>{task.reason || task.description}</p>
                    </div>
                    <div className="daily-quest-actions">
                      {completed ? (
                        <span className="daily-done-badge"><FiCheckCircle /> Đã xong</span>
                      ) : (
                        <Link className="btn btn-primary" to={task.url || '/courses'}>
                          Làm ngay
                        </Link>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="daily-empty-state">
              <FiRefreshCw />
              <h3>Chưa có nhiệm vụ học</h3>
              <p>Hãy tạo thêm bài học hoặc thử lại sau. Nhiệm vụ đăng nhập sẽ luôn là nhiệm vụ đầu tiên trong ngày.</p>
            </div>
          )}
        </main>

        <aside className="daily-side-panel">
          <div className="daily-side-card">
            <span>Gợi ý nhịp học</span>
            <h3>3 bước là đủ</h3>
            <p>EXP được cộng tự động khi nhiệm vụ chuyển sang hoàn thành. Không cần bấm nhận thủ công.</p>
          </div>
          <div className="daily-side-card is-blue">
            <span>Phần thưởng</span>
            <h3>{tasks.reduce((sum, task) => sum + Number(task.rewardExp || 0), 0)} EXP</h3>
            <p>Hoàn thành toàn bộ nhiệm vụ hôm nay để lấy trọn EXP.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default DailyTasks;
