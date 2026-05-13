import { getProgressFromXP, MAX_STAGE } from './xp-calculator.js';

export const STAGE_NAMES = [
  'Filhote',
  'Jovem',
  'Adolescente',
  'Adulto',
  'Veterano',
  'Ancião',
  'Lendário',
];

export const STAGE_DESCRIPTIONS = [
  'Acabou de nascer. Olhos curiosos e cheios de potencial.',
  'Cresceu rápido. Já consegue voar curtas distâncias.',
  'Disciplinado e focado. Aprende novos truques.',
  'Sábio e poderoso. Domina a maior parte das batalhas.',
  'Cicatrizes de muitas vitórias. Temido pelos bosses.',
  'Tem visto eras. Domina conhecimento ancestral.',
  'Uma lenda viva. Sua presença muda o destino dos mundos.',
];

export function getStageVisualEffects(stage) {
  const safe = Math.min(MAX_STAGE, Math.max(0, stage));
  const presets = [
    { scale: 0.78, opacity: 0.72, saturate: 70, brightness: 95, glow: 0.25, hue: 0 },
    { scale: 0.86, opacity: 0.82, saturate: 85, brightness: 100, glow: 0.35, hue: 5 },
    { scale: 0.94, opacity: 0.92, saturate: 100, brightness: 105, glow: 0.5, hue: 10 },
    { scale: 1.0, opacity: 1.0, saturate: 115, brightness: 110, glow: 0.65, hue: 15 },
    { scale: 1.06, opacity: 1.0, saturate: 130, brightness: 115, glow: 0.78, hue: 20 },
    { scale: 1.12, opacity: 1.0, saturate: 145, brightness: 120, glow: 0.9, hue: 25 },
    { scale: 1.2, opacity: 1.0, saturate: 165, brightness: 130, glow: 1.0, hue: 35 },
  ];
  return presets[safe];
}

export function getDragonState(totalXP) {
  const progress = getProgressFromXP(totalXP);
  const visual = getStageVisualEffects(progress.stage);
  return {
    ...progress,
    stageName: STAGE_NAMES[progress.stage],
    stageDescription: STAGE_DESCRIPTIONS[progress.stage],
    visual,
  };
}
