import { AnimatePresence, motion } from 'framer-motion';
import { formatNumber } from '../../utils/format.js';
import './XPFloating.css';

export default function XPFloating({ items }) {
  return (
    <div className="xp-floating-stack">
      <AnimatePresence>
        {items.map((item) => (
          <motion.span
            key={item.id}
            initial={{ y: 0, x: 0, opacity: 0, scale: 0.7 }}
            animate={{
              y: -100,
              opacity: [0, 1, 1, 0],
              scale: [0.7, 1.2, 1.05, 1],
              x: (Math.random() - 0.5) * 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="xp-floating"
          >
            +{formatNumber(item.amount)} XP
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
