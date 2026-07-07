import { formatDistanceToNow, format, isPast, isFuture, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

export const timeAgo = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });

export const fmtDate = (date, fmt = 'dd/MM/yyyy') =>
  format(new Date(date), fmt, { locale: es });

export const fmtDateTime = (date) =>
  format(new Date(date), "dd MMM yyyy, h:mm a", { locale: es });

export const countdown = (dueDate) => {
  const due = new Date(dueDate);
  if (isPast(due)) return { label: 'Vencida', urgent: true, overdue: true };
  const days = differenceInDays(due, new Date());
  const hours = differenceInHours(due, new Date());
  const mins = differenceInMinutes(due, new Date());
  if (days > 0) return { label: `${days}d ${hours % 24}h`, urgent: days <= 2, overdue: false };
  if (hours > 0) return { label: `${hours}h ${mins % 60}m`, urgent: true, overdue: false };
  return { label: `${mins}m`, urgent: true, overdue: false };
};

export const isOverdue = (date) => isPast(new Date(date));
export const isFutureDate = (date) => isFuture(new Date(date));

export const periodProgress = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const now = new Date();
  const total = e - s;
  const elapsed = now - s;
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
};

export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};
