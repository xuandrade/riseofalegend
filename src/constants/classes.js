export const CLASSES = {
  mago: {
    id: 'mago',
    name: 'Mago',
    title: 'Mestre Versátil',
    icon: '🔮',
    description: 'Especialista em versatilidade. Equilibra teoria e prática.',
    color: '#8B5CF6',
    auraColor: 'rgba(139, 92, 246, 0.4)',
    activationRule: '40-60% teoria + 40-60% questões',
    bonuses: [
      '+10% XP em tudo',
      'Pode trocar de classe 1x/semana',
      'Imune a penalidades de mudança',
    ],
    visual: 'Cajado mágico, aura holográfica, runas flutuantes',
  },
  filosofo: {
    id: 'filosofo',
    name: 'Filósofo',
    title: 'Mestre do Conhecimento',
    icon: '📚',
    description: 'Mestre do conhecimento profundo. Quem busca a teoria.',
    color: '#3B82F6',
    auraColor: 'rgba(59, 130, 246, 0.4)',
    activationRule: '>60% do tempo em teoria/leituras',
    bonuses: [
      '+20% XP em teoria',
      'Tópicos essenciais valem +25%',
      'Insight Flash: chance de XP bônus em peso 5',
    ],
    visual: 'Óculos e livro, aura azul-safira, scroll antigo',
  },
  gladiador: {
    id: 'gladiador',
    name: 'Gladiador',
    title: 'Guerreiro de Batalha',
    icon: '⚔️',
    description: 'Guerreiro do campo de batalha. Treinado em questões.',
    color: '#EF4444',
    auraColor: 'rgba(239, 68, 68, 0.4)',
    activationRule: '>60% do tempo em questões/simulados',
    bonuses: [
      '+20% XP em questões',
      'Combo Strike: 3 dias seguidos = +50% no 4º',
      'Simulados dão +25% XP extra',
    ],
    visual: 'Armadura e espada, aura rubi, cicatrizes de batalha',
  },
};

export function getClassConfig(classId) {
  return CLASSES[classId] || CLASSES.mago;
}

export function calculateClassFromStudyData(dailyLogs = []) {
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const recent = dailyLogs.filter((d) => new Date(d.date).getTime() >= cutoff);

  if (!recent.length) return 'mago';

  const theory = recent
    .filter((d) => d.type === 'teoria')
    .reduce((acc, d) => acc + (d.hours || 0), 0);
  const questions = recent
    .filter((d) => d.type === 'questoes')
    .reduce((acc, d) => acc + (d.hours || 0), 0);
  const total = theory + questions;

  if (total === 0) return 'mago';

  const theoryPct = (theory / total) * 100;
  const questionsPct = (questions / total) * 100;

  if (theoryPct > 60) return 'filosofo';
  if (questionsPct > 60) return 'gladiador';
  return 'mago';
}
