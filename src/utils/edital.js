import { v4 as uuid } from 'uuid';

export const OBJETIVA_CHECKS = [
  { id: 'lei', label: 'Lei', shortLabel: 'L' },
  { id: 'doutrina', label: 'Doutrina', shortLabel: 'D' },
  { id: 'juris', label: 'Jurisprudência', shortLabel: 'J' },
  { id: 'questoes', label: 'Questões', shortLabel: 'Q' },
  { id: 'revisao', label: 'Revisão', shortLabel: 'R' },
];

export const DISCURSIVA_CHECKS = [
  { id: 'estudado', label: 'Estudado', shortLabel: 'E' },
  { id: 'grifado', label: 'Grifado', shortLabel: 'G' },
  { id: 'questoes', label: 'Questões', shortLabel: 'Q' },
];

export function createTopic({ name, weight = 3, isEssential = false, checks }) {
  const base = {
    id: uuid(),
    name,
    weight,
    isEssential,
    lastStudiedAt: null,
  };
  checks.forEach((c) => {
    base[c.id] = false;
  });
  return base;
}

export function createSubject({ name }) {
  return {
    id: uuid(),
    name,
    topics: [],
  };
}

export function topicProgress(topic, checks) {
  const total = checks.length;
  const done = checks.filter((c) => topic[c.id]).length;
  return total === 0 ? 0 : (done / total) * 100;
}

export function subjectProgress(subject, checks) {
  if (!subject.topics.length) return 0;
  const total = subject.topics.length * checks.length;
  let done = 0;
  subject.topics.forEach((t) => {
    checks.forEach((c) => {
      if (t[c.id]) done += 1;
    });
  });
  return total === 0 ? 0 : (done / total) * 100;
}

export function editalProgress(edital, checks) {
  if (!edital.subjects.length) return 0;
  return (
    edital.subjects.reduce((acc, s) => acc + subjectProgress(s, checks), 0) /
    edital.subjects.length
  );
}

export function heatColor(percent, levels = 5) {
  if (percent <= 0) return 'var(--bg-tertiary)';
  if (levels === 4) {
    if (percent < 30) return 'rgba(239, 68, 68, 0.45)';
    if (percent < 60) return 'rgba(245, 158, 11, 0.45)';
    if (percent < 90) return 'rgba(16, 185, 129, 0.45)';
    return 'rgba(59, 130, 246, 0.55)';
  }
  if (percent < 25) return 'rgba(239, 68, 68, 0.45)';
  if (percent < 50) return 'rgba(245, 158, 11, 0.45)';
  if (percent < 75) return 'rgba(251, 191, 36, 0.45)';
  if (percent < 95) return 'rgba(16, 185, 129, 0.45)';
  return 'rgba(59, 130, 246, 0.55)';
}

export function progressColor(percent) {
  if (percent < 30) return 'var(--error)';
  if (percent < 60) return 'var(--warning)';
  if (percent < 90) return 'var(--success)';
  return 'var(--info)';
}
