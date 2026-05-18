import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiAward, FiStar, FiZap } from 'react-icons/fi';

function ExpReward({ reward, fallbackExp = 0 }) {
  const amount = Number(reward?.amount ?? fallbackExp ?? 0);
  const previous = reward?.previous || {};
  const current = reward?.current || {};
  const level = Number(current.Level || current.level || previous.Level || previous.level || 1);
  const previousLevel = Number(previous.Level || previous.level || level);
  const progress = Math.max(0, Math.min(100, Number(current.levelProgress || 0)));
  const currentLevelExp = Number(current.currentLevelExp || current.currentLevelEarnedExp || 0);
  const requiredLevelExp = Number(current.requiredLevelExp || 0);
  const leveledUp = Boolean(reward?.leveledUp);

  if (!amount && !reward) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className={`exp-reward-card ${leveledUp ? 'is-level-up' : ''}`}
      >
        <motion.div
          className="exp-reward-burst"
          initial={{ scale: 0.75, rotate: -10 }}
          animate={{ scale: [0.9, 1.08, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 0.7 }}
        >
          {leveledUp ? <FiAward /> : <FiZap />}
        </motion.div>

        <div className="exp-reward-body">
          <div className="exp-reward-topline">
            <span>{leveledUp ? 'Lên cấp!' : 'Kinh nghiệm nhận được'}</span>
            <motion.strong
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.18, 1] }}
              transition={{ delay: 0.12, duration: 0.45 }}
            >
              +{amount} EXP
            </motion.strong>
          </div>

          <div className="exp-reward-level">
            <span>Lv.{previousLevel}</span>
            <FiArrowUp />
            <span>Lv.{level}</span>
            {leveledUp && <FiStar className="exp-reward-star" />}
          </div>

          {requiredLevelExp > 0 ? (
            <>
              <div className="exp-reward-track">
                <motion.span
                  initial={{ width: `${Math.max(0, Math.min(100, Number(previous.levelProgress || 0)))}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="exp-reward-meta">
                <span>{currentLevelExp}/{requiredLevelExp} EXP cấp này</span>
                <span>{current.expToNextLevel || 0} EXP nữa</span>
              </div>
            </>
          ) : (
            <div className="exp-reward-meta">
              <span>Đã đạt cấp tối đa</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ExpReward;
