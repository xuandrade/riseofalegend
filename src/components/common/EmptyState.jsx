import { motion } from 'framer-motion';
import './EmptyState.css';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rol-empty"
    >
      {icon && <div className="rol-empty__icon">{icon}</div>}
      {title && <h3 className="rol-empty__title">{title}</h3>}
      {description && <p className="rol-empty__description">{description}</p>}
      {action && <div className="rol-empty__action">{action}</div>}
    </motion.div>
  );
}
