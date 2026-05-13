import { motion } from 'framer-motion';
import './PageHeader.css';

export default function PageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rol-page-header"
    >
      <div className="rol-page-header__main">
        {Icon && (
          <span className="rol-page-header__icon">
            <Icon size={24} />
          </span>
        )}
        <div>
          <h1 className="rol-page-header__title">{title}</h1>
          {subtitle && <p className="rol-page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="rol-page-header__actions">{actions}</div>}
    </motion.div>
  );
}
