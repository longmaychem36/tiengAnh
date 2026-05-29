import { motion } from 'framer-motion';

const moodAnimation = {
  idle: {
    y: [0, -8, 0],
    rotate: [-1.2, 1.2, -1.2]
  },
  happy: {
    y: [0, -10, 0],
    rotate: [-2, 2, -2],
    scale: [1, 1.03, 1]
  },
  success: {
    y: [0, -16, 0, -8, 0],
    rotate: [0, -4, 4, -2, 0],
    scale: [1, 1.08, 1]
  },
  thinking: {
    y: [0, -4, 0],
    rotate: [0, -2, 0]
  }
};

function Mascot({ mood = 'idle', size = 180, className = '' }) {
  const animation = moodAnimation[mood] || moodAnimation.idle;

  return (
    <div className={`mascot-wrap mascot-${mood} ${className}`} style={{ width: size, height: size }}>
      <motion.span
        className="mascot-shadow"
        animate={{ scaleX: [1, 0.86, 1], opacity: [0.24, 0.16, 0.24] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.img
        className="mascot-base"
        src="/mascot/lingo-mascot.png"
        alt="LingoWeb mascot"
        draggable="false"
        animate={animation}
        transition={{ duration: mood === 'success' ? 1.25 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.span
        className="mascot-sparkle mascot-sparkle-one"
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.18, 0.8], rotate: [0, 16, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="mascot-sparkle mascot-sparkle-two"
        animate={{ opacity: [0.15, 0.85, 0.15], scale: [0.75, 1.1, 0.75], rotate: [0, -18, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
      />
    </div>
  );
}

export default Mascot;
