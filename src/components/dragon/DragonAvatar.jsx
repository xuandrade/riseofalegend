import { motion } from 'framer-motion';
import { getStageVisualEffects } from '../../utils/dragon-evolution.js';
import { CLASSES } from '../../constants/classes.js';
import './DragonAvatar.css';

export default function DragonAvatar({
  stage = 0,
  subLevel = 0,
  dragonClass = 'mago',
  size = 'lg',
  showAura = true,
  emotion = 'idle',
}) {
  const visual = getStageVisualEffects(stage);
  const classConfig = CLASSES[dragonClass] || CLASSES.mago;

  const filter = [
    `saturate(${visual.saturate}%)`,
    `brightness(${visual.brightness}%)`,
    `hue-rotate(${visual.hue}deg)`,
  ].join(' ');

  const auraOpacity = visual.glow;
  const isSad = emotion === 'sad';

  return (
    <div className={`rol-dragon rol-dragon--${size}`}>
      {showAura && (
        <div
          className="rol-dragon__aura"
          style={{
            opacity: auraOpacity * 0.7,
            background: `radial-gradient(circle, ${classConfig.auraColor} 0%, rgba(255,255,255,0) 70%)`,
          }}
        />
      )}
      {showAura && (
        <motion.div
          className="rol-dragon__aura-orbit"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          style={{
            opacity: auraOpacity * 0.45,
            background: `conic-gradient(from 0deg, ${classConfig.color}33, transparent 30%, ${classConfig.color}55, transparent 70%, ${classConfig.color}33)`,
          }}
        />
      )}
      <motion.div
        animate={
          isSad
            ? { y: [0, -4, 0, -2, 0], filter: 'grayscale(50%) brightness(0.7)' }
            : { y: [0, -8, 0], scale: [visual.scale, visual.scale * 1.01, visual.scale] }
        }
        transition={{
          duration: isSad ? 1.6 : 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="rol-dragon__image"
        style={{
          filter,
          opacity: visual.opacity,
        }}
      >
        <img src="/dragon-logo.svg" alt="Dragão Rise of a Legend" draggable={false} />
      </motion.div>

      <div className="rol-dragon__sublevel-dots">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`rol-dragon__dot ${i <= subLevel ? 'rol-dragon__dot--filled' : ''}`}
            style={{
              background:
                i <= subLevel
                  ? `linear-gradient(135deg, ${classConfig.color}, var(--dragon-dark))`
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
