import { Trophy } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import { ACHIEVEMENTS, getRarityConfig } from '../constants/achievements.js';
import { useApp } from '../contexts/AppContext.jsx';
import './Conquistas.css';

export default function Conquistas() {
  const { user } = useApp();
  const visible = ACHIEVEMENTS.filter(
    (a) => !a.secret || user.achievements.includes(a.id),
  );
  const unlockedCount = user.achievements.length;

  return (
    <div className="page-stack">
      <PageHeader
        icon={Trophy}
        title="Galeria de Conquistas"
        subtitle={`${unlockedCount} de ${ACHIEVEMENTS.length} desbloqueadas`}
      />

      <div className="page-conquistas__grid">
        {visible.map((a) => {
          const unlocked = user.achievements.includes(a.id);
          const rarity = getRarityConfig(a.rarity);
          return (
            <Card
              key={a.id}
              className={`page-conquistas__card ${unlocked ? 'page-conquistas__card--unlocked' : ''}`}
              style={{
                borderColor: unlocked ? rarity.color : undefined,
                boxShadow: unlocked ? `0 0 24px ${rarity.color}33` : undefined,
              }}
              hoverable
            >
              <span className={`page-conquistas__icon ${unlocked ? '' : 'page-conquistas__icon--locked'}`}>
                {unlocked ? a.icon : '🔒'}
              </span>
              <strong className="page-conquistas__name">{a.name}</strong>
              <p className="page-conquistas__desc">{a.description}</p>
              <Badge variant={`rarity-${a.rarity}`} size="sm">
                {rarity.name}
              </Badge>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
