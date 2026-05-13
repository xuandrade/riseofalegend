import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { formatNumber } from '../../utils/format.js';
import { CLASSES } from '../../constants/classes.js';
import './DragonStats.css';

export default function DragonStats({ dragon, dragonClass = 'mago', compact = false }) {
  const classConfig = CLASSES[dragonClass] || CLASSES.mago;
  const stageName = ['Filhote', 'Jovem', 'Adolescente', 'Adulto', 'Veterano', 'Ancião', 'Lendário'][
    dragon.stage
  ];

  return (
    <div className={`rol-dragon-stats ${compact ? 'rol-dragon-stats--compact' : ''}`}>
      <div className="rol-dragon-stats__header">
        <div>
          <div className="rol-dragon-stats__label">
            <Zap size={14} /> {dragon.label}
          </div>
          <div className="rol-dragon-stats__stage">{stageName}</div>
        </div>
        <div className="rol-dragon-stats__xp">
          <strong>{formatNumber(dragon.totalXP)}</strong>
          <span>XP total</span>
        </div>
      </div>

      <div className="rol-dragon-stats__bar">
        <div className="rol-dragon-stats__bar-track">
          <motion.div
            className="rol-dragon-stats__bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${dragon.progressPct}%` }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: `linear-gradient(90deg, ${classConfig.color}, var(--neon-pink), var(--neon-gold))`,
            }}
          />
          <span className="rol-dragon-stats__bar-shimmer" />
        </div>
        <div className="rol-dragon-stats__bar-caption">
          <span>{formatNumber(dragon.xpInSubLevel)} XP</span>
          <span>
            faltam <strong>{formatNumber(dragon.xpToNextSubLevel)} XP</strong> para o próximo nível
          </span>
        </div>
      </div>
    </div>
  );
}
