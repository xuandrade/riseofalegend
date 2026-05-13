import { motion } from 'framer-motion';
import { CLASSES } from '../../constants/classes.js';
import './ClassBadge.css';

export default function ClassBadge({ dragonClass = 'mago', size = 'md', showTitle = true }) {
  const config = CLASSES[dragonClass] || CLASSES.mago;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rol-class rol-class--${size} rol-class--${dragonClass}`}
      title={`${config.name}: ${config.bonuses.join(' • ')}`}
    >
      <span className="rol-class__icon">{config.icon}</span>
      <div className="rol-class__text">
        <strong>{config.name}</strong>
        {showTitle && <small>{config.title}</small>}
      </div>
    </motion.div>
  );
}
