import { formatDistanceToNow, format, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatNumber(n) {
  return new Intl.NumberFormat('pt-BR').format(Math.floor(n || 0));
}

export function formatDate(date, pattern = 'dd/MM/yyyy') {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
}

export function formatRelative(date) {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

export function daysUntil(date) {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return Math.max(0, differenceInDays(d, new Date()));
}

export function formatDuration(minutes) {
  const total = Math.max(0, Math.floor(minutes || 0));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function pct(value, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}
