import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { STAGE_NAMES, STAGE_DESCRIPTIONS } from '../../utils/dragon-evolution.js';
import DragonAvatar from './DragonAvatar.jsx';
import './EvolutionCinematic.css';

export default function EvolutionCinematic({ open, from, to, dragonClass, onClose, onSound }) {
  useEffect(() => {
    if (!open) return;
    onSound?.();
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => onClose?.(), 6500);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open, onClose, onSound]);

  return (
    <AnimatePresence>
      {open && to && (
        <motion.div
          className="evolution-cinematic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          <div className="evolution-cinematic__bg" />
          <div className="evolution-cinematic__rays" />
          <div className="evolution-cinematic__particles">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.span
                key={i}
                className="evolution-cinematic__particle"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 700,
                  y: (Math.random() - 0.5) * 700,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5,
                  delay: Math.random() * 1,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                style={{
                  background:
                    i % 3 === 0
                      ? '#A78BFA'
                      : i % 3 === 1
                      ? '#FBBF24'
                      : '#F472B6',
                }}
              />
            ))}
          </div>

          <motion.div
            className="evolution-cinematic__content"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2,
            }}
          >
            <motion.span
              className="evolution-cinematic__label"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Sparkles size={16} /> Evolução Épica
            </motion.span>

            <motion.h2
              className="evolution-cinematic__title"
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, type: 'spring', stiffness: 220, damping: 18 }}
            >
              Seu dragão evoluiu!
            </motion.h2>

            <div className="evolution-cinematic__stages">
              <div className="evolution-cinematic__stage evolution-cinematic__stage--from">
                <span>antes</span>
                <strong>{STAGE_NAMES[from?.stage ?? 0]}</strong>
              </div>
              <motion.span
                className="evolution-cinematic__arrow"
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
              <div className="evolution-cinematic__stage evolution-cinematic__stage--to">
                <span>agora</span>
                <strong>{STAGE_NAMES[to.stage]}</strong>
              </div>
            </div>

            <motion.div
              className="evolution-cinematic__dragon"
              initial={{ scale: 0.4, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.75, type: 'spring', stiffness: 200, damping: 16 }}
            >
              <DragonAvatar
                stage={to.stage}
                subLevel={to.subLevel}
                dragonClass={dragonClass}
                size="xl"
              />
            </motion.div>

            <motion.p
              className="evolution-cinematic__description"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {STAGE_DESCRIPTIONS[to.stage]}
            </motion.p>

            <motion.button
              type="button"
              className="evolution-cinematic__close"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={onClose}
            >
              Continuar jornada
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
