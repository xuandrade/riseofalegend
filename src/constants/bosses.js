export const BOSSES_BANCAS = {
  fgv: {
    id: 'fgv',
    bancaName: 'FGV',
    creatureName: 'Serpente de Jade',
    icon: '🐍',
    description: 'Movimentos sinuosos e ataques rápidos de lei seca.',
    color: '#10B981',
    auraColor: 'rgba(16, 185, 129, 0.45)',
    defaultHP: 10000,
  },
  cebraspe: {
    id: 'cebraspe',
    bancaName: 'CEBRASPE',
    creatureName: 'Escorpião de Obsidiana',
    icon: '🦂',
    description: 'Ataques venenosos com questões de certo/errado.',
    color: '#1E293B',
    auraColor: 'rgba(30, 41, 59, 0.45)',
    defaultHP: 12000,
  },
  fcc: {
    id: 'fcc',
    bancaName: 'FCC',
    creatureName: 'Leão Imperial',
    icon: '🦁',
    description: 'Imponente e focado em letra da lei.',
    color: '#F59E0B',
    auraColor: 'rgba(245, 158, 11, 0.45)',
    defaultHP: 10000,
  },
  vunesp: {
    id: 'vunesp',
    bancaName: 'VUNESP',
    creatureName: 'Morcego Sombrio',
    icon: '🦇',
    description: 'Asas membranosas com brilho neon azul.',
    color: '#3B82F6',
    auraColor: 'rgba(59, 130, 246, 0.45)',
    defaultHP: 9500,
  },
  bancaPropria: {
    id: 'bancaPropria',
    bancaName: 'Banca Própria',
    creatureName: 'Harpia de Marfim',
    icon: '🦅',
    description: 'Vigilante com plumagem branca e garras violetas.',
    color: '#A78BFA',
    auraColor: 'rgba(167, 139, 250, 0.45)',
    defaultHP: 10000,
  },
  outras: {
    id: 'outras',
    bancaName: 'Outras',
    creatureName: 'Salamandra',
    icon: '🦎',
    description: 'Adaptável e resistente.',
    color: '#EF4444',
    auraColor: 'rgba(239, 68, 68, 0.45)',
    defaultHP: 8000,
  },
};

export const BANCAS_LIST = Object.values(BOSSES_BANCAS);

export function getBossByBanca(bancaId) {
  return BOSSES_BANCAS[bancaId] || BOSSES_BANCAS.outras;
}
