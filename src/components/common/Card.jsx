import { motion } from 'framer-motion';
import './Card.css';

export default function Card({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  onClick,
  delay = 0,
  ...props
}) {
  const classes = [
    'rol-card',
    `rol-card--${variant}`,
    hoverable && 'rol-card--hoverable',
    onClick && 'rol-card--interactive',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
