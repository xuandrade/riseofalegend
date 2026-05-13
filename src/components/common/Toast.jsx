import { AnimatePresence, motion } from 'framer-motion';
import { Award, Sparkles, Info, X, Zap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext.jsx';
import './Toast.css';

const ICONS = {
  xp: Sparkles,
  achievement: Award,
  success: Zap,
  info: Info,
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="rol-toast-stack" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`rol-toast rol-toast--${t.type || 'info'} ${
                t.rarity ? `rol-toast--rarity-${t.rarity}` : ''
              }`}
            >
              <div className="rol-toast__icon">
                <Icon size={18} />
              </div>
              <div className="rol-toast__content">
                {t.title && <strong className="rol-toast__title">{t.title}</strong>}
                {t.message && <span className="rol-toast__message">{t.message}</span>}
              </div>
              <button
                type="button"
                className="rol-toast__close"
                onClick={() => dismissToast(t.id)}
                aria-label="Fechar notificação"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
