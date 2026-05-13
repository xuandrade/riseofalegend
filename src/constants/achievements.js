export const RARITIES = {
  common: { id: 'common', name: 'Comum', color: '#9CA3AF' },
  uncommon: { id: 'uncommon', name: 'Incomum', color: '#10B981' },
  rare: { id: 'rare', name: 'Raro', color: '#3B82F6' },
  epic: { id: 'epic', name: 'Épico', color: '#8B5CF6' },
  legendary: { id: 'legendary', name: 'Lendário', color: '#F59E0B' },
};

export const ACHIEVEMENT_CATEGORIES = {
  start: 'Início da Jornada',
  streak: 'Constância',
  xp: 'Acúmulo de XP',
  classes: 'Domínio de Classes',
  bosses: 'Caçador de Bosses',
  simulados: 'Treinos de Combate',
  edital: 'Domínio de Editais',
  attackMode: 'Modo de Ataque',
  secret: 'Segredas',
};

export const ACHIEVEMENTS = [
  // === INÍCIO ===
  { id: 'first_step', name: 'Primeiro Passo', description: 'Completar seu primeiro tópico de estudo', icon: '🐣', category: 'start', rarity: 'common', xp: 50 },
  { id: 'first_xp', name: 'Despertar', description: 'Ganhar seus primeiros 100 XP', icon: '✨', category: 'start', rarity: 'common', xp: 50 },
  { id: 'dragon_baby', name: 'Dragão Bebê', description: 'Atingir o nível 2', icon: '🐉', category: 'start', rarity: 'common', xp: 75 },

  // === CONSTÂNCIA ===
  { id: 'streak_3', name: 'Brasa Acesa', description: '3 dias consecutivos de estudo', icon: '🔥', category: 'streak', rarity: 'common', xp: 100 },
  { id: 'streak_7', name: 'Combo Master', description: '7 dias consecutivos de estudo', icon: '⚡', category: 'streak', rarity: 'uncommon', xp: 250 },
  { id: 'streak_14', name: 'Constância de Ferro', description: '14 dias consecutivos de estudo', icon: '🛡️', category: 'streak', rarity: 'rare', xp: 500 },
  { id: 'streak_25', name: 'Herança Ancestral', description: '25 dias seguidos de constância', icon: '💎', category: 'streak', rarity: 'rare', xp: 750 },
  { id: 'streak_30', name: 'Mestre da Constância', description: '30 dias consecutivos de estudo', icon: '🌟', category: 'streak', rarity: 'epic', xp: 1000 },
  { id: 'streak_50', name: 'Chama Perpétua', description: '50 dias seguidos ininterruptos', icon: '🔥', category: 'streak', rarity: 'epic', xp: 1500 },
  { id: 'streak_75', name: 'Lenda', description: '75 dias de constância', icon: '👑', category: 'streak', rarity: 'legendary', xp: 3000 },

  // === XP ===
  { id: 'xp_1k', name: 'Mil XP', description: 'Acumular 1.000 XP totais', icon: '⭐', category: 'xp', rarity: 'common', xp: 100 },
  { id: 'xp_5k', name: 'Cinco Mil', description: 'Acumular 5.000 XP totais', icon: '🌟', category: 'xp', rarity: 'uncommon', xp: 250 },
  { id: 'xp_10k', name: 'Dez Mil XP', description: 'Acumular 10.000 XP totais', icon: '💫', category: 'xp', rarity: 'rare', xp: 500 },
  { id: 'xp_50k', name: 'Lenda Acumulada', description: 'Acumular 50.000 XP totais', icon: '✨', category: 'xp', rarity: 'legendary', xp: 2500 },

  // === CLASSES ===
  { id: 'class_mago', name: 'Equilibrista', description: 'Manter classe Mago por 2 semanas', icon: '🔮', category: 'classes', rarity: 'rare', xp: 400 },
  { id: 'class_filosofo', name: 'Filósofo Iniciante', description: 'Estudar 10h de teoria', icon: '📚', category: 'classes', rarity: 'uncommon', xp: 250 },
  { id: 'class_gladiador', name: 'Gladiador Bronze', description: 'Resolver 100 questões', icon: '⚔️', category: 'classes', rarity: 'uncommon', xp: 250 },

  // === BOSSES ===
  { id: 'first_boss', name: 'First Blood', description: 'Derrotar seu primeiro boss', icon: '🩸', category: 'bosses', rarity: 'rare', xp: 500 },
  { id: 'boss_3', name: 'Caçador', description: 'Derrotar 3 bosses', icon: '🏹', category: 'bosses', rarity: 'epic', xp: 1000 },

  // === SIMULADOS ===
  { id: 'sim_1', name: 'Sobrevivente', description: 'Completar seu primeiro simulado', icon: '🎯', category: 'simulados', rarity: 'common', xp: 150 },
  { id: 'sim_3', name: 'Consistente', description: 'Fazer 3 simulados', icon: '🎪', category: 'simulados', rarity: 'uncommon', xp: 300 },
  { id: 'sim_sniper', name: 'Sniper', description: 'Acertar mais de 75% em um simulado', icon: '🎯', category: 'simulados', rarity: 'rare', xp: 500 },
  { id: 'sim_perfect', name: 'Perfeccionista', description: 'Acertar 100% em um simulado', icon: '💯', category: 'simulados', rarity: 'legendary', xp: 2000 },

  // === EDITAL ===
  { id: 'edital_bronze', name: 'Edital Bronze', description: '25% de um edital completo', icon: '🥉', category: 'edital', rarity: 'common', xp: 200 },
  { id: 'edital_prata', name: 'Edital Prata', description: '50% de um edital completo', icon: '🥈', category: 'edital', rarity: 'uncommon', xp: 500 },
  { id: 'edital_ouro', name: 'Edital Ouro', description: '60% de um edital completo', icon: '🥇', category: 'edital', rarity: 'rare', xp: 750 },
  { id: 'edital_diamante', name: 'Edital Diamante', description: '70% de um edital completo', icon: '💎', category: 'edital', rarity: 'epic', xp: 1200 },
  { id: 'edital_platina', name: 'Edital Platina', description: '100% de um edital completo', icon: '👑', category: 'edital', rarity: 'legendary', xp: 3000 },

  // === MODO DE ATAQUE ===
  { id: 'attack_first', name: 'Guerreiro Iniciante', description: 'Completar 1 Modo de Ataque sem pausar', icon: '⚔️', category: 'attackMode', rarity: 'common', xp: 200 },
  { id: 'attack_combo3', name: 'Combo de 3', description: '3 Modos de Ataque consecutivos sem pausar', icon: '🔥', category: 'attackMode', rarity: 'uncommon', xp: 500 },
  { id: 'attack_implacavel', name: 'Implacável', description: '7 Modos de Ataque consecutivos sem pausar', icon: '⚡', category: 'attackMode', rarity: 'rare', xp: 1000 },
  { id: 'attack_master', name: 'Disciplina de Aço', description: '14 Modos consecutivos sem pausar', icon: '🛡️', category: 'attackMode', rarity: 'epic', xp: 2000 },
  { id: 'attack_lenda', name: 'Lenda do Foco', description: '30 Modos consecutivos sem pausar', icon: '👑', category: 'attackMode', rarity: 'legendary', xp: 5000 },

  // === SECRETAS ===
  { id: 'secret_madrugador', name: 'Madrugador', description: 'Iniciar estudo até as 7h', icon: '🌅', category: 'secret', rarity: 'uncommon', xp: 300, secret: true },
  { id: 'secret_coruja', name: 'Coruja', description: 'Estudar após as 20:30', icon: '🌙', category: 'secret', rarity: 'uncommon', xp: 300, secret: true },
  { id: 'secret_raio', name: 'Raio', description: 'Completar 5 tópicos em 4h', icon: '⚡', category: 'secret', rarity: 'rare', xp: 500, secret: true },
  { id: 'secret_fenix', name: 'Fênix', description: 'Voltar após 7 dias parado', icon: '🦅', category: 'secret', rarity: 'rare', xp: 600, secret: true },
  { id: 'secret_polimata', name: 'Polímata', description: 'Estudar todas as matérias em 15 dias', icon: '🌈', category: 'secret', rarity: 'epic', xp: 1500, secret: true },
];

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getRarityConfig(rarity) {
  return RARITIES[rarity] || RARITIES.common;
}
