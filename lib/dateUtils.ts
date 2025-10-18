// Utilidades para manejo de fechas usando dayjs (más consistente entre plataformas)
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('es');

export const parseToDate = (ts: string | number | Date | null | undefined): dayjs.Dayjs | null => {
  if (!ts) return null;

  if (ts instanceof Date) return dayjs(ts);
  if (dayjs.isDayjs(ts as any)) return ts as unknown as dayjs.Dayjs;

  // dayjs puede parsear strings e numbers (ms)
  if (typeof ts === 'number') {
    // Aceptar segundos (10 dígitos) o milisegundos (13 dígitos)
    const ms = ts < 1e12 ? ts * 1000 : ts;
    return dayjs(ms);
  }

  if (typeof ts === 'string') {
    const d = dayjs(ts);
    return d.isValid() ? d : null;
  }

  return null;
};

export const formatTimestamp = (ts: string | number | Date | null | undefined): string => {
  const d = parseToDate(ts);
  if (!d) return '';
  // Formato consistente y legible: "18 oct 2025 14:23"
  return d.format('D MMM YYYY, HH:mm');
};

// Devuelve representación relativa: "hace 2 horas" o formato absoluto si muy lejano
export const formatRelative = (ts: string | number | Date | null | undefined, now: Date = new Date()): string => {
  const d = parseToDate(ts);
  if (!d) return '';

  const nowD = dayjs(now);
  const weeks = Math.abs(nowD.diff(d, 'week'));
  if (weeks >= 4) return formatTimestamp(d.toDate());

  return d.from(nowD);
};

export default {
  parseToDate,
  formatTimestamp,
  formatRelative,
};
