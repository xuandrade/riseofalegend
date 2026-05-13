import { motion } from 'framer-motion';
import { Flame, Zap, Quote, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import DragonAvatar from '../components/dragon/DragonAvatar.jsx';
import DragonStats from '../components/dragon/DragonStats.jsx';
import ClassBadge from '../components/dragon/ClassBadge.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { getPhraseOfTheDay } from '../constants/phrases.js';
import { formatDate, formatNumber } from '../utils/format.js';
import { CLASSES } from '../constants/classes.js';
import './Hoje.css';

export default function Hoje() {
  const { user, dragon } = useApp();
  const phrase = getPhraseOfTheDay();
  const classConfig = CLASSES[user.dragonClass];

  const today = new Date();
  const greeting = getGreeting(today.getHours());

  return (
    <div className="page-hoje">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="page-hoje__greeting"
      >
        <div>
          <span className="page-hoje__date">
            <Calendar size={14} /> {formatDate(today, "EEEE, d 'de' MMMM")}
          </span>
          <h1 className="page-hoje__title">
            {greeting}, <span className="text-gradient-purple">{user.playerName}</span>
          </h1>
          <p className="page-hoje__subtitle">
            Sua jornada épica continua. Seu dragão te espera!
          </p>
        </div>
      </motion.div>

      <Card variant="featured" className="page-hoje__hero">
        <div className="page-hoje__hero-grid">
          <div className="page-hoje__dragon">
            <DragonAvatar
              stage={dragon.stage}
              subLevel={dragon.subLevel}
              dragonClass={user.dragonClass}
              size="lg"
            />
            <ClassBadge dragonClass={user.dragonClass} size="md" />
          </div>
          <div className="page-hoje__hero-stats">
            <DragonStats dragon={dragon} dragonClass={user.dragonClass} />
            <div className="page-hoje__bonuses">
              {classConfig.bonuses.slice(0, 2).map((b) => (
                <Badge key={b} variant={user.dragonClass} icon={Sparkles}>
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="page-hoje__stats-grid">
        <Card hoverable className="page-hoje__stat-card">
          <div className="page-hoje__stat-icon page-hoje__stat-icon--orange">
            <Flame size={20} />
          </div>
          <div>
            <span className="page-hoje__stat-label">Constância</span>
            <strong className="page-hoje__stat-value">{user.streak} dias</strong>
            <small className="page-hoje__stat-meta">
              Recorde: {user.bestStreak} dias
            </small>
          </div>
        </Card>

        <Card hoverable className="page-hoje__stat-card">
          <div className="page-hoje__stat-icon page-hoje__stat-icon--purple">
            <Zap size={20} />
          </div>
          <div>
            <span className="page-hoje__stat-label">XP Total</span>
            <strong className="page-hoje__stat-value">{formatNumber(user.totalXP)}</strong>
            <small className="page-hoje__stat-meta">
              Nível {dragon.level}
            </small>
          </div>
        </Card>

        <Card hoverable className="page-hoje__stat-card">
          <div className="page-hoje__stat-icon page-hoje__stat-icon--green">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="page-hoje__stat-label">Sessões hoje</span>
            <strong className="page-hoje__stat-value">{sessionsToday(user.dailyLogs)}</strong>
            <small className="page-hoje__stat-meta">
              {user.dailyLogs.length} registradas
            </small>
          </div>
        </Card>
      </div>

      <Card variant="purple" className="page-hoje__phrase">
        <Quote size={20} className="page-hoje__phrase-icon" />
        <p>{phrase}</p>
      </Card>

      <Card>
        <div className="page-hoje__coming-soon">
          <h3>⚔️ Próximos passos da jornada</h3>
          <p>
            Em breve você poderá registrar estudos, enfrentar bosses de bancas e ativar o Modo
            de Ataque diretamente desta tela. Por enquanto, explore as outras abas para preparar
            seu edital e personalizar a aventura.
          </p>
        </div>
      </Card>
    </div>
  );
}

function getGreeting(hour) {
  if (hour < 6) return 'Boa madrugada';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function sessionsToday(logs) {
  const today = new Date().toISOString().split('T')[0];
  return logs.filter((l) => l.date?.startsWith(today)).length;
}
