export const XP_PER_SUBLEVEL = 500;
export const SUBLEVELS_PER_STAGE = 5;
export const XP_PER_STAGE = XP_PER_SUBLEVEL * SUBLEVELS_PER_STAGE; // 2500
export const MAX_STAGE = 6; // 7 estágios (0-6)
export const MAX_TOTAL_XP = (MAX_STAGE + 1) * XP_PER_STAGE; // 17.500

export function getProgressFromXP(totalXP) {
  const xp = Math.max(0, totalXP);
  const stage = Math.min(MAX_STAGE, Math.floor(xp / XP_PER_STAGE));
  const xpInStage = xp - stage * XP_PER_STAGE;
  const subLevel = Math.min(
    SUBLEVELS_PER_STAGE - 1,
    Math.floor(xpInStage / XP_PER_SUBLEVEL),
  );
  const xpInSubLevel = xpInStage - subLevel * XP_PER_SUBLEVEL;
  const progressPct = (xpInSubLevel / XP_PER_SUBLEVEL) * 100;
  const level = stage * SUBLEVELS_PER_STAGE + subLevel + 1;

  return {
    totalXP: xp,
    stage,
    subLevel,
    level,
    xpInSubLevel,
    xpToNextSubLevel: XP_PER_SUBLEVEL - xpInSubLevel,
    progressPct,
    label: `Nível ${stage + 1}.${subLevel + 1}`,
  };
}

export function calculateActionXP({
  type,
  weight = 3,
  isEssential = false,
  durationMin = 0,
  questionsCount = 0,
  dragonClass = 'mago',
  isAttackMode = false,
}) {
  let xp = 0;

  if (type === 'teoria') {
    xp = (durationMin / 60) * 100;
  } else if (type === 'questoes') {
    xp = (questionsCount / 10) * 50;
  } else if (type === 'checkbox') {
    xp = 25 * weight;
    if (isEssential) xp += 25;
  } else if (type === 'simulado') {
    xp = 200 + questionsCount * 5;
  }

  if (dragonClass === 'mago') xp *= 1.1;
  if (dragonClass === 'filosofo' && type === 'teoria') xp *= 1.2;
  if (dragonClass === 'filosofo' && isEssential) xp *= 1.25;
  if (dragonClass === 'gladiador' && type === 'questoes') xp *= 1.2;
  if (dragonClass === 'gladiador' && type === 'simulado') xp *= 1.25;

  if (isAttackMode) xp *= 1.25;

  return Math.floor(xp);
}

export function calculateBossDamage({
  type,
  weight = 3,
  isEssential = false,
  durationMin = 0,
  questionsCount = 0,
}) {
  let dmg = 0;
  if (type === 'teoria') dmg = (durationMin / 60) * 50;
  else if (type === 'questoes') dmg = questionsCount * 2;
  else if (type === 'checkbox') dmg = weight <= 3 ? 50 : 100;
  if (isEssential) dmg *= 2;
  return Math.floor(dmg);
}
